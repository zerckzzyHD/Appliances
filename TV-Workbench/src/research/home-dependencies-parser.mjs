import { parse as parseHTML } from "parse5";
import { parse as parseJS } from "acorn";
import { permittedDocumentURL } from "./home-document-policy.mjs";
import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";
import { HOME_DEPENDENCIES_FAILURE_REASONS } from "./home-dependencies-contract.mjs";

const SOURCE_LIMIT = 524288;
const SCRIPT_LIMIT = 32;
const INLINE_LIMIT = 8;
const INLINE_BYTE_LIMIT = 65536;
const AST_NODE_LIMIT = 8192;
const AST_DEPTH_LIMIT = 64;
const GRAPH_NODE_LIMIT = 32;
const GRAPH_EDGE_LIMIT = 32;
const UNSUPPORTED_LIMIT = 64;
const JS_MIMES = new Set([
  "",
  "module",
  "text/javascript",
  "application/javascript",
  "text/ecmascript",
  "application/ecmascript",
]);
const RESPONSE_METHODS = new Set(["json", "text", "blob", "arrayBuffer"]);
const STORAGE_READ_METHODS = new Set([
  "getItem",
  "key",
  "getStoreProperty",
  "getStorePropertyAsync",
  "getStoreProperties",
  "getTvStoreProperty",
  "getTvStoreProperties",
  "getConfigProperty",
]);
const STORAGE_WRITE_METHODS = new Set([
  "setItem",
  "removeItem",
  "clear",
  "setStoreProperty",
  "setTvStoreProperty",
]);
const FIXED_METHODS = new Map(
  HOME_REFERENCE_METHODS.map(([scope, name]) => [name, scope]),
);

function emptyDependencyShape() {
  return {
    scripts: 0,
    inlineScripts: 0,
    dataScripts: 0,
    srcScripts: 0,
    uniqueDirectScripts: 0,
    frames: 0,
    navigation: 0,
    eventHandlers: 0,
    bases: 0,
    baseState: "none",
    navigationState: "none",
    jsParse: "notAttempted",
  };
}

function bumpShape(result, key) {
  if (result.shape[key] >= 32) {
    result.saturated = true;
    result.truncated = true;
    return;
  }
  result.shape[key]++;
}

function emptyGraph() {
  return { nodes: [], edges: [] };
}

function newResult() {
  return {
    parse: "parsed",
    shape: emptyDependencyShape(),
    truncated: false,
    sourceTruncated: false,
    parseIncomplete: false,
    saturated: false,
    scriptCandidates: [],
    graph: emptyGraph(),
    methods: [],
    unsupportedCount: 0,
    reason: "noCandidate",
  };
}

function noteFailure(result, reason) {
  if (
    !result.failureReason &&
    HOME_DEPENDENCIES_FAILURE_REASONS.includes(reason)
  )
    result.failureReason = reason;
}

function traversalFailureReason(error) {
  return ["astNodeLimit", "astDepthLimit"].includes(error?.failureReason)
    ? error.failureReason
    : "unknownInternalFailure";
}

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

function memberPath(node) {
  if (node?.type === "ChainExpression") return memberPath(node.expression);
  if (node?.type === "Identifier") return node.name;
  if (
    node?.type === "MemberExpression" &&
    !node.computed &&
    node.property?.type === "Identifier"
  ) {
    const object = memberPath(node.object);
    return object ? object + "." + node.property.name : null;
  }
  return null;
}

function unwrapAwait(node) {
  return node?.type === "AwaitExpression" ? unwrapAwait(node.argument) : node;
}

function isFunction(node) {
  return [
    "FunctionDeclaration",
    "FunctionExpression",
    "ArrowFunctionExpression",
  ].includes(node?.type);
}

function walkChildren(node, visit, depth) {
  for (const [key, child] of Object.entries(node)) {
    if (["start", "end", "type", "loc", "range", "raw"].includes(key)) continue;
    if (Array.isArray(child)) {
      for (const item of child)
        if (item && typeof item === "object") visit(item, depth + 1);
    } else if (child && typeof child === "object") visit(child, depth + 1);
  }
}

function addPatternNames(pattern, add) {
  if (!pattern) return;
  if (pattern.type === "Identifier") {
    add(pattern.name);
    return;
  }
  if (pattern.type === "RestElement")
    return addPatternNames(pattern.argument, add);
  if (pattern.type === "AssignmentPattern")
    return addPatternNames(pattern.left, add);
  if (pattern.type === "ArrayPattern") {
    for (const item of pattern.elements) addPatternNames(item, add);
    return;
  }
  if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties)
      addPatternNames(
        property.type === "RestElement" ? property.argument : property.value,
        add,
      );
  }
}

function buildScopes(ast, guard) {
  const nodeScope = new WeakMap();
  const functionScope = new WeakMap();
  const functionParent = new WeakMap();
  const parentNode = new WeakMap();
  const declaratorBindings = new WeakMap();
  const parameterBindings = new WeakMap();
  const invalidBindings = new WeakSet();
  const assignedGlobals = new Set();
  const mutatedPaths = new Set();
  let rootScope;

  function makeScope(parent, kind) {
    return {
      parent,
      kind,
      bindings: new Map(),
    };
  }
  function nearestFunction(scope) {
    for (let current = scope; current; current = current.parent)
      if (["program", "function"].includes(current.kind)) return current;
    return rootScope;
  }
  function declare(scope, name, definition = null) {
    let binding = scope.bindings.get(name);
    if (!binding) {
      binding = { scope, name, definitions: [] };
      scope.bindings.set(name, binding);
    }
    binding.definitions.push(definition);
    return binding;
  }
  function visit(node, inherited, depth, reuseBlock = false) {
    guard(node, depth);
    let scope = inherited;
    if (node.type === "Program") {
      scope = rootScope = makeScope(null, "program");
    } else if (isFunction(node)) {
      if (node.type === "FunctionDeclaration" && node.id)
        declare(inherited, node.id.name, node);
      scope = makeScope(inherited, "function");
      functionScope.set(node, scope);
      if (node.type === "FunctionExpression" && node.id)
        declare(scope, node.id.name, node);
      const params = [];
      for (const param of node.params)
        addPatternNames(param, (name) => params.push(declare(scope, name)));
      parameterBindings.set(node, params);
    } else if (node.type === "BlockStatement" && !reuseBlock) {
      scope = makeScope(inherited, "block");
    } else if (
      /^For(In|Of)?Statement$/.test(node.type) ||
      node.type === "SwitchStatement"
    ) {
      scope = makeScope(inherited, "block");
    } else if (node.type === "CatchClause") {
      scope = makeScope(inherited, "block");
      if (node.param)
        addPatternNames(node.param, (name) => declare(scope, name));
    } else if (
      node.type === "ClassExpression" ||
      node.type === "ClassDeclaration"
    ) {
      if (node.type === "ClassDeclaration" && node.id)
        declare(inherited, node.id.name, node);
      scope = makeScope(inherited, "class");
      if (node.type === "ClassExpression" && node.id)
        declare(scope, node.id.name, node);
    }
    nodeScope.set(node, scope);

    if (node.type === "VariableDeclaration") {
      const target = node.kind === "var" ? nearestFunction(scope) : scope;
      for (const declaration of node.declarations) {
        const bindings = [];
        addPatternNames(declaration.id, (name) =>
          bindings.push(
            declare(
              target,
              name,
              isFunction(declaration.init) ? declaration.init : null,
            ),
          ),
        );
        declaratorBindings.set(declaration, bindings);
      }
    } else if (node.type === "ImportDeclaration") {
      for (const specifier of node.specifiers)
        declare(scope, specifier.local.name);
    }

    const currentFunction = isFunction(node) ? node : functionParent.get(node);
    walkChildren(
      node,
      (child, childDepth) => {
        parentNode.set(child, node);
        functionParent.set(child, currentFunction);
        visit(
          child,
          scope,
          childDepth,
          isFunction(node) && child === node.body,
        );
      },
      depth,
    );
  }
  visit(ast, null, 0);

  function invalidateAssignments(node, depth) {
    guard(node, depth);
    if (node.type === "AssignmentExpression") {
      const scope = nodeScope.get(node);
      if (node.left.type === "Identifier") {
        const binding = resolve(scope, node.left.name);
        if (binding) invalidBindings.add(binding);
        else assignedGlobals.add(node.left.name);
      } else {
        addPatternNames(node.left, (name) => {
          const binding = resolve(scope, name);
          if (binding) invalidBindings.add(binding);
          else assignedGlobals.add(name);
        });
        const path = memberPath(node.left);
        if (path) mutatedPaths.add(path);
      }
    } else if (
      node.type === "UpdateExpression" &&
      node.argument.type === "Identifier"
    ) {
      const binding = resolve(nodeScope.get(node), node.argument.name);
      if (binding) invalidBindings.add(binding);
      else assignedGlobals.add(node.argument.name);
    } else if (
      node.type === "UpdateExpression" &&
      node.argument.type === "MemberExpression"
    ) {
      const path = memberPath(node.argument);
      if (path) mutatedPaths.add(path);
    } else if (
      ["ForInStatement", "ForOfStatement"].includes(node.type) &&
      node.left?.type === "Identifier"
    ) {
      const binding = resolve(nodeScope.get(node), node.left.name);
      if (binding) invalidBindings.add(binding);
      else assignedGlobals.add(node.left.name);
    }
    walkChildren(node, invalidateAssignments, depth);
  }
  function resolve(scope, name) {
    for (let current = scope; current; current = current.parent) {
      const binding = current.bindings.get(name);
      if (binding) return binding;
    }
    return null;
  }
  invalidateAssignments(ast, 0);

  function unshadowed(scope, name) {
    return resolve(scope, name) === null && !assignedGlobals.has(name);
  }
  function stablePath(path) {
    if (!path) return false;
    for (const mutated of mutatedPaths)
      if (path === mutated || path.startsWith(mutated + ".")) return false;
    return true;
  }
  function resolveFunction(scope, name) {
    const binding = resolve(scope, name);
    if (
      !binding ||
      invalidBindings.has(binding) ||
      binding.definitions.length !== 1
    )
      return null;
    return isFunction(binding.definitions[0]) ? binding.definitions[0] : null;
  }
  return {
    nodeScope,
    functionScope,
    functionParent,
    parentNode,
    declaratorBindings,
    parameterBindings,
    invalidBindings,
    resolve,
    unshadowed,
    stablePath,
    resolveFunction,
  };
}

function createGraphBuilder(result) {
  const graph = result.graph;
  const edgesSeen = new Set();
  return {
    addNode(kind) {
      if (graph.nodes.length >= GRAPH_NODE_LIMIT) {
        result.saturated = true;
        result.truncated = true;
        return null;
      }
      const id = graph.nodes.length;
      graph.nodes.push({ id, resource: "root", kind });
      return id;
    },
    setKind(id, kind) {
      if (id !== null && graph.nodes[id]) graph.nodes[id].kind = kind;
    },
    addEdge(from, to, relationship) {
      if (from === null || to === null || from === to) return;
      const key = `${from}:${to}:${relationship}`;
      if (edgesSeen.has(key)) return;
      if (graph.edges.length >= GRAPH_EDGE_LIMIT) {
        result.saturated = true;
        result.truncated = true;
        return;
      }
      edgesSeen.add(key);
      graph.edges.push({ from, to, relationship });
    },
  };
}

function noteUnsupported(result, amount = 1) {
  const accepted = Math.min(
    amount,
    UNSUPPORTED_LIMIT - result.unsupportedCount,
  );
  result.unsupportedCount += accepted;
  if (accepted !== amount) {
    result.saturated = true;
    result.truncated = true;
  }
}

function fixedSDKMethod(path, scopeInfo, scope) {
  const pieces = path?.split(".") || [];
  const name = pieces.at(-1);
  const expectedScope = FIXED_METHODS.get(name);
  if (!expectedScope) return null;
  let valid = false;
  if (expectedScope === "VIZIO") {
    valid =
      ["VIZIO." + name].includes(path) && scopeInfo.unshadowed(scope, "VIZIO");
  } else {
    const roots = [
      `${expectedScope}.${name}`,
      `VIZIO.${expectedScope}.${name}`,
      `VIZIO_MODULES.${expectedScope}.${name}`,
    ];
    if (!roots.includes(path)) return null;
    const root = pieces[0];
    valid = scopeInfo.unshadowed(scope, root);
    if (root === "VIZIO_MODULES")
      valid &&= scopeInfo.unshadowed(scope, "VIZIO_MODULES");
  }
  return valid && scopeInfo.stablePath(path)
    ? { scope: expectedScope, name }
    : null;
}

function storagePath(path, scopeInfo, scope) {
  if (!path) return null;
  const pieces = path.split(".");
  let root;
  let method;
  if (
    pieces.length === 2 &&
    ["localStorage", "sessionStorage"].includes(pieces[0])
  ) {
    [root, method] = pieces;
  } else if (
    pieces.length === 3 &&
    pieces[0] === "window" &&
    ["localStorage", "sessionStorage"].includes(pieces[1])
  ) {
    root = "window";
    method = pieces[2];
  } else return null;
  return scopeInfo.unshadowed(scope, root) && scopeInfo.stablePath(path)
    ? method
    : null;
}

function isDOMReceiver(path, scopeInfo, scope, domBindings) {
  if (path === "document" || path === "window")
    return scopeInfo.unshadowed(scope, path) && scopeInfo.stablePath(path);
  if (path === "document.body" || path === "document.documentElement")
    return (
      scopeInfo.unshadowed(scope, "document") && scopeInfo.stablePath(path)
    );
  if (/^[A-Za-z_$][\w$]*$/.test(path || "")) {
    const binding = scopeInfo.resolve(scope, path);
    return Boolean(
      binding && domBindings.has(binding) && scopeInfo.stablePath(path),
    );
  }
  return null;
}

function isNavigationAssignment(path, scopes, scope) {
  if (!path) return false;
  const base = path.endsWith(".href") ? path.slice(0, -5) : path;
  if (base === "location")
    return scopes.unshadowed(scope, "location") && scopes.stablePath(base);
  if (base === "window.location")
    return scopes.unshadowed(scope, "window") && scopes.stablePath(base);
  if (base === "document.location")
    return scopes.unshadowed(scope, "document") && scopes.stablePath(base);
  return false;
}

function isNavigationCall(path, scopes, scope) {
  if (!path) return false;
  for (const [base, suffix] of [
    ["location", ".assign"],
    ["location", ".replace"],
    ["window.location", ".assign"],
    ["window.location", ".replace"],
    ["document.location", ".assign"],
    ["document.location", ".replace"],
  ]) {
    if (path === base + suffix) {
      const root = base.startsWith("window")
        ? "window"
        : base.startsWith("document")
          ? "document"
          : "location";
      return scopes.unshadowed(scope, root) && scopes.stablePath(path);
    }
  }
  if (path === "window.open")
    return scopes.unshadowed(scope, "window") && scopes.stablePath(path);
  if (["history.pushState", "history.replaceState"].includes(path))
    return scopes.unshadowed(scope, "history") && scopes.stablePath(path);
  return false;
}

function analyzeJavaScript(source, module, result, budget) {
  let ast;
  try {
    ast = parseJS(source, {
      ecmaVersion: 2022,
      sourceType: module ? "module" : "script",
      allowHashBang: true,
    });
  } catch (error) {
    noteFailure(
      result,
      error instanceof SyntaxError ? "syntaxError" : "unknownInternalFailure",
    );
    result.shape.jsParse =
      result.shape.jsParse === "parsed" ? "partial" : "failed";
    result.parseIncomplete = true;
    result.truncated = true;
    return;
  }

  const seen = new WeakSet();
  const guard = (node, depth) => {
    if (depth > AST_DEPTH_LIMIT) throw { failureReason: "astDepthLimit" };
    if (!seen.has(node)) {
      seen.add(node);
      if (++budget.nodes > AST_NODE_LIMIT)
        throw { failureReason: "astNodeLimit" };
    }
  };
  let scopes;
  try {
    scopes = buildScopes(ast, guard);
  } catch (error) {
    noteFailure(result, traversalFailureReason(error));
    result.shape.jsParse = "limit";
    result.parseIncomplete = true;
    result.truncated = true;
    return;
  }
  if (!["failed", "partial", "limit"].includes(result.shape.jsParse))
    result.shape.jsParse = "parsed";
  const builder = createGraphBuilder(result);
  const functionIds = new WeakMap();
  const callIds = new WeakMap();
  const callKinds = new WeakMap();
  const networkCalls = new WeakSet();
  const bindingReads = new WeakMap();
  const domBindings = new WeakSet();
  const domCreationExpressions = new WeakMap();
  const fixed = new Map();
  const calls = [];

  function walk(node, depth, visit) {
    guard(node, depth);
    visit(node, depth);
    walkChildren(
      node,
      (child, childDepth) => walk(child, childDepth, visit),
      depth,
    );
  }

  try {
    walk(ast, 0, (node) => {
      if (isFunction(node)) {
        const id = builder.addNode("function");
        functionIds.set(node, id);
      }
    });
    walk(ast, 0, (node) => {
      if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
        const scope = scopes.nodeScope.get(node);
        const init = unwrapAwait(node.init);
        const path =
          init?.type === "CallExpression" ? memberPath(init.callee) : null;
        const binding = (scopes.declaratorBindings.get(node) || [])[0];
        if (
          binding &&
          !scopes.invalidBindings.has(binding) &&
          [
            "document.createElement",
            "document.createTextNode",
            "document.getElementById",
            "document.querySelector",
            "document.querySelectorAll",
          ].includes(path) &&
          scopes.unshadowed(scope, "document")
        ) {
          domBindings.add(binding);
          if (
            ["document.createElement", "document.createTextNode"].includes(path)
          )
            domCreationExpressions.set(binding, init);
        }
      }
      if (
        node.type === "ImportDeclaration" ||
        node.type === "ExportAllDeclaration"
      )
        noteUnsupported(result);
      if (node.type === "ExportNamedDeclaration" && node.source)
        noteUnsupported(result);
      if (node.type === "ImportExpression") noteUnsupported(result);
      if (node.type === "MemberExpression" && node.computed) {
        noteUnsupported(result);
        const objectPath = memberPath(node.object);
        const scope = scopes.nodeScope.get(node);
        if (
          [
            "location",
            "window",
            "window.location",
            "document.location",
          ].includes(objectPath) &&
          ((objectPath === "location" &&
            scopes.unshadowed(scope, "location")) ||
            (objectPath.startsWith("window") &&
              scopes.unshadowed(scope, "window")) ||
            (objectPath.startsWith("document") &&
              scopes.unshadowed(scope, "document")))
        )
          result.shape.navigationState = "unknown";
      }
      if (node.type === "AssignmentExpression") {
        const scope = scopes.nodeScope.get(node);
        if (isNavigationAssignment(memberPath(node.left), scopes, scope)) {
          bumpShape(result, "navigation");
          if (result.shape.navigationState !== "unknown")
            result.shape.navigationState = "present";
        }
        const leftPath = memberPath(node.left);
        if (
          node.left.type === "MemberExpression" &&
          !node.left.computed &&
          storagePath(memberPath(node.left.object), scopes, scope)
        ) {
          const id = builder.addNode("storageWrite");
          const owner = scopes.functionParent.get(node);
          if (owner) builder.addEdge(functionIds.get(owner), id, "contains");
        }
        const leftParts = leftPath?.split(".") || [];
        const eventName = leftParts.at(-1);
        const receiver = leftParts.slice(0, -1).join(".");
        if (
          /^on[a-z]+$/i.test(eventName || "") &&
          isDOMReceiver(receiver, scopes, scope, domBindings)
        ) {
          const id = builder.addNode("eventRegistration");
          const owner = scopes.functionParent.get(node);
          if (owner) builder.addEdge(functionIds.get(owner), id, "contains");
          const callback = node.right;
          const fn = isFunction(callback)
            ? callback
            : callback?.type === "Identifier"
              ? scopes.resolveFunction(scope, callback.name)
              : null;
          if (fn) builder.addEdge(id, functionIds.get(fn), "registersCallback");
          else noteUnsupported(result);
        }
      }
      if (node.type !== "CallExpression" && node.type !== "NewExpression")
        return;
      const scope = scopes.nodeScope.get(node);
      const path = memberPath(node.callee);
      let kind = "call";
      const fetchCall =
        node.type === "CallExpression" &&
        ((path === "fetch" && scopes.unshadowed(scope, "fetch")) ||
          (path === "window.fetch" && scopes.unshadowed(scope, "window")));
      if (fetchCall) {
        const options = node.arguments[1];
        let methodKnownGet = !options;
        if (options?.type === "ObjectExpression") {
          let hasMethod = false;
          let supportedOptions = true;
          for (const property of options.properties) {
            if (
              property.type !== "Property" ||
              property.computed ||
              property.kind !== "init"
            ) {
              supportedOptions = false;
              break;
            }
            const key =
              property.key.type === "Identifier"
                ? property.key.name
                : property.key.value;
            if (key === "method") {
              hasMethod = true;
              methodKnownGet ||=
                property.value.type === "Literal" &&
                typeof property.value.value === "string" &&
                property.value.value.toUpperCase() === "GET";
              if (!methodKnownGet) supportedOptions = false;
            } else if (
              ![
                "headers",
                "credentials",
                "cache",
                "mode",
                "redirect",
                "referrer",
                "referrerPolicy",
                "integrity",
                "keepalive",
                "signal",
              ].includes(key)
            ) {
              supportedOptions = false;
              break;
            }
          }
          methodKnownGet = supportedOptions && (!hasMethod || methodKnownGet);
        }
        if (methodKnownGet) {
          kind = "networkRead";
          networkCalls.add(node);
        } else {
          noteUnsupported(result);
        }
      }
      if (
        node.type === "CallExpression" &&
        isNavigationCall(path, scopes, scope)
      ) {
        bumpShape(result, "navigation");
        if (result.shape.navigationState !== "unknown")
          result.shape.navigationState = "present";
      }
      const storage = storagePath(path, scopes, scope);
      if (storage && STORAGE_READ_METHODS.has(storage)) kind = "storageRead";
      if (storage && STORAGE_WRITE_METHODS.has(storage)) kind = "storageWrite";
      const method = fixedSDKMethod(path, scopes, scope);
      if (method) {
        fixed.set(method.scope + ":" + method.name, method);
        if (
          [
            "getStoreProperty",
            "getStorePropertyAsync",
            "getStoreProperties",
            "getTvStoreProperty",
            "getTvStoreProperties",
            "getConfigProperty",
          ].includes(method.name)
        )
          kind = "storageRead";
        if (["setStoreProperty", "setTvStoreProperty"].includes(method.name))
          kind = "storageWrite";
        if (method.name === "launchApp") kind = "launchCall";
      }
      if (
        ["document.createElement", "document.createTextNode"].includes(path) &&
        scopes.unshadowed(scope, "document")
      )
        kind = "domCreate";
      const pathParts = path?.split(".") || [];
      const methodName = pathParts.at(-1);
      const receiver = pathParts.slice(0, -1).join(".");
      if (
        methodName === "addEventListener" &&
        isDOMReceiver(receiver, scopes, scope, domBindings)
      )
        kind = "eventRegistration";
      if (
        [
          "appendChild",
          "insertBefore",
          "replaceChild",
          "append",
          "prepend",
        ].includes(methodName) &&
        isDOMReceiver(receiver, scopes, scope, domBindings)
      )
        kind = "domInsert";
      const id = builder.addNode(kind);
      callIds.set(node, id);
      callKinds.set(node, kind);
      calls.push(node);
    });

    const buildRelations = (node, depth, parentFunction = null) => {
      guard(node, depth);
      let active = parentFunction;
      if (isFunction(node)) {
        active = node;
        if (parentFunction !== null)
          builder.addEdge(
            functionIds.get(parentFunction),
            functionIds.get(node),
            "contains",
          );
      }
      if (node.type === "CallExpression" || node.type === "NewExpression") {
        const id = callIds.get(node);
        if (active !== null)
          builder.addEdge(functionIds.get(active), id, "contains");
        const callee = node.callee;
        const scope = scopes.nodeScope.get(node);
        if (callee?.type === "Identifier") {
          const target = scopes.resolveFunction(scope, callee.name);
          if (target)
            builder.addEdge(id, functionIds.get(target), "directCall");
        }
      }
      walkChildren(
        node,
        (child, childDepth) => buildRelations(child, childDepth, active),
        depth,
      );
    };
    buildRelations(ast, 0);

    function directNetworkCall(node, scope) {
      const expression = unwrapAwait(node);
      if (!expression) return null;
      if (networkCalls.has(expression)) return callIds.get(expression) ?? null;
      if (expression.type === "Identifier") {
        const binding = scopes.resolve(scope, expression.name);
        if (!binding || !bindingReads.has(binding)) return null;
        return bindingReads.get(binding);
      }
      return null;
    }

    const dataflowWalk = (node, depth) => {
      guard(node, depth);
      const scope = scopes.nodeScope.get(node);
      if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
        const bindings = scopes.declaratorBindings.get(node) || [];
        const binding = bindings[0];
        const init =
          node.init?.type === "AwaitExpression" ? node.init.argument : null;
        const read = directNetworkCall(init, scope);
        if (binding && !scopes.invalidBindings.has(binding) && read !== null)
          bindingReads.set(binding, read);
      }
      if (
        node.type === "AssignmentExpression" &&
        node.left.type === "Identifier"
      ) {
        const binding = scopes.resolve(scope, node.left.name);
        const read =
          node.right?.type === "AwaitExpression"
            ? directNetworkCall(node.right.argument, scope)
            : null;
        if (binding && !scopes.invalidBindings.has(binding) && read !== null)
          bindingReads.set(binding, read);
      }
      if (node.type === "CallExpression") {
        const path = memberPath(node.callee);
        const scopeInfo = scopes;
        const scopeHere = scope;
        const pieces = path?.split(".") || [];
        const method =
          node.callee?.type === "MemberExpression" &&
          !node.callee.computed &&
          node.callee.property?.type === "Identifier"
            ? node.callee.property.name
            : pieces.at(-1);
        const object =
          node.callee?.type === "MemberExpression" ? node.callee.object : null;
        const objectBinding =
          object?.type === "Identifier"
            ? scopes.resolve(scopeHere, object.name)
            : null;
        const source = objectBinding && bindingReads.get(objectBinding);
        if (
          RESPONSE_METHODS.has(method) &&
          source !== undefined &&
          source !== null &&
          callIds.has(node)
        ) {
          builder.setKind(callIds.get(node), "responseConsume");
          builder.addEdge(source, callIds.get(node), "responseConsumer");
        }
        if (callKinds.get(node) === "domInsert" && node.arguments.length) {
          const argument = node.arguments[0];
          const inserted =
            argument?.type === "Identifier"
              ? scopes.resolve(scopeHere, argument.name)
              : null;
          const createExpression = inserted
            ? domCreationExpressions.get(inserted)
            : null;
          const createId = createExpression
            ? callIds.get(createExpression)
            : callIds.get(argument);
          if (createId !== undefined && createId !== null)
            builder.addEdge(createId, callIds.get(node), "inserts");
        }
        if (callKinds.get(node) === "eventRegistration") {
          const callback = node.arguments[1];
          let fn = isFunction(callback)
            ? callback
            : callback?.type === "Identifier"
              ? scopes.resolveFunction(scopeHere, callback.name)
              : null;
          if (fn)
            builder.addEdge(
              callIds.get(node),
              functionIds.get(fn),
              "registersCallback",
            );
          else noteUnsupported(result);
        }

        if (method === "then" && object) {
          const read = networkCalls.has(object)
            ? (callIds.get(object) ?? null)
            : null;
          const callback = node.arguments[0];
          const fn = isFunction(callback)
            ? callback
            : callback?.type === "Identifier"
              ? scopes.resolveFunction(scopeHere, callback.name)
              : null;
          if (read !== null && fn && fn.params[0]?.type === "Identifier") {
            const paramBindings = scopes.parameterBindings.get(fn) || [];
            const paramBinding = paramBindings[0];
            walk(fn.body, 0, (item) => {
              if (
                item.type !== "CallExpression" ||
                !RESPONSE_METHODS.has(
                  memberPath(item.callee)?.split(".").at(-1),
                )
              )
                return;
              const responseObject =
                item.callee?.type === "MemberExpression"
                  ? item.callee.object
                  : null;
              if (
                responseObject?.type === "Identifier" &&
                scopes.resolve(
                  scopes.nodeScope.get(item),
                  responseObject.name,
                ) === paramBinding
              ) {
                builder.setKind(callIds.get(item), "responseConsume");
                builder.addEdge(read, callIds.get(item), "responseConsumer");
              }
            });
          }
        }
      }
      walkChildren(
        node,
        (child, childDepth) => dataflowWalk(child, childDepth),
        depth,
      );
    };
    dataflowWalk(ast, 0);

    // Record only direct, statically named DOM creation results for insertion edges.
    // The source and local identifiers remain inside this worker and never enter the graph.
  } catch (error) {
    noteFailure(result, traversalFailureReason(error));
    result.shape.jsParse = "limit";
    result.parseIncomplete = true;
    result.truncated = true;
  }

  result.methods = [
    ...new Map(
      [
        ...result.methods,
        ...[...fixed.values()].map((method) => ({
          scope: method.scope,
          name: method.name,
          type: "function",
        })),
      ].map((method) => [method.scope + ":" + method.name, method]),
    ).values(),
  ].slice(0, HOME_REFERENCE_METHODS.length);
}

function inspectHTML(source, base, result, budget) {
  const htmlErrors = [];
  let tree;
  try {
    tree = parseHTML(source, {
      sourceCodeLocationInfo: true,
      scriptingEnabled: true,
      onParseError(error) {
        if (error.code !== "missing-doctype") htmlErrors.push(error);
      },
    });
  } catch {
    noteFailure(result, "unknownInternalFailure");
    result.parse = "failed";
    result.parseIncomplete = true;
    result.truncated = true;
    return;
  }

  const active = [];
  const seen = new WeakSet();
  let overLimit = false;
  function walk(node, depth) {
    if (depth > AST_DEPTH_LIMIT) throw { failureReason: "astDepthLimit" };
    if (!seen.has(node)) {
      seen.add(node);
      if (++budget.nodes > AST_NODE_LIMIT)
        throw { failureReason: "astNodeLimit" };
    }
    if (node.tagName === "template") return;
    if (node.tagName) active.push(node);
    for (const child of node.childNodes || []) walk(child, depth + 1);
  }
  try {
    walk(tree, 0);
  } catch (error) {
    noteFailure(result, traversalFailureReason(error));
    result.parse = "limit";
    result.parseIncomplete = true;
    result.truncated = true;
    return;
  }

  const attr = (node, name) =>
    node.attrs?.find((entry) => entry.name === name)?.value;
  let effectiveBase = base;
  let firstHrefSeen = false;
  for (const node of active) {
    if (node.tagName !== "base") continue;
    bumpShape(result, "bases");
    if (attr(node, "target") !== undefined) {
      result.shape.navigationState = "unknown";
      noteUnsupported(result);
    }
    const href = attr(node, "href");
    if (href === undefined || firstHrefSeen) continue;
    firstHrefSeen = true;
    const resolved = permittedDocumentURL(href, base);
    if (!resolved || resolved.origin !== new URL(base).origin) {
      result.shape.baseState = "invalid";
      result.reason = "policyDenied";
    } else {
      effectiveBase = resolved.href;
      result.shape.baseState = "valid";
    }
  }
  if (result.shape.bases > 1 && result.shape.baseState !== "invalid")
    result.shape.baseState = "multiple";

  const candidates = new Map();
  const inlineTexts = [];
  for (const node of active) {
    const tag = node.tagName;
    if (["frame", "iframe", "frameset"].includes(tag))
      bumpShape(result, "frames");
    if (node.attrs?.some((entry) => entry.name.startsWith("on"))) {
      bumpShape(result, "eventHandlers");
      result.shape.navigationState = "unknown";
      noteUnsupported(result);
    }
    if (
      tag === "meta" &&
      (attr(node, "http-equiv") || "").trim().toLowerCase() === "refresh"
    ) {
      bumpShape(result, "navigation");
      if (result.shape.navigationState !== "unknown")
        result.shape.navigationState = "present";
    }
    if (tag === "script") {
      if (result.shape.scripts >= SCRIPT_LIMIT) {
        overLimit = true;
        result.saturated = true;
        result.truncated = true;
        continue;
      }
      result.shape.scripts++;
      const type = (attr(node, "type") || "").trim().toLowerCase();
      if (!JS_MIMES.has(type)) {
        result.shape.dataScripts++;
        continue;
      }
      const mode = type === "module" ? "module" : "classic";
      const src = attr(node, "src");
      if (src !== undefined) {
        result.shape.srcScripts++;
        let href;
        try {
          href = new URL(src, effectiveBase).href;
        } catch {
          result.reason = "policyDenied";
          continue;
        }
        const existing = candidates.get(href);
        if (existing) {
          if (existing.mode !== mode) existing.mode = "mixed";
        } else if (candidates.size < SCRIPT_LIMIT) {
          candidates.set(href, { href, mode });
        } else {
          overLimit = true;
          result.saturated = true;
        }
      } else {
        result.shape.inlineScripts++;
        if (result.shape.inlineScripts > INLINE_LIMIT) {
          overLimit = true;
          result.saturated = true;
          result.truncated = true;
          continue;
        }
        const text = (node.childNodes || [])
          .map((child) => (child.nodeName === "#text" ? child.value : ""))
          .join("");
        inlineTexts.push({ text, module: mode === "module" });
      }
    }
  }

  result.scriptCandidates = [...candidates.values()];
  result.shape.uniqueDirectScripts = result.scriptCandidates.length;
  const inlineBytes = inlineTexts.reduce(
    (sum, item) => sum + byteLength(item.text),
    0,
  );
  if (inlineBytes > INLINE_BYTE_LIMIT) {
    overLimit = true;
    result.saturated = true;
    result.truncated = true;
  }
  if (
    result.shape.navigationState !== "unknown" &&
    result.shape.navigation === 0
  )
    result.shape.navigationState = "none";

  if (inlineBytes <= INLINE_BYTE_LIMIT) {
    for (const item of inlineTexts) {
      if (result.parse !== "parsed") break;
      analyzeJavaScript(item.text, item.module, result, budget);
      if (result.failureReason) break;
    }
  } else if (result.parse === "parsed") result.parse = "limit";
  if (htmlErrors.length && result.parse === "parsed") {
    result.parse = "partial";
    result.parseIncomplete = true;
    result.truncated = true;
  }
  if (overLimit && result.parse === "parsed") {
    result.parse = "limit";
    result.parseIncomplete = true;
    result.truncated = true;
  }
  if (result.shape.jsParse === "limit") result.parse = "limit";
  else if (["failed", "partial"].includes(result.shape.jsParse))
    result.parse = "partial";
  if (result.shape.baseState === "invalid") result.reason = "policyDenied";
  else if (
    result.shape.frames ||
    result.shape.navigation ||
    result.shape.navigationState === "unknown" ||
    result.shape.baseState === "multiple"
  )
    result.reason = "ambiguous";
  else if (
    result.scriptCandidates.some((candidate) => candidate.mode === "mixed")
  )
    result.reason = "ambiguous";
  else if (result.scriptCandidates.length > 2) result.reason = "ambiguous";
  else if (result.scriptCandidates.length !== 2) result.reason = "noCandidate";
  else {
    const categories = result.scriptCandidates.map((candidate) => {
      const permitted = permittedDocumentURL(candidate.href, base);
      if (permitted && permitted.origin === new URL(base).origin)
        return "allowed";
      try {
        return new URL(candidate.href, base).origin !== new URL(base).origin
          ? "external"
          : "denied";
      } catch {
        return "denied";
      }
    });
    if (categories.includes("external")) result.reason = "external";
    else if (categories.includes("denied")) result.reason = "policyDenied";
    else result.reason = "ready";
  }
}

function normalizeResult(result) {
  result.graph.nodes = result.graph.nodes.slice(0, GRAPH_NODE_LIMIT);
  result.graph.edges = result.graph.edges
    .filter(
      (edge) =>
        result.graph.nodes.some((node) => node.id === edge.from) &&
        result.graph.nodes.some((node) => node.id === edge.to),
    )
    .slice(0, GRAPH_EDGE_LIMIT);
  result.methods = result.methods
    .filter(
      (method, index, all) =>
        all.findIndex(
          (item) => item.scope === method.scope && item.name === method.name,
        ) === index,
    )
    .slice(0, HOME_REFERENCE_METHODS.length);
  if (result.parse !== "parsed") result.parseIncomplete = true;
  return result;
}

// Static syntax inspection only. `scriptCandidates` contains private worker-to-page URLs;
// the closed report contract intentionally has no field that can retain them.
export function parseHomeDependencies({ source, mime, base, module = false }) {
  const result = newResult();
  const budget = { nodes: 0 };
  if (
    typeof source !== "string" ||
    !["html", "javascript"].includes(mime) ||
    typeof base !== "string" ||
    !permittedDocumentURL(base) ||
    byteLength(source) > SOURCE_LIMIT
  ) {
    result.parse = "limit";
    result.truncated = true;
    result.sourceTruncated =
      typeof source === "string" && byteLength(source) > SOURCE_LIMIT;
    result.parseIncomplete = !result.sourceTruncated;
    result.reason = "parseIncomplete";
    result.shape.navigationState = "unknown";
    return result;
  }
  if (mime === "javascript") {
    analyzeJavaScript(source, module === true, result, budget);
    if (result.shape.jsParse === "limit") result.parse = "limit";
    else if (["failed", "partial"].includes(result.shape.jsParse))
      result.parse = "failed";
  } else {
    inspectHTML(source, base, result, budget);
  }
  return normalizeResult(result);
}

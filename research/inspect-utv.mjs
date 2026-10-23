import { open, readFile, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import {
  createHash,
  createPrivateKey,
  privateDecrypt,
  constants,
  createDecipheriv,
  X509Certificate,
  verify,
} from "node:crypto";

const [imagePath, catalogPath, reportPath] = process.argv.slice(2);
if (!imagePath || !catalogPath || !reportPath)
  throw new Error("Expected image, upstream catalog and new report path");
const digest = createHash("sha256");
for await (const chunk of createReadStream(imagePath)) digest.update(chunk);
const file = await open(imagePath, "r");
try {
  const size = (await file.stat()).size;
  const prefix = Buffer.alloc(4);
  await file.read(prefix, 0, 4, 0);
  const length = prefix.readUInt32BE();
  if (length < 1 || length > 1024 * 1024 || length + 4 > size)
    throw new Error("Invalid envelope length");
  const token = Buffer.alloc(length);
  await file.read(token, 0, length, 4);
  const parts = token.toString("ascii").split(".");
  if (parts.length !== 3) throw new Error("Expected JWT");
  const header = JSON.parse(Buffer.from(parts[0], "base64url"));
  const claims = JSON.parse(Buffer.from(parts[1], "base64url"));
  if (header.alg !== "RS512") throw new Error("Unexpected signature algorithm");
  if (
    !Number.isSafeInteger(claims.siz) ||
    !Number.isSafeInteger(claims.blk) ||
    claims.blk < 1 ||
    claims.blk > 64 * 1024 * 1024
  )
    throw new Error("Invalid payload dimensions");
  const leaf = new X509Certificate(claims.crt);
  const intermediate = new X509Certificate(claims.int);
  const blockCount = Math.ceil(claims.siz / claims.blk);
  const report = {
    image: imagePath,
    bytes: size,
    sha256: digest.digest("hex"),
    envelopeBytes: length + 4,
    algorithm: header.alg,
    version: claims.sub,
    declaredInnerFilename: claims.upf,
    productCode: claims.opd,
    audience: claims.aud,
    payloadBytes: claims.siz,
    blockBytes: claims.blk,
    blockCount,
    framedSizeMatches: length + 4 + claims.siz + blockCount * 16 === size,
    jwtSignatureMatchesEmbeddedLeaf: verify(
      "RSA-SHA512",
      Buffer.from(parts[0] + "." + parts[1]),
      leaf.publicKey,
      Buffer.from(parts[2], "base64url"),
    ),
    leafSignatureMatchesEmbeddedIntermediate: leaf.verify(
      intermediate.publicKey,
    ),
    independentTrustAnchorVerified: false,
    payloadAuthenticatedOrDecrypted: false,
    candidates: [],
  };
  const catalog = await readFile(catalogPath, "utf8");
  const section = catalog
    .split('collection "UTV_QTERICS":')[1]
    ?.split("\n}")[0];
  if (!section) throw new Error("Missing Qterics collection");
  for (const match of section.matchAll(
    /"([^"\n]+)":\s*\{"([A-Za-z0-9+/=]+)"\}/g,
  )) {
    const result = {
      name: match[1],
      unwrapSucceeded: false,
      firstBlockAuthenticated: false,
    };
    let secret;
    try {
      const candidate = createPrivateKey(Buffer.from(match[2], "base64"));
      secret = privateDecrypt(
        {
          key: candidate,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha1",
        },
        Buffer.from(claims.key, "base64"),
      );
      result.unwrapSucceeded = true;
      if (secret.length === 44) {
        const blockSize = Math.min(claims.siz, claims.blk);
        const block = Buffer.alloc(blockSize + 16);
        await file.read(block, 0, block.length, length + 4);
        const nonce = Buffer.alloc(12);
        secret.copy(nonce, 4, 36, 44);
        const decipher = createDecipheriv(
          "aes-128-gcm",
          secret.subarray(0, 16),
          nonce,
        );
        decipher.setAAD(secret.subarray(16, 32));
        decipher.setAuthTag(block.subarray(blockSize));
        const plaintext = Buffer.concat([
          decipher.update(block.subarray(0, blockSize)),
          decipher.final(),
        ]);
        result.firstBlockAuthenticated = true;
        result.plaintextPrefixHex = plaintext.subarray(0, 16).toString("hex");
        plaintext.fill(0);
      }
    } catch {
      /* A mismatch is recorded without printing key material. */
    } finally {
      secret?.fill(0);
    }
    report.candidates.push(result);
  }
  report.limitations =
    "Embedded signature consistency is not independent vendor trust. Public candidate-key checks cover only this catalog. No device writes or extracted program execution.";
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", {
    flag: "wx",
  });
  console.log(JSON.stringify(report, null, 2));
} finally {
  await file.close();
}

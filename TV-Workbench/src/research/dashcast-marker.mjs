export const DASHCAST_MARKER_CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "script-src 'none'",
].join("; ");

export const DASHCAST_MARKER_HEADERS = Object.freeze({
  "content-type": "text/html; charset=utf-8",
  "content-security-policy": DASHCAST_MARKER_CSP,
});

export const DASHCAST_MARKER_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MIST DASHCAST CONTROL</title>
  <style>
    :root { color-scheme: dark; }
    body {
      display: grid;
      min-height: 100vh;
      margin: 0;
      place-items: center;
      background: #000;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
    }
    h1 {
      margin: 0;
      padding: 1rem;
      font-size: clamp(3rem, 12vw, 10rem);
      line-height: 1.05;
      letter-spacing: 0.04em;
      text-align: center;
    }
  </style>
</head>
<body>
  <main>
    <h1>MIST DASHCAST CONTROL</h1>
  </main>
</body>
</html>`;

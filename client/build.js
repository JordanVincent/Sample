const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;
const fsExtra = require('fs-extra');
const http = require('http');

const CLIENT_PORT = 3000;
const ESBUILD_PORT = 3001;
const API_PORT = 3002;

const staticFilesPlugin = {
  name: 'staticFiles',
  setup(build) {
    build.onEnd(() => {
      fsExtra.copySync('public', 'dist');
    });
  },
};

async function main() {
  const context = await esbuild.context({
    entryPoints: ['./src/index.js'],
    outfile: 'dist/index.js',
    platform: 'browser',
    bundle: true,
    loader: {
      '.js': 'jsx',
      '.svg': 'file',
      '.jpg': 'file',
      '.png': 'file',
    },
    plugins: [sassPlugin(), staticFilesPlugin],
    define: {
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    },
  });

  await context.watch();
  await context.serve({ port: ESBUILD_PORT, servedir: 'dist' });

  // From: https://esbuild.github.io/api/#serve-proxy
  const proxyServer = http.createServer((req, res) => {
    const isApiRequest = req.url.startsWith('/api');

    // Forward requests to either the api server or the esbuild server
    const port = isApiRequest ? API_PORT : ESBUILD_PORT;
    const url = isApiRequest ? req.url.replace(/^\/api/, '') : req.url;

    const proxyReq = http.request(
      {
        hostname: '0.0.0.0',
        port,
        path: url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    // Forward the body of the request to esbuild
    req.pipe(proxyReq, { end: true });
  });

  proxyServer.listen(CLIENT_PORT);
  console.log(`Serving on port ${CLIENT_PORT}`);
}

main();

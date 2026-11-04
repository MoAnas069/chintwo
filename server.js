const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.map': 'application/json'
};

function serveFile(res, filePath, statusCode = 200) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            serve404(res);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(statusCode, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(data);
    });
}

function serve404(res) {
    const errorPage = path.join(ROOT_DIR, '404.html');
    if (fs.existsSync(errorPage)) {
        serveFile(res, errorPage, 404);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Enforce no trailing slash (except root '/') like live Framer site
    if (pathname.length > 1 && pathname.endsWith('/')) {
        const redirectPath = pathname.slice(0, -1) + (parsedUrl.search || '');
        res.writeHead(308, { Location: redirectPath });
        res.end();
        return;
    }

    // Rewrite legacy /images/ or /sites/... if requested
    if (pathname.startsWith('/images/')) {
        pathname = '/assets/images/' + pathname.slice('/images/'.length);
    } else if (pathname.startsWith('/sites/2taSyT2OLbVMIVlKVrycdC/')) {
        pathname = '/assets/scripts/' + pathname.slice('/sites/2taSyT2OLbVMIVlKVrycdC/'.length);
    }

    // 1. Direct file check
    let potentialPath = path.join(ROOT_DIR, pathname);
    if (fs.existsSync(potentialPath) && fs.statSync(potentialPath).isFile()) {
        serveFile(res, potentialPath);
        return;
    }

    // 2. Root check
    if (pathname === '/') {
        serveFile(res, path.join(ROOT_DIR, 'index.html'));
        return;
    }

    // 3. Clean route check: e.g. /about -> about/index.html or about.html
    const dirIndex = path.join(ROOT_DIR, pathname, 'index.html');
    if (fs.existsSync(dirIndex)) {
        serveFile(res, dirIndex);
        return;
    }

    const htmlFile = path.join(ROOT_DIR, pathname + '.html');
    if (fs.existsSync(htmlFile)) {
        serveFile(res, htmlFile);
        return;
    }

    // 4. Fallback 404
    serve404(res);
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` Chintwo Website Replica running successfully!`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});


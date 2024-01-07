const https = require("http2");
const fs = require("fs");
const path = require("path");

const https_port = 3000;

const options = {
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
    minVersion: "TLSv1.3" // Try 1.3 or 1.2
};

const server = https.createSecureServer(options, async (req, res) => {
    // Handle incoming requests
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is an HTTPS server!');
});

server.listen(https_port).on("listening", () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.on('close', () => {
    console.log('Server closed');
});

// set-cert-env.js
const { execSync } = require("child_process");
const path = require("path");

const caroot = execSync("mkcert -CAROOT").toString().trim();
const certPath = path.join(caroot, "rootCA.pem");

process.env.NODE_EXTRA_CA_CERTS = certPath;
require("./server");

const { fileURLToPath } = require('url');

exports.__filename = fileURLToPath(import.meta.url);
exports.__dirname = __dirname;
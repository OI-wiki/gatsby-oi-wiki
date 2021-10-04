/**
 * @file export compiled ES modules as a workaround before Gatsby properly handles it
 */

const esm = require('esm');
const fs = require('fs');
const Module = require('module');

// Node: bypass [ERR_REQUIRE_ESM]
const backup = Module._extensions['.js'];
Module._extensions['.js'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  module._compile(content, filename);
};

const esmRequire = esm(module, {
  cjs: true,
  mode: 'all',
});

// don't pollute Module
Module._extensions['.js'] = backup;

module.exports = esmRequire;

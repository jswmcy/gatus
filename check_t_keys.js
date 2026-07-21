var fs = require('fs');
var path = require('path');

// Load locale files
var en = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));

// Flatten nested object to dot-notation keys
function flatKeys(obj, prefix) {
  var keys = {};
  for (var k in obj) {
    var full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && k !== '_comment') {
      var sub = flatKeys(obj[k], full);
      for (var sk in sub) keys[sk] = true;
    } else if (k !== '_comment') {
      keys[full] = true;
    }
  }
  return keys;
}

var enKeys = flatKeys(en, '');
var zhKeys = flatKeys(zh, '');

// Walk all Vue files and extract t('...') keys
var root = 'C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src';
var missingEn = [];
var missingZh = [];
var found = {};

function walk(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(fp);
    } else if (e.name.endsWith('.vue')) {
      var content = fs.readFileSync(fp, 'utf8');
      // Match t('key') and t("key")
      var matches = content.match(/t\s*\(\s*['"]([^'"]+)['"]\s*\)/g) || [];
      for (var j = 0; j < matches.length; j++) {
        var keyMatch = matches[j].match(/t\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        if (keyMatch) {
          var key = keyMatch[1];
          // Skip parameterized keys like 'stepDetails.step'
          if (!found[key]) {
            found[key] = true;
            if (!enKeys[key]) missingEn.push(key + ' (used in ' + e.name + ')');
            if (!zhKeys[key]) missingZh.push(key + ' (used in ' + e.name + ')');
          }
        }
      }
    }
  }
}

walk(root);

console.log('Total unique t() keys found in Vue files: ' + Object.keys(found).length);
if (missingEn.length) {
  console.log('\nMISSING in en.json:');
  missingEn.forEach(function(k) { console.log('  ' + k); });
}
if (missingZh.length) {
  console.log('\nMISSING in zh-CN.json:');
  missingZh.forEach(function(k) { console.log('  ' + k); });
}
if (!missingEn.length && !missingZh.length) {
  console.log('\nAll t() keys exist in BOTH locale files: PASS');
}

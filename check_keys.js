var fs = require('fs');

// Load both locale files
var en = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));

// Extract all leaf keys from a nested object
function getKeys(obj, prefix) {
  var keys = [];
  for (var k in obj) {
    var full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

var enKeys = getKeys(en, '');
var zhKeys = getKeys(zh, '');

// Find missing keys in zh-CN
var missingInZh = enKeys.filter(function(k) { return zhKeys.indexOf(k) === -1; });

// Find extra keys in zh-CN (typos)
var extraInZh = zhKeys.filter(function(k) { return enKeys.indexOf(k) === -1; });

console.log('en.json key count: ' + enKeys.length);
console.log('zh-CN.json key count: ' + zhKeys.length);
console.log('');
if (missingInZh.length > 0) {
  console.log('MISSING in zh-CN.json:');
  missingInZh.forEach(function(k) { console.log('  ' + k); });
} else {
  console.log('Missing in zh-CN: NONE');
}
if (extraInZh.length > 0) {
  console.log('EXTRA in zh-CN.json (possible typo):');
  extraInZh.forEach(function(k) { console.log('  ' + k); });
}

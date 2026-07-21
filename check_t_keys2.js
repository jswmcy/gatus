var fs = require('fs');
var path = require('path');

// Load locale files
var en = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));

// Flatten locale to dot-notation keys
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

// Walk all Vue files and extract t('...') and t("...") keys
// ONLY within {{ }} template expressions and after = in JS
var root = 'C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src';
var missingEn = [];
var missingZh = [];
var found = {};
var falsePositives = [];

function isLikelyTranslationKey(key) {
  // Reject CSS class selectors
  if (key.startsWith('.')) return false;
  if (/^\.[\w-]+/.test(key)) return false;
  // Reject kebab-case event names (custom events like 'step-click')
  if (/^[a-z][a-z0-9]*(-[a-z][a-z0-9]*)+\.[a-z]/.test(key)) return false;
  // Reject CamelCase / snake_case that look like function references
  if (/^[A-Z][a-zA-Z]+$/.test(key)) return false;
  if (/^[a-z][a-z0-9]+([A-Z][a-z0-9]+)+$/.test(key)) return false;
  if (/^[a-z][a-z0-9]*_[a-z][a-z0-9]*$/.test(key)) return false;
  // Reject pure lowercase event names
  if (/^[a-z]+(-[a-z]+)*$/.test(key) && key.split('-').length <= 2 && key.length < 20) {
    // Could be event names, but also valid translation keys
    // Keep them for now - they're short and could be labels
  }
  return true;
}

function walk(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(fp);
    } else if (e.name.endsWith('.vue')) {
      var content = fs.readFileSync(fp, 'utf8');
      // Match t('...') and t("...")
      var matches = content.match(/t\s*\(\s*(['"])([^'"]+)\1\s*(?:\)|,)/g) || [];
      for (var j = 0; j < matches.length; j++) {
        var keyMatch = matches[j].match(/t\s*\(\s*['"]([^'"]+)['"]\s*(?:\)|,)/);
        if (keyMatch) {
          var key = keyMatch[1];
          if (!found[key]) {
            found[key] = true;
            var isLikelyTranslation = isLikelyTranslationKey(key);
            if (!isLikelyTranslation) {
              falsePositives.push(key + ' (' + e.name + ')');
            } else {
              if (!enKeys[key]) missingEn.push(key + ' (' + e.name + ')');
              if (!zhKeys[key]) missingZh.push(key + ' (' + e.name + ')');
            }
          }
        }
      }
    }
  }
}

walk(root);

console.log('Unique t() keys found: ' + Object.keys(found).length);
console.log('False positives filtered: ' + falsePositives.length);
if (falsePositives.length > 0) {
  console.log('  (event names / function refs / CSS selectors)');
  falsePositives.slice(0, 5).forEach(function(k) { console.log('    ' + k); });
}
console.log('');
if (missingEn.length) {
  console.log('MISSING in en.json:');
  missingEn.forEach(function(k) { console.log('  ' + k); });
}
if (missingZh.length) {
  console.log('MISSING in zh-CN.json:');
  missingZh.forEach(function(k) { console.log('  ' + k); });
}
if (!missingEn.length && !missingZh.length) {
  console.log('All translation keys in Vue components exist in BOTH locale files: PASS');
}

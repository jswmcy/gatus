var fs = require('fs');
var path = require('path');

var root = 'C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src';
var issues = [];

function walk(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var fp = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(fp);
    } else if (e.name.endsWith('.vue')) {
      var content = fs.readFileSync(fp, 'utf8');
      // Check if uses t() but missing useI18n import
      var hasT = /\$?\s*t\s*\(/.test(content);
      var hasImport = content.includes('useI18n');
      if (hasT && !hasImport) {
        issues.push(e.name + ' -- uses t() but MISSING useI18n import');
      }
    }
  }
}

walk(root);

if (issues.length) {
  console.log('ISSUES FOUND:');
  issues.forEach(function(n) { console.log('  ' + n); });
} else {
  console.log('useI18n import check: PASSED (all files using t() have useI18n import)');
}

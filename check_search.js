var fs = require('fs');

// Check if 'search' key exists in locale files
var en = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));
console.log('en.search:', en.search);
console.log('zh.search:', zh.search);
console.log('en.search.placeholder:', en.search ? en.search.placeholder : 'N/A');
console.log('zh.search.placeholder:', zh.search ? zh.search.placeholder : 'N/A');

// Find 'search' key context in SearchBar
var sb = fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\components\\SearchBar.vue', 'utf8');
var idx = sb.indexOf("t('search')");
if (idx === -1) idx = sb.indexOf('t("search")');
if (idx >= 0) {
  var ctx = sb.substring(Math.max(0, idx - 80), idx + 100).replace(/\n/g, ' ').replace(/\s+/g, ' ');
  console.log('\nSearchBar context for t("search"):');
  console.log('  ' + ctx);
}

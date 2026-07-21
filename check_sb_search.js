var fs = require('fs');
var sb = fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\components\\SearchBar.vue', 'utf8');

// Find t('search') or t("search") occurrences
var re = /t\s*\(\s*['"](search)['"]\s*(?:\)|,)/g;
var match;
var idx = 0;
var count = 0;
while ((match = re.exec(sb)) !== null && count < 20) {
  var pos = match.index;
  var ctx = sb.substring(Math.max(0, pos - 50), pos + 80).replace(/\n/g, ' ').replace(/\s+/g, ' ');
  console.log(count + ': ' + ctx);
  count++;
}

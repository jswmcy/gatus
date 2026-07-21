var fs = require('fs');

// Check StepDetailsModal for the 'close' key
var content = fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\components\\StepDetailsModal.vue', 'utf8');
// Find all t('...') with context
var re = /t\s*\(\s*'([^']+)'/g;
var match;
console.log('StepDetailsModal t() keys:');
while ((match = re.exec(content)) !== null) {
  console.log('  ' + match[1]);
}

// Check Pagination
var pc = fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\components\\Pagination.vue', 'utf8');
re = /t\s*\(\s*'([^']+)'/g;
console.log('\nPagination t() keys:');
while ((match = re.exec(pc)) !== null) {
  console.log('  ' + match[1]);
}

// Check SearchBar
var sb = fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\components\\SearchBar.vue', 'utf8');
re = /t\s*\(\s*'([^']+)'/g;
console.log('\nSearchBar t() keys:');
while ((match = re.exec(sb)) !== null) {
  console.log('  ' + match[1]);
}

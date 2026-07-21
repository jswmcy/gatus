var fs = require('fs');
var names = [
  'components/EndpointCard.vue',
  'components/FlowStep.vue',
  'components/ResponseTimeChart.vue',
  'components/SequentialFlowDiagram.vue',
  'components/SuiteCard.vue',
  'components/Tooltip.vue',
  'components/ui/input/Input.vue',
  'components/ui/select/Select.vue',
];
var base = 'C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\';
names.forEach(function(name) {
  var content = fs.readFileSync(base + name, 'utf8');
  // Find all t( occurrences with context
  var regex = /\$?\s*t\s*\(/g;
  var matches = [];
  var m;
  while ((m = regex.exec(content)) !== null) {
    var start = Math.max(0, m.index - 30);
    var end = Math.min(content.length, m.index + m[0].length + 20);
    var ctx = content.substring(start, end).replace(/\n/g, ' ').replace(/\s+/g, ' ');
    matches.push(ctx);
  }
  if (matches.length > 0) {
    console.log(name + ': ' + matches.length + ' occurrences');
    matches.forEach(function(c) { console.log('  >> ' + c); });
  }
});

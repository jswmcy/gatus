var fs = require('fs');

var en = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));

en.close = 'Close';
zh.close = '关闭';
en.page = 'Page';
zh.page = '页';

fs.writeFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', JSON.stringify(zh, null, 2));

var en2 = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\en.json', 'utf8'));
var zh2 = JSON.parse(fs.readFileSync('C:\\Users\\Administrator\\Downloads\\gatus-master\\gatus-master\\web\\app\\src\\locales\\zh-CN.json', 'utf8'));
console.log('en.json - close:', en2.close, '| page:', en2.page);
console.log('zh-CN.json - close:', zh2.close, '| page:', zh2.page);

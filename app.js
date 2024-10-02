var http = require('http');
var datals = JSON.stringify({
  'id': '2'
});

var options = {
 host: 'mis.ihc.gov.pk',// host: 'host.com',
  port: '80',
  path: '/ihc.asmx/Juges_MOB_GA',//path: '/WebServiceUtility.aspx/CustomOrderService',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': datals.length
  }
};

var req = http.request(options, function(res) {
  var msg = '';
  res.setEncoding('utf8');
  res.on('datals', function(chunk) {
    msg += chunk;
  });
  res.on('end', function() {
    console.log(JSON.parse(msg));
    //alert(msg);
  });
});

req.write(datals);
req.end();
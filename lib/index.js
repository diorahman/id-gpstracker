var request = require('hyperquest');
var xml2js = require('xml2js');

module.exports = TrackNow;

var ROOT = 'http://id-gpstracker.com/webservice/tracknow.asmx';
var methods = [
  'getDeviceList',
  'getDeviceLastPosition',
  'getDeviceList',
  'getDeviceListWithLocation',
  'getDeviceListWithLocationWithImage',
  'getDevicePositions'
];

function TrackNow(options) {
  this.rootUrl = options.rootUrl || ROOT;
  var self = this;
  methods.forEach(function(method) {
    self[method] = function(cb) {
      var data = '';
      var r = request(ROOT + '/' + method + '?APIKey=' + options.apiKey);
      r.on('data', function(chunk) {
        data += chunk;
      });
      r.on('end', function(){
        // parse
        xml2js.parseString(data, function(err, json){
          if (err)
            return cb(err);
          var keys = Object.keys(json);
          var primary = keys[0];
          keys = Object.keys(json[primary]);
          var secondary = keys[1];
          var deviceList = json[primary][secondary];
          var ret = [];
          deviceList.forEach(function(device) {
            var obj = {};
            for (var k in device) {
              var parts = k.split('_').map(function(part){ return part.toLowerCase();});
              if (parts.length > 2)
                parts[1] = parts[1] + parts[2];
              obj[parts[0]] = obj[parts[0]] || {};
              obj[parts[0]][parts[1]] = device[k][0];
            }
            ret.push(obj);
          });
          cb(null, ret);
        });
      });
      r.on('error', function(err){
        cb(err);
      });
    }
  });
}

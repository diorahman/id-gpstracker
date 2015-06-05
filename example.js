// I know it's lame
var TrackNow = require('./');
var trackNow = new TrackNow({
  apiKey: '2243a9fcdca0f45232fb0f94d99c5a2d' // http://data.go.id/dataset/api-gps-tracking-kendaraan-pemadam-kebakaran
});

trackNow.getDeviceListWithLocationWithImage(function(err, json){
  console.log(err || json);
});

trackNow.getDeviceList(function(err, json){
  console.log(err || json);
});


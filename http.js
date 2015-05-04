var httpreq = require('http');
var http = httpreq.Server(app);

//load websockets

//webserver should show the index.html in the public folder


//webserver should use the public folder
app.use(express.static(__dirname + '/public'));


// start webserver on port 7331
http.listen(7331, function() {
    console.log('server on mul.pura.at');
});

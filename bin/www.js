var superstatic = require('superstatic').server;

var app = superstatic({
    port:8080,
    compression:true
});

app.listen(function() {
    console.log('Servr is start!')
});

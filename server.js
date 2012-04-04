
var http = require('http')
	, fs = require('fs')
	, path = require('path')
    , io = require("socket.io");
	

var server = http.createServer(function(req, res) {
	var filename = path.join(process.cwd(), req.url);

    path.exists(filename, function(exists) {
        if (!exists) {
            res.writeHead(404, {"Content-Type":"text/plain"});
            res.write("404 Not Found\n");
            res.end();
            return;
        }

    fs.readFile(
        './index.html'
        , encoding='utf-8'
        , function(err, data){
            if (err){
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.write(err+"\n");
                res.end();
                return;
            }
            res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
            res.end(data);
        }
    );

    });
});

server.listen(3000);

io = io.listen(server);
io.configure(
    function(){
        io.enable('browser client etag');
        io.set('log level', 3);
        io.set(
            'transports',[
                'websocket'
                , 'flashsocket'
                , 'htmlfile'
                , 'xhr-polling'
                , 'jsonp-polling'
            ]
        );
    }
);

// 연결되었을때
io.sockets.on('connection',
    function(socket){
        console.log('connected');

        // 각 소켓이 끊어 졌을때..
        socket.on('disconnect',
            function(){
                console.log('Good-bye');
            }
        );

        // 메세지 받았을때
        socket.on('message',
            function(msg){
                console.log(msg);
                socket.send('서버에서 보낸 메세지');
            }
        );

    }
);




console.log("Server Start at http://localhost:3000");

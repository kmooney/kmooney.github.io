
Socket = function() { 
    var server = "ws://localhost:8686";

    this.socket = new WebSocket(server+"/chat");

    this.socket.onmessage = function(evt) { 
        console.log(evt);
    };

    this.socket.onclose = function(evt) { 
        console.log("Connection Shut");
    };

    this.socket.onopen = function(evt) { 
        console.log("Connection Opened!");
    };

    this.write = function(msg) { 
        socket.write(msg);
    };

};

s = new Socket();
s.write('helo');


Socket = function() { 
    var server = "ws://localhost:8686";
    var t = this;
    this.socket = new WebSocket(server+"/chat");

    this.socket.onmessage = function(evt) { 
        console.log(evt.msg);
    };

    this.socket.onclose = function(evt) { 
        console.log("Connection Shut");
    };

    this.socket.onopen = function(evt) { 
        console.log("Connection Opened!");
    };

    this.write = function(msg) { 
        t.socket.send(msg);
    };

};

s = new Socket();

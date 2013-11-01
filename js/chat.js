var Socket = function() {
    var server = "ws://localhost:8686";
    var t = this;
    this.socket = new WebSocket(server+"/chat");

    this.socket.onmessage = function(evt) { 
        console.log(JSON.parse(evt.data));
    };

    this.socket.onclose = function(evt) { 
        console.log("Connection Shut");
    };

    this.socket.onopen = function(evt) { 
        console.log("Connection Opened!");
    };

    this.send = function(email, comment) { 
        msg = JSON.stringify({
            email: email, 
            message: comment,
            urlhash: String(CryptoJS.MD5(window.location.href))
        });
        t.socket.send(msg);
    };

};

s = new Socket();

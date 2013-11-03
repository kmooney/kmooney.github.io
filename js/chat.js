
function ChatController($scope) { 

    var Socket = function() {
        var server = "ws://localhost:8686";
        var t = this;
        this.socket = new WebSocket(server+"/chat");

        this.socket.onmessage = function(evt) { 
            var message = JSON.parse(evt.data);
            console.log(message.email);
            console.log(message.message);
            if (message.type == 'message') { 
                $scope.comments.push({message: message.message, emailhash: message.emailhash});
            } else if (message.type == 'haidouzo') { 
                var objects = message.objects;
                for (var i = 0 ; i < objects.length; i ++) { 
                     $scope.comments.push({message: objects[i].message, emailhash: objects[i].emailhash});
                } 
            }
            $scope.$apply();
        };

        this.socket.onclose = function(evt) { 
            console.log("Connection Shut");
        };

        this.socket.onopen = function(evt) { 
            msg = JSON.stringify({
                urlhash: String(CryptoJS.MD5(window.location.href)),
                type: 'gimme'
            });
            t.socket.send(msg);
        };

        this.send = function(email, comment) { 
            msg = JSON.stringify({
                emailhash: String(CryptoJS.MD5(email)), 
                type: 'message',
                message: comment,
                urlhash: String(CryptoJS.MD5(window.location.href))
            });
            t.socket.send(msg);
        };

    };

    $scope.socket = new Socket();

    $scope.comments = [ ];

    $scope.addComment = function() {
        console.log("Adding a comment."); 
        $scope.socket.send($scope.commentEmail, $scope.commentMessage);
        $scope.commentMessage = '';
    };
}

var myApp = angular.module('myApp', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
});

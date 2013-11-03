
function ChatController($scope, $location, $anchorScroll) { 

    var Socket = function() {
        var server = "ws://chat.kevn.co:8686";
        var t = this;
        this.socket = new WebSocket(server+"/chat");

        this.socket.onmessage = function(evt) { 
            var message = JSON.parse(evt.data);
            if (message.type == 'message') { 
                $scope.pushMessage(message);
            } else if (message.type == 'haidouzo') { 
                var objects = message.objects;
                for (var i = 0 ; i < objects.length; i ++) { 
                    $scope.pushMessage(objects[i]);
                } 
            }
            $scope.$apply();
        };

        this.socket.onclose = function(evt) { 
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

    $scope.pushMessage = function(msg) { 
        msg['id'] = "msg-"+$scope.comments.length;
        $scope.comments.push(msg);
        $scope.$apply();
        var el = document.getElementsByClassName('commentlist')[0];
        var msgel = document.getElementById(msg['id']);
        el.scrollTop = msgel.offsetTop;
    };

    $scope.addComment = function() {
        $scope.socket.send($scope.commentEmail, $scope.commentMessage);
        $scope.commentMessage = '';
    };

    $scope.shouldSubmit = function(evt) { 
    };
}

var myApp = angular.module('myApp', [], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
});

angular.module('myApp').directive('ngEnter', function() { 
    return function(scope, element, attrs) { 
        element.bind("keyup", function(event) {
            if (event.which == 13) { 
                scope.$apply(function() { 
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

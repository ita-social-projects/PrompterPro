app.service("prompterService",
[
    "broadcastHub",
    "prompterRepository",
	"constants",
    "notify",
    "notifyType",
    "icons",
    "prompterResolution",
    function (
        broadcastHub,
        prompterRepository,
		constants,
		notify,
		notifyType,
		icons,
        prompterResolution) {

    	return function ($scope) {

    	    var textBox = $('#area');
    	    var animation;
    	    var maxSpeed = 10;
    	    var minSpeed = 1;
    	    var velocity = 15;
	        var resolutionMultiplier = 1;
    	    $scope.textIsChanged = false;
    	    $scope.textSizes = [50, 55, 60, 70, 80, 90, 100, 110, 130];
    	    $scope.showDialog = false;
    	    $scope.speed = 1;
    	    $scope.currentSize = $scope.textSizes[2];
    	    $scope.textSize = 90;
    	    $scope.leftPadding = 0;
    	    $scope.rightPadding = 0;

		    $scope.hub = broadcastHub;
		    function setDefaultProps() {
		        $scope.isMirroredX = undefined;
		        $scope.isMorroredY = undefined;
		        $scope.speed = 1;
		        $scope.leftPadding = 0;
		        $scope.rightPadding = 0;
		        $scope.textSize = 90;
		        broadcastHub.client.stop();
		    }
		    broadcastHub.client.fetchScript = function (scriptId, operatorId) {
                prompterRepository.get(scriptId, function(script) {
                    $scope.script = script;
                    broadcastHub.server.fetchSuccess(operatorId);
                    notify(
						notifyType.success,
						constants.connectedToOperator,
						icons.ok);
                    $scope.$apply();
                });
            }

		    broadcastHub.client.operatorConnected = function () {
		    	notify(
					notifyType.success,
					constants.allConnected,
					icons.ok);
		    	$scope.$apply();
            }


		    broadcastHub.client.broadcastEnd = function () {
		    	notify(
					notifyType.success,
					constants.broadcastEnd,
					icons.warning);
		    	$scope.script = null;
		        setDefaultProps();
		    	$scope.$apply();
		    }

		    broadcastHub.client.operatorDisconnected = function () {
		    	notify(
					notifyType.danger,
					constants.operatorDisconnected,
					icons.warning);
		    	$scope.script = null;
		    	setDefaultProps();
		    	$scope.$apply();
		    }

            broadcastHub.client.play = function () {
		        animation = setInterval(function () {
		            if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
		                textBox.scrollTop(textBox.scrollTop() + $scope.speed);
		            }
		        }, velocity);
		    }

		    broadcastHub.client.pause = function () {
                clearInterval(animation);
            }

		    broadcastHub.client.stop = function () {
                clearInterval(animation);
                textBox.scrollTop(0);
            }

		    broadcastHub.client.changeTextSize = function (size) {
		        $scope.textSize = size;
		        $scope.$apply();
            }

            broadcastHub.client.speedUp = function() {
                if ($scope.speed < maxSpeed) {
                    $scope.speed++;
                }
            }

            broadcastHub.client.speedDown = function() {
                if ($scope.speed > minSpeed) {
                    $scope.speed--;
                }
            }

            broadcastHub.client.mirrorText = function (isMirroredX, isMirroredY) {
                if (isMirroredX && isMirroredY) {
                    textBox.css({ 'transform': 'matrix(-1, 0, 0, -1, 0, 0)' });
                }
                if (isMirroredX && !isMirroredY) {
                    textBox.css({ 'transform': 'matrix(-1, 0, 0, 1, 0, 0)' });
                }
                if (!isMirroredX && isMirroredY) {
                    textBox.css({ 'transform': 'matrix(1, 0, 0, -1, 0, 0)' });
                }
                if (!isMirroredX && !isMirroredY) {
                    textBox.css({ 'transform': 'matrix(1, 0, 0, 1, 0, 0)' });
                }
            }
            
            broadcastHub.client.handPlayBack = function () {
                broadcastHub.client.pause();
                animation = setInterval(function () {
                    if (textBox.scrollTop() > 0) {
                        textBox.scrollTop(textBox.scrollTop() - $scope.speed);
                    }
                }, velocity);
            }

            broadcastHub.client.handPlay = function () {
                broadcastHub.client.pause();
                animation = setInterval(function () {
                    if (textBox.scrollTop() <= textBox.get(0).scrollHeight) {
                        textBox.scrollTop(textBox.scrollTop() + $scope.speed);
                    }
                }, velocity);
            }

            broadcastHub.client.clearText = function () {
                document.getElementById("area").value = "";
            }
            
            $scope.displayText = function () {
                var text = '\n\n';
                var sections = $scope.script.Sections;
                _.each(sections, function (section) {
                    text += '[Section:' + section.Order + ']\n' + section.Text + '\n';
                });
                return text;
            }

            broadcastHub.client.padLeft = function(percentage) {
                $scope.leftPadding = percentage;
                $scope.$apply();
            }

            broadcastHub.client.padRight = function(percentage) {
                $scope.rightPadding = percentage;
                $scope.$apply();
            }

            broadcastHub.client.setResolution = function(resolution) {
                if (resolution == prompterResolution.Small) {
                    document.getElementById("area").width = 600;
                    resolutionMultiplier = 1;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
                if (resolution == prompterResolution.Medium) {
                    document.getElementById("area").width = 800;
                    resolutionMultiplier = 1.5;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
                if (resolution == prompterResolution.Large) {
                    document.getElementById("area").width = 1200;
                    resolutionMultiplier = 2;
                    broadcastHub.client.changeTextSize($scope.currentSize * resolutionMultiplier);
                }
            }

	        var obj = {};
	        return obj;
        };
    }
]);
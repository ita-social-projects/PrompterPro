app.service("broadcastOperator",
[
    "broadcastHub",
	"constants",
    "notify",
    "notifyType",
    "icons",
	"prompterStatus",
    function (broadcastHub, constants, notify, notifyType, icons, prompterStatus) {

        return function ($scope) {

            var obj = {};

            var connectingProgress;
            var prompters;
            var connected;
            var info;
            $scope.index;

            obj.configurePrompters = function() {
            	var prompterInfos = [];
            	_.each(connected, function (item) {
		            prompterInfos.push({
		            	PrompterId: item.UserId,
		            	IsMirroredX: item.IsMirroredX | false,
		            	IsMirroredY: item.IsMirroredY | false,
						Resolution: 0
		            });
            	});
	            broadcastHub.server.configurePrompters(prompterInfos);
            }

            obj.getConnected = function() {
                return connected;
            };

            obj.startBroadcast = function () {
                $scope.showWorkspace = false;
                $scope.connecting = true;

                $scope.sortedScripts = _.sortBy($scope.scripts, 'Title');
                $scope.index = _.indexOf($scope.sortedScripts, $scope.selectedScript);


                connectingProgress = 0;
                prompters = $scope.checked;
                connected = [];
                if (prompters.length) {
                	info = {
                	    //ScriptId: $scope.selectedScript.ScriptId,
                	    ScriptId: $scope.sortedScripts[$scope.index].ScriptId,
            
                	    PrompterIdList: []
                	};
                	_.each(prompters, function (item) {
                		if (item.PrompterStatus === prompterStatus.On) {
                			info.PrompterIdList.push(item.UserId);
		                }
                	});

                	broadcastHub.server.startBroadcast(info);

                	setTimeout(function () {
                		if ($scope.connecting) {
                			broadcastHub.client.cantStartBroadcast();
                		}
                	},
					constants.broadcastTimeout);
                }
            };

            obj.errorEndBroadcast = function () {
            	if (info) {
            		broadcastHub.server.errorEndBroadcast();
		            info = null;
            	}

            	$scope.connecting = false;
	            $scope.showPlayer = false;
	            $scope.showWorkspace = true;
               
            }

            obj.successEndBroadcast = function () {
            	if (info) {
            		broadcastHub.server.successEndBroadcast();
            		info = null;
            	}

            	$scope.connecting = false;
            	$scope.showPlayer = false;
            	$scope.showWorkspace = true;

            }
            
            broadcastHub.client.cantStartBroadcast = function () {
            	obj.errorEndBroadcast();
            	notify(
					notifyType.danger,
					constants.cantConnect,
					icons.warning);
	            $scope.$apply();
            }

            broadcastHub.client.prompterConnected = function (prompterId) {
                var alreadyConnected = _.some(connected, function (item) {
                	return item.UserId === prompterId;
                });
                if (alreadyConnected) {
                    return;
                }

                var found = _.find(prompters, function(item) {
                	return item.UserId === prompterId;
                });
                if (!found) {
                    return;
                }
                found.Resolution = 0;
                found.isMirroredX = false;
                found.isMirroredY = false;
                connected.push(found);

                connectingProgress = 100 * connected.length / prompters.length;
                $(".progress-bar")
					.css("width", connectingProgress + "%")
					.attr("aria-valuenow", connectingProgress);
				
                if (connected.length === prompters.length) {
	                broadcastHub.server.operatorConnected();
                	$scope.connecting = false;
                	$scope.showPlayer = true;
                	notify(
						notifyType.success,
						constants.connectSucces,
						icons.ok);
                }

                $scope.$apply();
            }

            broadcastHub.client.prompterDisconnected = function (prompterId) {
            	var found = _.find(connected, function (item) {
            		return item.UserId === prompterId;
            	});

            	if (!found) {
            		return;
            	}

            	notify( notifyType.danger,
						constants.lostConnectionWith + found.Login,
						icons.warning );

            	connected = _.without(connected, found);

            	if (connected.length === 0) {
            		notify(notifyType.danger,
							constants.allDisconnected,
							icons.warning);

            		$scope.connecting = false;
            		$scope.showPlayer = false;
            		$scope.showWorkspace = true;
	            }

            	$scope.$apply();
            }

            return obj;
        };
    }
]);
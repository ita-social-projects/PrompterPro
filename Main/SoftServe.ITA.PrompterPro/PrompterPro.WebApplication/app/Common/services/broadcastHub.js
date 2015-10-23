app.factory("broadcastHub", function () {
	$.connection.hub.start();
	var hub = $.connection.broadcastHub;
    return hub;
});
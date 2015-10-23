app.controller("scriptController", [
	"$scope",
    "initScriptCtrlProps",
    "initScriptCtrlFunctions",
	"scriptRepository",
    "broadcastHub",

	function ($scope,
        initScriptCtrlProps,
        initScriptCtrlFunctions,
		scriptRepository,
        broadcastHub) {
	    initScriptCtrlProps($scope);
	    initScriptCtrlFunctions($scope);

		scriptRepository.get().then(function(scripts) {
			$scope.scripts = scripts;
			$scope.selectedScript = null;
		});
	}
]);
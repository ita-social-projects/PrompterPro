app.service("initScriptCtrlFunctions",
[
    "scriptService",
    "scriptClass",
    "scriptOrder",
    "canPlay",
    "operatorDialog",
    "manageSections",
    "sectionServices",
    "broadcastOperator",
    function(
        scriptService,
        scriptClass,
        scriptOrder,
        canPlay,
        operatorDialog,
        manageSections,
        sectionServices,
        broadcastOperator
        ) {
        return function ($scope) {
            $scope.scriptService = scriptService($scope);
            $scope.scriptClass = scriptClass($scope);
            $scope.canPlay = canPlay($scope);
            $scope.scriptOrder = scriptOrder;
            $scope.operatorDialog = operatorDialog($scope);
            $scope.broadcastOperator = broadcastOperator($scope);

            $scope.dragSectionTemplate = [];
            manageSections.initNewSection($scope.dragSectionTemplate);
            $scope.displaySectionIntro = sectionServices.displaySectionIntro;
            $scope.updateSectionState = manageSections.updateSectionState;
            $scope.isDeleted = manageSections.isDeleted;
            $scope.deleteSection = manageSections.deleteSection;
            $scope.moveSection = manageSections.moveSection;
            $scope.dragNewSection = manageSections.dragNewSection;
            $scope.addNewSection = manageSections.addNewSection;
        }
    }
]);
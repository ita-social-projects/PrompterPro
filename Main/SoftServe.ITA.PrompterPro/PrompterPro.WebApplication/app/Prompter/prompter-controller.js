app.controller("prompterController", [
    "$scope",
    "prompterService",
    function ($scope, prompterService) {
        $("div.container.body-content")
            .removeClass("container body-content")
            .addClass("container-full");

        var black = "rgb(0, 0, 0)";
        $("body")
            .css("background-color", black)
            .keyup(function (event) {
            var code = (event.keyCode ? event.keyCode : event.which);
            if (code === 122) {
                $("div.navbar.navbar-inverseNew.navbar-fixed-top").toggleClass("ng-hide");
            }
        });
        $scope.service = prompterService($scope);
    }
]);
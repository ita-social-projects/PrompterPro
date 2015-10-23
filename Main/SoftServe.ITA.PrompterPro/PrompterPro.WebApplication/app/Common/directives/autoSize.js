app.directive("autoSize", [
    "$timeout",
    "entityState",
    function ($timeout, entityState) {
        var minHeight = 77;
        var maxHeight = 300;
        var height = 0;

        var makeYellow= function(element) {
            element.css("background", "#fcf8e3");
            element.css("color", "#8a6d3b");
        }

        var makeGreen = function (element) {
            element.css("background", "#dff0d8");
            element.css("color", "#3c763d");
        }

        var restrictElementSize = function(element) {
            element.css("overflow", "auto");
            element.css("height", maxHeight + "px");
        }

        var resize = function(scope, element, prevLength) {
            if (scope.section.Text.length < prevLength) {
                element.css("height", "auto");
            }
            height = element[0].scrollHeight;
            if (height > minHeight) {
                element.css("height", height + "px");
                element.css("overflow", "hidden");
            }
        }

        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.css("resize", "none");

                var prevLength = scope.section.Text.length;

                var update = function () {
                    if (scope.section.EntityState === entityState.Modified) {
                        makeYellow(element);
                    }
                    if (scope.section.EntityState === entityState.Added) {
                        makeGreen(element);
                    }
                    if (element[0].scrollHeight < maxHeight) {
                        resize(scope, element, prevLength);
                        prevLength = scope.section.Text.length;
                    } else {
                        restrictElementSize(element);
                    }
                }

                scope.$watch(
                    attr.ngModel,
                    function () {
                        update();
                    });

                attr.$set("ngTrim", "false");
                $timeout(update, 0);
            }
        }
    }]);
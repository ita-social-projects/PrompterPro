app.directive('setFocus', function () {
    return {
        scope: { trigger: '=setFocus' },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            });
        }
    };
});
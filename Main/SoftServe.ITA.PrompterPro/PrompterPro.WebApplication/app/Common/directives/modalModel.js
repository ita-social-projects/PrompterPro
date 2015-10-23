app.directive("modalModel",
	function() {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				scope.$watch(attrs.visible,
					function(newValue) {
						if (newValue == true) {
							$(element).modal("show");
						} else {
							$(element).modal("hide");
						}
					});

				$(element).on('shown.bs.modal', function () {
					scope.$apply(function () {
						scope[attrs.visible] = true;
					});
				});

				$(element).on('hidden.bs.modal', function () {
					scope.$apply(function () {
						scope[attrs.visible] = false;
					});
				});
			}
		};
	}
);
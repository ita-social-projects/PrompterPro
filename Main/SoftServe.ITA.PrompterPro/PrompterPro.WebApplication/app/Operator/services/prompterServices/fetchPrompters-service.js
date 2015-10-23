app.factory("fetchPrompters", [
	"prompterStatus",
    function (prompterStatus) {
        return {
            getPrompters: function ($scope, prompterRepository) {
                prompterRepository.get().then(
                    function(prompters) {
                    	$scope.prompters = prompters;

                    	var checked = $scope.$parent.checked;
	                    if (checked) {
	                    	var newChecked = [];

		                    _.each(checked, function(checkedItem) {
		                    	var found = _.find(prompters, function (item) {
				                    return item.UserId === checkedItem.UserId
					                    && item.PrompterStatus === prompterStatus.On;
		                    	});
			                    if (found) {
			                    	found.checked = true;
				                    newChecked.push(found);
			                    }
		                    });

		                    $scope.$parent.checked = newChecked;
		                    $scope.checked = newChecked;
	                    }
                    });
            }
        }
    }
]);
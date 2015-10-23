app.service("prompterChecked", [
    function () {
    	return function (prompter) {
    		return prompter.checked;
    	}
    }
]);
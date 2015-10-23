app.service("prompterOrder", [
    "prompterStatus", 
    function (prompterStatus) {
        return function (prompter) {
            return prompterStatus.order[prompter.PrompterStatus];
        };
    }
]);
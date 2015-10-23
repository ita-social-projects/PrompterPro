app.service("prompterClass", [
    "prompterStatus", "listGroupItem",
    function (prompterStatus, listGroupItem) {
        return function (prompter) {
            if (prompter.PrompterStatus === prompterStatus.On) {
                return listGroupItem.success;
            }
            if (prompter.PrompterStatus === prompterStatus.Busy) {
                return listGroupItem.warning;
            }
            return listGroupItem.none;
        };
    }
]);
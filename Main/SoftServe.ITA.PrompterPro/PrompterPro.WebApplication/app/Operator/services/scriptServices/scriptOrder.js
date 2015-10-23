app.service("scriptOrder",
    function() {
        return function(script) {
            return script.Title;
        };
    });
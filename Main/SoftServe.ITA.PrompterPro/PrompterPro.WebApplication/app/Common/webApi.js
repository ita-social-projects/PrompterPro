app.factory("webApi", function () {
    return Object.freeze({
        presentation            : "/api/presentation",
        script                  : "/api/script",
        prompter                : "/api/prompter",
        diagnostics             : "/api/diagnostics",
        userActivity            : "/api/userActivity",
        userActivityActivator   : "/api/userActivityActivator"
    });
});

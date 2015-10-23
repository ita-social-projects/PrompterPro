app.factory("prompterStatus", function () {
    return Object.freeze({
        On    : "On",
        Busy  : "Busy",
        Off   : "Off",

        order : Object.freeze({
            "On"   : 1,
            "Busy" : 2,
            "Off"  : 3
        })
    });
});

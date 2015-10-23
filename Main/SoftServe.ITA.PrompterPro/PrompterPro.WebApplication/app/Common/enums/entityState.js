app.factory("entityState", function () {
    return Object.freeze({
        Unchanged : 2,
        Added     : 4,
        Deleted   : 8,
        Modified  : 16
    });
});

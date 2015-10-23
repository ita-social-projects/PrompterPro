app.service("userStateControll", ["entityState",
    function (entityState) {
        return function ($scope) {
            return function (user) {
                if (user.Disabled === true) {
                    return 'danger';
                }
                if (user.EntityState === entityState.Modified) {
                    return 'warning';
                }
                if (user.EntityState === entityState.Added) {
                    return 'success';
                }
                return null;
            };
        };
    }
]);
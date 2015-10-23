app.factory('manageUserSate', [
    'entityState', function (entityState) {
        return {
            setAddedState: function (user) {
                user.EntityState = entityState.Added;
            },

            setDeletedState: function (user) {
                user.EntityState = entityState.Modified;
                user.Disabled = true;
            },

            setModifiedState: function (user) {
                user.EntityState = entityState.Modified;
            }
        }
    }
]);
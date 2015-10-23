app.factory('role', [
    function() {
        return Object.freeze(
        {
            Admin: Object.freeze({
                RoleId: 1,
                Name: 'Admin'
            }),
            Operator: Object.freeze({
                RoleId: 2,
                Name: 'Operator'
            }),
            Prompter: Object.freeze({
                RoleId: 3,
                Name: 'Prompter'
            })

        });

    }
]);
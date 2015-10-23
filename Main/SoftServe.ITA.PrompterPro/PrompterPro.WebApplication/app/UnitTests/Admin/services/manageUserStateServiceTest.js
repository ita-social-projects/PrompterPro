describe("Admin services - manage user state service", function () {

    beforeEach(module("app"));

    describe("Manage user state service test", function () {
        var service,
            entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageUserSate");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can set user entity state as added", function() {
            //arange
            var user = {};

            //act
            service.setAddedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Added);
        });

        it("can set user entity state as modified", function () {
            //arange
            var user = {};

            //act
            service.setModifiedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Modified);
        });

        it("can disable user", function () {
            //arange
            var user = {};

            //act
            service.setDeletedState(user);

            //assert
            expect(user.EntityState).toBe(entityState.Modified);
            expect(user.Disabled).toBe(true);
        });
    });
});
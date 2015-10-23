describe("Admin services - user state controll service", function () {

    beforeEach(module("app"));

    describe("User state controll service test", function () {
        var service;
        var entityState;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userStateControll");
            entityState = $injector.get("entityState");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("will return 'danger' if user is disabled", function() {
            //arange
            var user = {
                Disabled: true
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("danger");
        });

        it("will return 'warning' if user is modified", function () {
            //arange
            var user = {
                EntityState: entityState.Modified
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("warning");
        });

        it("will return 'succes' if user is added", function () {
            //arange
            var user = {
                EntityState: entityState.Added
            };

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe("success");
        });

        it("will return null if user isnt modified, added or disabled", function () {
            //arange
            var user = {};

            //act
            var actual = service()(user);

            //assert
            expect(actual).toBe(null);
        });
    });
});
describe("Admin services - validation service", function () {

    beforeEach(module("app"));

    describe("Validation service test", function () {
        var service,
            role;

        beforeEach(inject(function ($injector) {
            service = $injector.get("validationService");
            role = $injector.get("role");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        describe("can check user existing", function() {
            it("will return false if user exists", function () {
                //arange
                var users = [];
                var user1 = {
                    Login: "test"
                };

                users.push(user1);

                //act
                var actual = service.checkUserExisting(users, "test");

                //assert
                expect(actual).toBe(false);
            });

            it("will return true if user doesnt exists", function () {
                //arange
                var users = [];
                var user1 = {
                    Login: "notTest"
                };

                users.push(user1);

                //act
                var actual = service.checkUserExisting(users, "test");

                //assert
                expect(actual).toBe(true);
            });
        });

        describe("can check if users role is admin", function() {
            it("will return true if user is admin", function () {
                //arange
                var user = {
                    Login: "Admin",
                    Role: {
                        Name: "Admin"
                    }
                };

                //act
                var actual = service.checkIfAdmin(user);

                //assert
                expect(actual).toBe(true);
            });

            it("will return false if user is not admin", function () {
                //arange
                var user = {
                    Login: "Admin",
                    Role: {
                        Name: "NotAdmin"
                    }
                };

                //act
                var actual = service.checkIfAdmin(user);

                //assert
                expect(actual).toBe(false);
            });
        });
    });
});
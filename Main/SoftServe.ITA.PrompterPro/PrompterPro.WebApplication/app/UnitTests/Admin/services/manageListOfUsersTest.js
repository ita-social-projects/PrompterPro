describe("Admin services - manage list of users service", function () {

    beforeEach(module("app"));

    describe("Manage list of users test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("manageListOfUsers");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can add user to list", function () {
            //arange
            var scope = {
                managedUserslist: []
            }
            var user = "testUser";

            //act
            service.addToList(scope, user);

            //assert
            expect(scope.managedUserslist[0]).toBe("testUser");
        });

        it("can remove user from list", function () {
            //arange
            var scope = {
                users: [
                    "testUser",
                    "testUser2"
                ]
            }
            var user = "testUser";

            //act
            service.removeFromList(scope, user);

            //assert
            expect(scope.users[0]).toBe("testUser2");
            expect(scope.users.length).toBe(1);
        });
    });
});
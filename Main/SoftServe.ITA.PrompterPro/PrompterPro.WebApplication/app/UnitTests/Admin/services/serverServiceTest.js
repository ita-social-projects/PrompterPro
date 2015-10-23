describe("Admin services - server service", function () {

    beforeEach(module("app"));

    describe("Server service test", function () {
        var service;
        var userRepository;

        beforeEach(inject(function ($injector) {
            service = $injector.get("serverService");
            userRepository = $injector.get("userRepository");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });

        it("can read all users", function() {
            //arange
            var scope = {};
            userRepository.get = function() {
                var obj= {
                    then: function() {
                        scope.users = "test";
                    }
                }
                return obj;
            };

            //act
            service.readAllUsers(scope);

            //assert
            expect(scope.users).toBe("test");
        });

        it("can get user by login", function () {
            //arange
            var scope = {};
            userRepository.getByLogin = function(login) {
                var obj = {
                    then: function() {
                        scope.users = login;
                    }
                }
                return obj;
            };

            //act
            service.getUserByLogin(scope, "test");

            //assert
            expect(scope.users).toBe("test");
        });

        it("can manage user", function () {
            //arange
            var scope = {};
            userRepository.post = function (usersList) {
                var obj = {
                    then: function () {
                        scope.users = usersList;
                    }
                }
                return obj;
            };

            //act
            service.manageUser(scope, "test");

            //assert
            expect(scope.users).toBe("test");
        });
    });
});
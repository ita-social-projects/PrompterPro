describe("Admin controller - diagnostic controller", function() {
    var isModalOpenCalled = false;

    var mockDependencies = function() {
        module(function($provide) {
            $provide.service("$modal", function() {
                this.open = function() {
                    isModalOpenCalled = true;
                }
            });

            $provide.service("constants", function() {
                this.diagnositcsMessageDisplayLength = 1;
            });
        });
    };

    beforeEach(function() {
        module("app");
        mockDependencies();
    });

    describe("Diagnostic controller test", function () {
        var controller,
            $scope = {};

        beforeEach(inject(function($injector, $controller) {
            controller = $controller("diagnosticsController",
            { $scope: $scope });
        }));

        it("controller exists", function() {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function() {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can open message modal", function() {
            //arange
            var diagnostic = {
                Message: "Test"
            }

            //act
            $scope.openMessageModal(diagnostic);

            //assert
            expect(isModalOpenCalled).toBe(true);
        });
    });
});
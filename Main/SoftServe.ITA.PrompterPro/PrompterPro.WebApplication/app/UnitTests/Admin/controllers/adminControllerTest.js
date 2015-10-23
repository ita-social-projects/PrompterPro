describe("Admin controller - admin controller", function () {

    beforeEach(module("app"));

    describe("Admin controller test", function () {
        var controller,
            $scope = {};

        beforeEach(inject(function ($injector, $controller) {
            controller = $controller("adminController",
                { $scope: $scope });
        }));

        it("controller exists", function () {
            expect(controller).not.toBe(undefined);
            expect(controller).not.toBe(null);
        });

        it("scope exists", function () {
            expect($scope).not.toBe(undefined);
            expect($scope).not.toBe(null);
        });

        it("can make user tab", function() {
            //arange
            //act
            $scope.makeUserTab();

            //asert
            expect($scope.isUsersTabActive).toBe(true);
            expect($scope.isDiagnosticsTabActive).toBe(false);
            expect($scope.isHistoryTabActive).toBe(false);
        });

        it("can make diagnostic tab", function () {
            //arange
            //act
            $scope.makeDiagnosticsTab();

            //asert
            expect($scope.isUsersTabActive).toBe(false);
            expect($scope.isDiagnosticsTabActive).toBe(true);
            expect($scope.isHistoryTabActive).toBe(false);
        });

        it("can make hostory tab", function () {
            //arange
            //act
            $scope.makeHistoryTab();

            //asert
            expect($scope.isUsersTabActive).toBe(false);
            expect($scope.isDiagnosticsTabActive).toBe(false);
            expect($scope.isHistoryTabActive).toBe(true);
        });

        it("can click on element", function() {
            //arange
            var oldGetElementById = document.getElementById;
            var actual;
            var dummyElement = {
                click: function() {
                    actual = "Tested";
                }
            };

            document.getElementById = function() {
                return dummyElement;
            }

            //act
            $scope.autoClick("Test");

            //assert
            expect(actual).toBe("Tested");

            //return old document.getElementById
            document.getElementById = oldGetElementById;
        });
    });
});
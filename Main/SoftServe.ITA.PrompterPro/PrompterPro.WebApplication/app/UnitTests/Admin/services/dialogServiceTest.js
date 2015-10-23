/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-mocks.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-animate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/truncate.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-route.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/angular-ui/ui-bootstrap.js" />
/// <reference path="C:\Users\User\Desktop\SoftServe\PrompterPro\Main\SoftServe.ITA.PrompterPro\PrompterPro.WebApplication\Scripts/jquery-1.9.1.js" />
/// <reference path="../../../../Common/angular-md5.js" />

/// <reference path="../../../../app.js" />

describe("Admin controllers - anus controller", function () {

    beforeEach(module("app"));

    describe("Broadcast admin controller test", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("broadcastOperator");
        }));

        it("exists", function () {
            expect(service).not.toBe(undefined);
            expect(service).not.toBe(null);
        });
    });
});
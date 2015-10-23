describe("userActivity caching service", function () {

    beforeEach(module("app"));

    describe("userActivityCachingService tests", function () {
        var service;

        beforeEach(inject(function ($injector) {
            service = $injector.get("userActivityCachingService");
        }));

        it("exists", function () {
            expect(service).not.toBe(null);
        });

        it("can add page to cache", function () {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);

            //assert
            expect(service.getPageFromCache(1)).toBe(pageOne);
            expect(service.getPageFromCache(2)).toBe(pageTwo);
            expect(service.getPageFromCache(3)).toBe(undefined);
        });

        it("can check if pages is cached", function() {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);

            //assert
            expect(service.isPageCached(1)).toBe(true);
            expect(service.isPageCached(2)).toBe(true);
            expect(service.isPageCached(3)).toBe(false);
        });

        it("can refresh cached page", function() {
            //arange
            var pageOne = "one";
            var newPageOne = "newOne";

            //act
            service.addPageToCache(pageOne);
            service.refreshCachePage(newPageOne, 1);

            //assert
            expect(service.getPageFromCache(1)).not.toBe(pageOne);
            expect(service.getPageFromCache(1)).toBe(newPageOne);
        });

        it("can clear cache", function() {
            //arange
            var pageOne = "one";
            var pageTwo = "two";

            //act
            service.addPageToCache(pageOne);
            service.addPageToCache(pageTwo);
            service.clearCache();

            //assert
            expect(service.isPageCached(1)).toBe(false);
            expect(service.isPageCached(2)).toBe(false);
            expect(service.getPageFromCache(1)).toBe(undefined);
            expect(service.getPageFromCache(2)).toBe(undefined);
        });
    });

});
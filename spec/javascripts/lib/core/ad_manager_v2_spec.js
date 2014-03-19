require([ "public/assets/javascripts/lib/core/ad_manager_v2" ], function(AdManager) {

  describe("Ad Manager v2", function() {

    var instance;

    beforeEach(function() {
      loadFixtures("ad_iframe.html");
      instance = new AdManager({
        networkID: "xxxx",
        template: "overview",
        theme: "family-holiday",
        layers: [ "lonelyplanet", "destinations" ]
      });
    });

    describe("._init()", function() {

      it("Loads and instantiates jQuery DFP", function() {

        spyOn(instance, "_adCallback").andReturn(null);

        runs(function() {
          instance._init();
        });

        waitsFor(function() {
          return $.hasOwnProperty("dfp");
        }, "DFP should be loaded", 250);

        runs(function() {
          expect($(".adunit").hasClass("display-none")).toBe(true);
        });

      });

    });

    describe(".formatKeywords()", function() {

      it("Should return the instance config formatted for jQuery.dfp targeting", function() {
        instance.config = {
          theme: "honeymoons,world-food",
          template: "overview,poi-list",
          keyValues: {
            foo: "bar"
          }
        };

        var result = instance.formatKeywords();

        expect(result.thm).toEqual(instance.config.theme);
        expect(result.tnm).toEqual(instance.config.template.split(","));
        expect(result.foo).toEqual(instance.config.keyValues.foo);
      });
    });

    describe(".refresh()", function() {

      it("Should call the refresh method on ad units filtered by type", function() {

        function MockAdUnit(type) {
          this.type = type;
        }
        MockAdUnit.prototype.getType = function() {
          return this.type;
        };

        [ "leaderboard", "adSense", "mpu" ].forEach(function(type) {
          var mock = new MockAdUnit(type);
          mock.refresh = jasmine.createSpy("refresh");
          instance.loadedAds.push(mock);
        });

        instance.refresh("leaderboard");
        expect(instance.loadedAds[0].refresh).toHaveBeenCalled();

        instance.refresh("adSense");
        expect(instance.loadedAds[1].refresh).toHaveBeenCalled();

        instance.refresh("mpu");
        expect(instance.loadedAds[2].refresh).toHaveBeenCalled();

        expect(instance.loadedAds[0].refresh.callCount).toEqual(1);
        expect(instance.loadedAds[1].refresh.callCount).toEqual(1);
        expect(instance.loadedAds[2].refresh.callCount).toEqual(1);

      });

    });

  });

});

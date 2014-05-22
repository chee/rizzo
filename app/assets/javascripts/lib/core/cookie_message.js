define([ "jquery" ], function($) {

  "use strict";

  var defaults = {
    content: "",
    target: "body"
  };

  function CookieMessage(args) {
    this.options = $.extend({}, defaults, args);
    this.$target = $(this.options.target);
    this.$element = $("<div class='row row--fluid row--cookie-compliance js-cookie-compliance'>" +
      "<div class='wv--split--left cookie-msg'>" + this.options.content + "</div>" +
      "<div class='wv--split--right cookie-buttons'>" +
        "<a class='btn btn--slim btn--green js-close-msg'>No worries</a>" +
        "<a class='btn btn--slim btn--grey js-more-msg' href='http://www.lonelyplanet.com/legal/cookies/'>Learn more</a>" +
       "</div>" +
    "</div>");

    this.init();
  }

  CookieMessage.prototype.init = function() {
    this.add();
    this.$element.on("click", ".js-close-msg", this.remove.bind(this));
  };

  CookieMessage.prototype.add = function() {
    this.$target.prepend(this);
    setTimeout(function() {
      this.$element.addClass("is-open");
    }.bind(this), 10);
  };

  CookieMessage.prototype.remove = function() {
    this.$element.removeClass("is-open").addClass("is-closed");
  };

  return CookieMessage;
});

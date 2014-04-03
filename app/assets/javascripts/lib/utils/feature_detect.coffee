# ------------------------------------------------------------------------------
#
# Bucket Class for all our feature detection
#
# To add a new feature, extend the features object.
# The key will become the class added to the <html>.
# The corresponding function should return true or false.
#
# ------------------------------------------------------------------------------
require ["jquery"], ($) ->
  $ ->
    (->
      features =
        "3d": ->
          el = document.createElement("p")
          has3d = undefined
          transforms =
            webkitTransform: "-webkit-transform"
            OTransform: "-o-transform"
            msTransform: "-ms-transform"
            MozTransform: "-moz-transform"
            transform: "transform"

          # Add it to the body to get the computed style.
          document.body.insertBefore el, document.body.firstChild
          for t of transforms
            if el.style[t] isnt `undefined`
              el.style[t] = "translate3d(1px,1px,1px)"
              has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
          document.body.removeChild el
          has3d isnt `undefined` and has3d.length > 0 and has3d isnt "none"
        "cssmasks": ->
          document.body.style[ "-webkit-mask-repeat" ] isnt undefined
        "cssfilters": ->
          document.body.style.webkitFilter isnt undefined and document.body.style.filter isnt undefined
        "placeholder": ->
          "placeholder" of document.createElement("input")
        "pointer-events": ->
          element = document.createElement("smile")
          element.style.cssText = "pointer-events: auto"
          element.style.pointerEvents is "auto"

        "transitionend": ->
          transitions =
            webkitTransition: "webkitTransitionEnd"
            oTransition: "oTransitionEnd otransitionend"
            mozTransition: "transitionend"
            transition: "transitionend"
          element = document.createElement("div")
          for transition of transitions
            if element.style[transition] isnt undefined
              return transitions[transition]
          return false

        # this does not cover microsoft devices, who use pointer api,
        # and who need a test with navigator.maxTouchPoints > 0
        "touch": ->
          $window = $(window)
          $window.on "touchstart", firstTouch = ->
            if window.lp.supportsAvailable
              window.lp.supports.touch = true
            else
              $(document).on ":featureDetect/available", -> window.lp.supports.touch = true
            $(document).trigger ":featureDetect/supportsTouch"
            $window.off "touchstart", firstTouch
          return "ontouchstart" of window and "maybe"

      for feature of features
        camelFeature = ($.camelCase and $.camelCase feature) or feature
        window.lp.supports[camelFeature] = features[feature]()

        if window.lp.supports[camelFeature]
          document.documentElement.className += " supports-#{feature}"
        else
          document.documentElement.className += " no-#{feature}-support"

      unless window.lp.supportsAvailable
        window.lp.supportsAvailable = true
        $(document).trigger(":featureDetect/available")

      return
    )()

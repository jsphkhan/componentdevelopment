// (function() {
//   'use strict'
  var test = $(".rangle-slider-box");
  var slider = $("#mySlider");
  var handle = $("#mySlider .range-slider-handle");
  var sliderFill = $("#mySlider .range-slider-fill");
  var sliderFillRight = $("#mySlider .range-slider-right-fill");
  var label = $("#myVal"); //input box
  var $document = $(document);

  var min = 0, max = 6556, step = 13, value = 0;
  var MIN_VALUE, MAX_VALUE, STEP, VALUE;

  MIN_VALUE = tryParseFloat(min, 0);
  MAX_VALUE = tryParseFloat(max, 100);
  VALUE = tryParseFloat(value, Math.round(min + (max-min)/2));
  STEP = tryParseFloat(step, 1);

  var toFixed = (STEP + '').replace('.', '').length - 1;

  var check = 'ontouchstart' in window;

  var startEvent = (check) ? 'touchstart' : 'mousedown';
  var moveEvent = (check) ? 'touchmove' : 'mousemove';
  var endEvent = (check) ? 'touchend' : 'mouseup';
  //var outEvent = (check) ? 'touchend' : 'mouseout';

  //var maxPos = sliderWidth - thumbWidth;//max X position thumb can move
  //console.log(maxPos);

  var handleDimension = getDimension(handle[0], 'offsetWidth');//ucfirst(this.DIMENSION)
  var rangeDimension = getDimension(slider[0], 'offsetWidth');
  var maxHandlePos = rangeDimension - handleDimension;
  var grabPos = handleDimension / 2;
  var position = getPositionFromValue(VALUE);
  var rightSideBoundary = true;
  var rightThresholdValue = 700; //has to be less than max value
  var rightSideBoundaryColor = "green";

  console.log('maxHandlePos: ' + maxHandlePos);

  setPosition(position);
  //set the value for text input
  label.val(VALUE);

  //if there is a right side boundary
  if(rightSideBoundary) {
    var maxRightBoundaryPos = getPositionFromValue(MAX_VALUE - rightThresholdValue);
    console.log(maxRightBoundaryPos);
    //update the fill color region in the slider bar for right boundary

    sliderFillRight.addClass('active').css({
      "width": (rangeDimension - (maxRightBoundaryPos + handleDimension)),
      "border-color": rightSideBoundaryColor,
      "border-width": "0.5px",
      "border-style": "solid",
      "background-color": rightSideBoundaryColor
    });
    //maxHandlePos = getPositionFromValue(MAX_VALUE - rightThresholdValue);
  } else {
    sliderFillRight.removeClass('active');
  }

  /**
   * Returns the parsed float or the default if it failed.
   *
   * @param  {String}  str
   * @param  {Number}  defaultValue
   * @return {Number}
   */
  function tryParseFloat(str, defaultValue) {
      var value = parseFloat(str);
      return Number.isNaN(value) ? defaultValue : value;
  }

  //updating value in input box
  label.on('keypress', function(e) {
    //console.log($(this).val());
    if(e.keyCode === 13) { //press Enter
      var pos = getPositionFromValue($(this).val()*1);
      setPosition(pos);
    }
  });

  //when clicking on the slider bar
  test.on(startEvent, function(e) {
    //console.log(e.pageX);

    var pos = getRelativePosition(e);
    //console.log(pos);

    //if(pos > -1 && pos < maxPos) {
      setPosition(pos);
      //updateValueInInput(pos);
    //}
  });

  //dragging the slider thumb
  handle.on(startEvent, function(e) {
    e.preventDefault();
    e.stopPropagation();

    $document.on(moveEvent, handleMove);
    $document.on(endEvent, handleEnd);

    $(this).addClass('drag-highlight');

    // var pos = getRelativePosition(e),
    // rangePos = slider[0].getBoundingClientRect()['left'],
    // handlePos = getPositionFromNode(handle[0]) - rangePos,
    // setPos = (pos - this.grabPos);
    //
    // setPosition(setPos);
    //
    // if (pos >= handlePos && pos < handlePos + handleDimension) {
    //     this.grabPos = pos - handlePos;
    // }

    //console.log('className: ' + e.target.className);
    // If we click on the handle don't set the new position
    // if (e.target.className.indexOf('range-slider-handle') === 0) {
    //   console.log('true');
    //   return;
    // }

    //hasStarted = true;
    //console.log('start', e.touches[0]);
    //startPos = e.pageX;
  });

  function handleMove(e) {
    e.preventDefault();

    var pos = getRelativePosition(e);
    //console.log("pos > 0 && pos < maxPos " + (pos > 0 && pos < maxPos));
    var setPos = (pos - grabPos);
    //if(pos > -1 && pos < maxPos) {
    setPosition(setPos);
      //updateValueInInput(pos);
    //}
    //forward direction or backward direction
    //if(hasStarted) {

      // curPos = distanceX + (e.pageX - startPos);
      // console.log('curPos: ' + curPos);
      //
      // if(curPos > 0) {
      //   handle.css('left', curPos);
      // }
    //}
  }
  function handleEnd(e) {
    e.preventDefault();

    $document.off(moveEvent, this.handleMove);
    $document.off(endEvent, this.handleEnd);

    handle.removeClass('drag-highlight');
    //hasStarted = false;
    //startPos = e.pageX;
    // distanceX = e.pageX - startPos;
    // console.log('end: ', distanceX);
  }

  function getRelativePosition(e) {
    var pageCoordinate = 0,
        rangePos = slider[0].getBoundingClientRect()["left"];

    if (typeof e['pageX'] !== 'undefined') { //for desktops
        pageCoordinate = e['pageX'];
    }
    // IE8 support :)
    else if (typeof e.originalEvent['clientX'] !== 'undefined') {
        pageCoordinate = e.originalEvent['clientX'];
    }
    else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['pageX'] !== 'undefined') {
        pageCoordinate = e.originalEvent.touches[0]['pageX'];
    }
    else if(e.currentPoint && typeof e.currentPoint['X'] !== 'undefined') {
        pageCoordinate = e.currentPoint['X'];
    }


    //console.log("X: " + pageCoordinate + " Dist: " + (pageCoordinate - sliderLeftPos) + " e: ", e);

    return pageCoordinate - rangePos;
  }

  function cap(pos, min, max) {
      if (pos < min) { return min; }
      if (pos > max) {
        console.log('pos: ' + pos + " check: " + (pos > max));
        return max;
      }
      return pos;
  };

  function setPosition(pos) {

    var value, newPos;

    // if (triggerSlide === undefined) {
    //     triggerSlide = true;
    // }

    // Snapping steps
    if(rightSideBoundary) {
      value = getValueFromPosition(cap(pos, 0, getPositionFromValue(MAX_VALUE - rightThresholdValue)));
    } else {
      value = getValueFromPosition(cap(pos, 0, maxHandlePos));
    }

    newPos = getPositionFromValue(value);

    console.log(value, newPos);

    // Update ui
    sliderFill[0].style['width'] = (newPos + grabPos) + 'px';
    handle[0].style['left'] = newPos + 'px';

    updateValueInInput(value);
    //this.setValue(value); //update the input box

    // Update globals
    VALUE = value;
    //this.position = newPos;
    //this.value = value;

    // if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
    //     this.onSlide(newPos, value);
    // }

    // handle.css('left', pos); //move the knob
    // sliderFill.css('width', pos); //fill the covered region in the bar
  }

  function updateValueInInput(value) {
    if (value === VALUE && label.value !== '') {
        return;
    }
    label.val(value);
  }

  function getValueFromPosition(pos) {
      var percentage, value;
      percentage = ((pos) / (maxHandlePos || 1));
      value = STEP * Math.round(percentage * (MAX_VALUE - MIN_VALUE) / STEP) + MIN_VALUE;

      console.log('joseph: ' + (value > MAX_VALUE));

      //return ((value > MAX_VALUE) ? Number((MAX_VALUE).toFixed(toFixed)) : Number((value).toFixed(toFixed)));

      return Number((value).toFixed(toFixed));
  };

  function getPositionFromValue(value) {
    var percentage, pos;
    percentage = (value - MIN_VALUE)/(MAX_VALUE - MIN_VALUE);
    pos = (!Number.isNaN(percentage)) ? percentage * maxHandlePos : 0;
    return pos;
  }


  /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node    = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes       = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle             = [],
            dimension               = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    // Returns element position relative to the parent
    function getPositionFromNode(node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };


// })();

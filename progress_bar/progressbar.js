/* Progress Bar */

var progressBar = $(".progress-bar");
var min = 0, max = 800;
var progress= [{value: 500, color: '#F37237'}, {value: 100, color: '#AC060F'}];
var rangeDimension = getDimension(progressBar[0], 'offsetWidth');

//functions

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

function getPositionFromValue(value) {
  var percentage, pos;
  percentage = (value - min)/(max - min);
  pos = (!Number.isNaN(percentage)) ? percentage * rangeDimension : 0;
  if(pos > rangeDimension) {
    return;
  }
  return pos;
}

function update() {
  
}

//conditions
//total progress amount should not be greater than max amount.

//loop thru progress arr and render the DOM
var domList = $("<div />"), totalVal = 0, width, left, pos = 0, leftClass='', rightClass='';
for(var i=0; i < progress.length; i++) {
  left = pos;
  totalVal+= progress[i].value;
  pos = getPositionFromValue(totalVal);
  if(pos) {
    width = pos - left;
    console.log("Left: " + left + " Width: " + width + " Right: " + pos + " Value: " + totalVal);
    leftClass = (i === 0) ? 'progress-bar-completed-left-chunk' : '';
    rightClass = (i === progress.length || pos === rangeDimension) ? 'progress-bar-completed-right-chunk' : '';
    domList.append($("<div class='progress-bar-completed " + leftClass + " " + rightClass + "' style='width: "  + width + "px; background-color: " + progress[i].color + "; left: " + left + "px'></div>"));
  }
}
//add it to live DOM.
progressBar.append(domList);

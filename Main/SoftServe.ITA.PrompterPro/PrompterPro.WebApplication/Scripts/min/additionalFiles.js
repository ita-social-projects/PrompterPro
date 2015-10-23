/*
  angular-md5 - v0.1.7 
  2014-01-20
*/
(function(window, angular, undefined) {
  angular.module("angular-md5", [ "gdi2290.md5" ]);
  angular.module("ngMd5", [ "gdi2290.md5" ]);
  angular.module("gdi2290.md5", [ "gdi2290.gravatar-filter", "gdi2290.md5-service", "gdi2290.md5-filter" ]);
  "use strict";
  angular.module("gdi2290.gravatar-filter", []).filter("gravatar", [ "md5", function(md5) {
    var cache = {};
    return function(text, defaultText) {
      if (!cache[text]) {
        defaultText = defaultText ? md5.createHash(defaultText.toString().toLowerCase()) : "";
        cache[text] = text ? md5.createHash(text.toString().toLowerCase()) : defaultText;
      }
      return cache[text];
    };
  } ]);
  "use strict";
  angular.module("gdi2290.md5-filter", []).filter("md5", [ "md5", function(md5) {
    return function(text) {
      return text ? md5.createHash(text.toString().toLowerCase()) : text;
    };
  } ]);
  "use strict";
  angular.module("gdi2290.md5-service", []).factory("md5", [ function() {
    var md5 = {
      createHash: function(str) {
        var xl;
        var rotateLeft = function(lValue, iShiftBits) {
          return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
        };
        var addUnsigned = function(lX, lY) {
          var lX4, lY4, lX8, lY8, lResult;
          lX8 = lX & 2147483648;
          lY8 = lY & 2147483648;
          lX4 = lX & 1073741824;
          lY4 = lY & 1073741824;
          lResult = (lX & 1073741823) + (lY & 1073741823);
          if (lX4 & lY4) {
            return lResult ^ 2147483648 ^ lX8 ^ lY8;
          }
          if (lX4 | lY4) {
            if (lResult & 1073741824) {
              return lResult ^ 3221225472 ^ lX8 ^ lY8;
            } else {
              return lResult ^ 1073741824 ^ lX8 ^ lY8;
            }
          } else {
            return lResult ^ lX8 ^ lY8;
          }
        };
        var _F = function(x, y, z) {
          return x & y | ~x & z;
        };
        var _G = function(x, y, z) {
          return x & z | y & ~z;
        };
        var _H = function(x, y, z) {
          return x ^ y ^ z;
        };
        var _I = function(x, y, z) {
          return y ^ (x | ~z);
        };
        var _FF = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var _GG = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var _HH = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var _II = function(a, b, c, d, x, s, ac) {
          a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
          return addUnsigned(rotateLeft(a, s), b);
        };
        var convertToWordArray = function(str) {
          var lWordCount;
          var lMessageLength = str.length;
          var lNumberOfWords_temp1 = lMessageLength + 8;
          var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - lNumberOfWords_temp1 % 64) / 64;
          var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
          var lWordArray = new Array(lNumberOfWords - 1);
          var lBytePosition = 0;
          var lByteCount = 0;
          while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
          }
          lWordCount = (lByteCount - lByteCount % 4) / 4;
          lBytePosition = lByteCount % 4 * 8;
          lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
          lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
          lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
          return lWordArray;
        };
        var wordToHex = function(lValue) {
          var wordToHexValue = "", wordToHexValue_temp = "", lByte, lCount;
          for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
          }
          return wordToHexValue;
        };
        var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        x = convertToWordArray(str);
        a = 1732584193;
        b = 4023233417;
        c = 2562383102;
        d = 271733878;
        xl = x.length;
        for (k = 0; k < xl; k += 16) {
          AA = a;
          BB = b;
          CC = c;
          DD = d;
          a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
          d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
          c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
          b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
          a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
          d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
          c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
          b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
          a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
          d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
          c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
          b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
          a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
          d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
          c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
          b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
          a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
          d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
          c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
          b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
          a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
          d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
          c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
          b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
          a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
          d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
          c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
          b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
          a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
          d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
          c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
          b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
          a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
          d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
          c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
          b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
          a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
          d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
          c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
          b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
          a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
          d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
          c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
          b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
          a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
          d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
          c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
          b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
          a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
          d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
          c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
          b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
          a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
          d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
          c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
          b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
          a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
          d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
          c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
          b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
          a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
          d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
          c = _II(c, d, a, b, x[k + 2], S43, 718787259);
          b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
          a = addUnsigned(a, AA);
          b = addUnsigned(b, BB);
          c = addUnsigned(c, CC);
          d = addUnsigned(d, DD);
        }
        var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        return temp.toLowerCase();
      }
    };
    return md5;
  } ]);
})(this, this.angular, void 0);
/**
 * angular-drag-and-drop-lists v1.2.0
 *
 * Copyright (c) 2014 Marcel Juenemann mail@marcel-junemann.de
 * https://github.com/marceljuenemann/angular-drag-and-drop-lists
 *
 * License: MIT
 */
  app
  .directive('dndDraggable', ['$parse', '$timeout', 'dndDropEffectWorkaround', 'dndDragTypeWorkaround',
                      function ($parse, $timeout, dndDropEffectWorkaround, dndDragTypeWorkaround) {
                          return function (scope, element, attr) {
                              // Set the HTML5 draggable attribute on the element
                              element.attr("draggable", "true");

                              // If the dnd-disable-if attribute is set, we have to watch that
                              if (attr.dndDisableIf) {
                                  scope.$watch(attr.dndDisableIf, function (disabled) {
                                      element.attr("draggable", !disabled);
                                  });
                              }

                              /**
                               * When the drag operation is started we have to prepare the dataTransfer object,
                               * which is the primary way we communicate with the target element
                               */
                              element.on('dragstart', function (event) {
                                  event = event.originalEvent || event;

                                  // Serialize the data associated with this element. IE only supports the Text drag type
                                  event.dataTransfer.setData("Text", angular.toJson(scope.$eval(attr.dndDraggable)));

                                  // Only allow actions specified in dnd-effect-allowed attribute
                                  event.dataTransfer.effectAllowed = attr.dndEffectAllowed || "move";

                                  // Add CSS classes. See documentation above
                                  element.addClass("dndDragging");
                                  $timeout(function () { element.addClass("dndDraggingSource"); }, 0);

                                  // Workarounds for stupid browsers, see description below
                                  dndDropEffectWorkaround.dropEffect = "none";
                                  dndDragTypeWorkaround.isDragging = true;

                                  // Save type of item in global state. Usually, this would go into the dataTransfer
                                  // typename, but we have to use "Text" there to support IE
                                  dndDragTypeWorkaround.dragType = attr.dndType ? scope.$eval(attr.dndType) : undefined;

                                  // Invoke callback
                                  $parse(attr.dndDragstart)(scope, { event: event });

                                  event.stopPropagation();
                              });

                              /**
                               * The dragend event is triggered when the element was dropped or when the drag
                               * operation was aborted (e.g. hit escape button). Depending on the executed action
                               * we will invoke the callbacks specified with the dnd-moved or dnd-copied attribute.
                               */
                              element.on('dragend', function (event) {
                                  event = event.originalEvent || event;

                                  // Invoke callbacks. Usually we would use event.dataTransfer.dropEffect to determine
                                  // the used effect, but Chrome has not implemented that field correctly. On Windows
                                  // it always sets it to 'none', while Chrome on Linux sometimes sets it to something
                                  // else when it's supposed to send 'none' (drag operation aborted).
                                  var dropEffect = dndDropEffectWorkaround.dropEffect;
                                  scope.$apply(function () {
                                      switch (dropEffect) {
                                          case "move":
                                              $parse(attr.dndMoved)(scope, { event: event });
                                              break;

                                          case "copy":
                                              $parse(attr.dndCopied)(scope, { event: event });
                                              break;
                                      }
                                  });

                                  // Clean up
                                  element.removeClass("dndDragging");
                                  element.removeClass("dndDraggingSource");
                                  dndDragTypeWorkaround.isDragging = false;
                                  event.stopPropagation();
                              });

                              /**
                               * When the element is clicked we invoke the callback function
                               * specified with the dnd-selected attribute.
                               */
                              element.on('click', function (event) {
                                  event = event.originalEvent || event;

                                  scope.$apply(function () {
                                      $parse(attr.dndSelected)(scope, { event: event });
                                  });

                                  event.stopPropagation();
                              });

                              /**
                               * Workaround to make element draggable in IE9
                               */
                              element.on('selectstart', function () {
                                  if (this.dragDrop) this.dragDrop();
                                  return false;
                              });
                          };
                      }])
  .directive('dndList', ['$parse', '$timeout', 'dndDropEffectWorkaround', 'dndDragTypeWorkaround',
                 function ($parse, $timeout, dndDropEffectWorkaround, dndDragTypeWorkaround) {
                     return function (scope, element, attr) {
                         // While an element is dragged over the list, this placeholder element is inserted
                         // at the location where the element would be inserted after dropping
                         var placeholder = angular.element("<div class='dndPlaceholder'></div>");
                         var placeholderNode = placeholder[0];
                         var listNode = element[0];

                         var horizontal = attr.dndHorizontalList && scope.$eval(attr.dndHorizontalList);
                         var externalSources = attr.dndExternalSources && scope.$eval(attr.dndExternalSources);

                         /**
                          * The dragover event is triggered "every few hundred milliseconds" while an element
                          * is being dragged over our list, or over an child element.
                          */
                         element.on('dragover', function (event) {
                             event = event.originalEvent || event;

                             if (!isDropAllowed(event)) return true;

                             // First of all, make sure that the placeholder is shown
                             // This is especially important if the list is empty
                             if (placeholderNode.parentNode != listNode) {
                                 element.append(placeholder);
                             }

                             if (event.target !== listNode) {
                                 // Try to find the node direct directly below the list node.
                                 var listItemNode = event.target;
                                 while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
                                     listItemNode = listItemNode.parentNode;
                                 }

                                 if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
                                     // If the mouse pointer is in the upper half of the child element,
                                     // we place it before the child element, otherwise below it.
                                     if (isMouseInFirstHalf(event, listItemNode)) {
                                         listNode.insertBefore(placeholderNode, listItemNode);
                                     } else {
                                         listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                     }
                                 }
                             } else {
                                 // This branch is reached when we are dragging directly over the list element.
                                 // Usually we wouldn't need to do anything here, but the IE does not fire it's
                                 // events for the child element, only for the list directly. Therefore we repeat
                                 // the positioning algorithm for IE here.
                                 if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                     // Check if we should move the placeholder element one spot towards the top.
                                     // Note that display none elements will have offsetTop and offsetHeight set to
                                     // zero, therefore we need a special check for them.
                                     while (placeholderNode.previousElementSibling
                                          && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                          || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                         listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                     }
                                 } else {
                                     // Check if we should move the placeholder element one spot towards the bottom
                                     while (placeholderNode.nextElementSibling &&
                                          !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                         listNode.insertBefore(placeholderNode,
                                             placeholderNode.nextElementSibling.nextElementSibling);
                                     }
                                 }
                             }

                             // At this point we invoke the callback, which still can disallow the drop.
                             // We can't do this earlier because we want to pass the index of the placeholder.
                             if (attr.dndDragover && !invokeCallback(attr.dndDragover, event)) {
                                 return stopDragover();
                             }

                             element.addClass("dndDragover");
                             event.preventDefault();
                             event.stopPropagation();
                             return false;
                         });

                         /**
                          * When the element is dropped, we use the position of the placeholder element as the
                          * position where we insert the transferred data. This assumes that the list has exactly
                          * one child element per array element.
                          */
                         element.on('drop', function (event) {
                             event = event.originalEvent || event;

                             if (!isDropAllowed(event)) return true;

                             // The default behavior in Firefox is to interpret the dropped element as URL and
                             // forward to it. We want to prevent that even if our drop is aborted.
                             event.preventDefault();

                             // Unserialize the data that was serialized in dragstart. According to the HTML5 specs,
                             // the "Text" drag type will be converted to text/plain, but IE does not do that.
                             var data = event.dataTransfer.getData("Text") || event.dataTransfer.getData("text/plain");
                             var transferredObject;
                             try {
                                 transferredObject = JSON.parse(data);
                             } catch (e) {
                                 return stopDragover();
                             }

                             // Invoke the callback, which can transform the transferredObject and even abort the drop.
                             if (attr.dndDrop) {
                                 transferredObject = invokeCallback(attr.dndDrop, event, transferredObject);
                                 if (!transferredObject) {
                                     return stopDragover();
                                 }
                             }

                             // Retrieve the JSON array and insert the transferred object into it.
                             var targetArray = scope.$eval(attr.dndList);
                             scope.$apply(function () {
                                 targetArray.splice(getPlaceholderIndex(), 0, transferredObject);
                             });

                             // In Chrome on Windows the dropEffect will always be none...
                             // We have to determine the actual effect manually from the allowed effects
                             if (event.dataTransfer.dropEffect === "none") {
                                 if (event.dataTransfer.effectAllowed === "copy" ||
                                     event.dataTransfer.effectAllowed === "move") {
                                     dndDropEffectWorkaround.dropEffect = event.dataTransfer.effectAllowed;
                                 } else {
                                     dndDropEffectWorkaround.dropEffect = event.ctrlKey ? "copy" : "move";
                                 }
                             } else {
                                 dndDropEffectWorkaround.dropEffect = event.dataTransfer.dropEffect;
                             }

                             // Clean up
                             stopDragover();
                             event.stopPropagation();
                             return false;
                         });

                         /**
                          * We have to remove the placeholder when the element is no longer dragged over our list. The
                          * problem is that the dragleave event is not only fired when the element leaves our list,
                          * but also when it leaves a child element -- so practically it's fired all the time. As a
                          * workaround we wait a few milliseconds and then check if the dndDragover class was added
                          * again. If it is there, dragover must have been called in the meantime, i.e. the element
                          * is still dragging over the list. If you know a better way of doing this, please tell me!
                          */
                         element.on('dragleave', function (event) {
                             event = event.originalEvent || event;

                             element.removeClass("dndDragover");
                             $timeout(function () {
                                 if (!element.hasClass("dndDragover")) {
                                     placeholder.remove();
                                 }
                             }, 100);
                         });

                         /**
                          * Checks whether the mouse pointer is in the first half of the given target element.
                          *
                          * In Chrome we can just use offsetY, but in Firefox we have to use layerY, which only
                          * works if the child element has position relative. In IE the events are only triggered
                          * on the listNode instead of the listNodeItem, therefore the mouse positions are
                          * relative to the parent element of targetNode.
                          */
                         function isMouseInFirstHalf(event, targetNode, relativeToParent) {
                             var mousePointer = horizontal ? (event.offsetX || event.layerX)
                                                           : (event.offsetY || event.layerY);
                             var targetSize = horizontal ? targetNode.offsetWidth : targetNode.offsetHeight;
                             var targetPosition = horizontal ? targetNode.offsetLeft : targetNode.offsetTop;
                             targetPosition = relativeToParent ? targetPosition : 0;
                             return mousePointer < targetPosition + targetSize / 2;
                         }

                         /**
                          * We use the position of the placeholder node to determine at which position of the array the
                          * object needs to be inserted
                          */
                         function getPlaceholderIndex() {
                             return Array.prototype.indexOf.call(listNode.children, placeholderNode);
                         }

                         /**
                          * Checks various conditions that must be fulfilled for a drop to be allowed
                          */
                         function isDropAllowed(event) {
                             // Disallow drop from external source unless it's allowed explicitly.
                             if (!dndDragTypeWorkaround.isDragging && !externalSources) return false;

                             // Check mimetype. Usually we would use a custom drag type instead of Text, but IE doesn't
                             // support that.
                             if (!hasTextMimetype(event.dataTransfer.types)) return false;

                             // Now check the dnd-allowed-types against the type of the incoming element. For drops from
                             // external sources we don't know the type, so it will need to be checked via dnd-drop.
                             if (attr.dndAllowedTypes && dndDragTypeWorkaround.isDragging) {
                                 var allowed = scope.$eval(attr.dndAllowedTypes);
                                 if (angular.isArray(allowed) && allowed.indexOf(dndDragTypeWorkaround.dragType) === -1) {
                                     return false;
                                 }
                             }

                             // Check whether droping is disabled completely
                             if (attr.dndDisableIf && scope.$eval(attr.dndDisableIf)) return false;

                             return true;
                         }

                         /**
                          * Small helper function that cleans up if we aborted a drop.
                          */
                         function stopDragover() {
                             placeholder.remove();
                             element.removeClass("dndDragover");
                             return true;
                         }

                         /**
                          * Invokes a callback with some interesting parameters and returns the callbacks return value.
                          */
                         function invokeCallback(expression, event, item) {
                             return $parse(expression)(scope, {
                                 event: event,
                                 index: getPlaceholderIndex(),
                                 item: item || undefined,
                                 external: !dndDragTypeWorkaround.isDragging,
                                 type: dndDragTypeWorkaround.isDragging ? dndDragTypeWorkaround.dragType : undefined
                             });
                         }

                         /**
                          * Check if the dataTransfer object contains a drag type that we can handle. In old versions
                          * of IE the types collection will not even be there, so we just assume a drop is possible.
                          */
                         function hasTextMimetype(types) {
                             if (!types) return true;
                             for (var i = 0; i < types.length; i++) {
                                 if (types[i] === "Text" || types[i] === "text/plain") return true;
                             }

                             return false;
                         }
                     };
                 }])

  /**
   * This workaround handles the fact that Internet Explorer does not support drag types other than
   * "Text" and "URL". That means we can not know whether the data comes from one of our elements or
   * is just some other data like a text selection. As a workaround we save the isDragging flag in
   * here. When a dropover event occurs, we only allow the drop if we are already dragging, because
   * that means the element is ours.
   */
  .factory('dndDragTypeWorkaround', function () { return {} })

  /**
   * Chrome on Windows does not set the dropEffect field, which we need in dragend to determine
   * whether a drag operation was successful. Therefore we have to maintain it in this global
   * variable. The bug report for that has been open for years:
   * https://code.google.com/p/chromium/issues/detail?id=39399
   */
  .factory('dndDropEffectWorkaround', function () { return {} });

app.directive('setFocus', function () {
    return {
        scope: { trigger: '=setFocus' },
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            });
        }
    };
});
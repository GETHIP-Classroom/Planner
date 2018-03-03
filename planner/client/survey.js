/*global localStorage: false, console: false, document: false, window: false, alert: false, jQuery: false */
/*properties addClass, after, animate, append, appendChild, attr, change, childElementCount, children, click, closest, createElement, css, discipline, each, empty, eq, extend, filter, firstChild, floor, fn, getElementById, getItem, height, hide, highOpinionAnswer, innerHTML, insertBefore, left, length, localStorage, lowOpinionAnswer, name, numericScale, offset, parse, prepend, push, question, removeAttr, responseRange, scrollTop, setItem, show, sort, splice, stringify, substr, target, text, top, topNumber, val, value, width, wrap */
(function ($) {
    "use strict";
    $.fn.extend({
      numericScale: function (options) {
        var defaults, scores, key, disciplines, aHighVals;
        defaults = {
          responseRange: 5,
          topNumber: 3,
          lowOpinionAnswer: 'Least like me',
          highOpinionAnswer: 'Most like me'
        };
  
        scores = []; // Creates an empty scores array.
        disciplines = [];
        aHighVals = [];
  
        options = $.extend({}, defaults, options);
  
        // Act on every target of the plugin.
        return this.each(function () {
          var $list = $(this);
          key = $list.attr('id') + "_key";
  
          function createScore(oItem, d, qName) {
            var score = {};
            score.question = qName;
            score.value = oItem.val();
            score.discipline = d;
            scores.push(score);
          }
  
          function addScoresToPage(score) {
            $('input:radio[name=' + score.question + '][value=' + score.value + ']')
              .attr('checked', 'checked');
          }
  
          function loadScores() {
            var jsonScores, i;
            jsonScores = localStorage.getItem(key);
            if (jsonScores !== null) {
              scores = JSON.parse(jsonScores);
              for (i = 0; i < scores.length; i += 1) {
                addScoresToPage(scores[i]);
              }
            }
          }
  
          function storeScores() {
            var jsonScores = JSON.stringify(scores);
            localStorage.setItem(key, jsonScores);
          }
  
          function createQuestion(oList, oItem, index) {
            var title, qName, question, i;
            // Add the 'title' of the list item to the 'KWMAPP.oSurvey.disciplines' object.
            title = oItem.attr('title');
            qName = "q" + (index + 1);
  
            // Create score items in scores Array.
            createScore(oItem, title, qName);
  
            question = "<div class='opinion-question'>"
              + oItem.text()
              + "</div>"
              + "<div class='opinion-responses'>"
              + "<span class='bipolar-adjective'>"
              + options.lowOpinionAnswer
              + "</span>";
            // Create a radio button group for each question.
            for (i = 1; i <= options.responseRange; i += 1) {
              question += "<span class='response-choice'><input type='radio' " 
                + "name='" + qName 
                + "' value='" + i 
                + "' class='radio'";
              // Create a LocalStorage item for each question.
              //check to see if the discipline's localstorage item is already set.
              if (localStorage.getItem(oList.attr('id') + "_" + qName)) {
                if (localStorage.getItem(oList.attr('id') + "_" + qName) === i) {
                  question += " checked='checked'";
                }
              }
  
              // Add required attribute to first radio button in group to allow 
              // validation with the jquery.validate.js plugin.
              if (i === 1) {
                question += " validate='required:true'";
              }
  
              question += " />" + i + "</span>";
            }
            question += "<span class='bipolar-adjective'>" 
              + options.highOpinionAnswer 
              + "</span>" 
              + "</div>";
            oItem.empty()
              .prepend(question).attr('data-discipline', oItem.attr('title'))
              .removeAttr('title');
          }
  
  
          // Replace each child element (li) in this list with survey controls.
          $($list).children().each(function (index) {
            createQuestion($list, $(this), index);
          }).filter(':odd').addClass('alt'); // End of function for each 
                                             // child of target element.
  
          // Set up actions based on the disciplines. 
          $list.wrap('<div id="wrap-' 
            + $list.attr('id') 
            + '" class="survey-wrapper"></div>');
          $list.after('<div id="scores-' 
            + $list.attr('id') 
            + '" class="scores"></div>');
          $list.after('<input type="button" id="submitBtn" class="button btnStyle" ' 
            + 'value="Show My Gifts" />');
  
          $('#scores-' + $list.attr('id')).hide();
  
          loadScores();
  
          // ====================
          // Handler:
          // ====================
          $('input[type="radio"]').change(function (e) {
            var discipline, qNum;
            // Get the discipline of the question that is being rated.
            discipline = $(e.target)
              .closest('li[class~="question"]')
              .attr('data-discipline');
            qNum = $(e.target).attr('name').substr(1) - 1;
  
            // Replace the question's object property 'value' in 
            // the Scores array with the new selection
            scores[qNum].value = $(e.target).val();
            storeScores();
            //setSubmitBtnState();
          });
  
          function tallyDiscipline(discipline) {
            var total, i;
            total = 0;
            for (i = 0; i < scores.length; i += 1) {
              if (scores[i].discipline === discipline) {
                total += parseInt(scores[i].value, 10);
              }
            }
            return total;
          }
  
          function mySorting(a, b) {
            a = a[0];
            b = b[0];
            return b === a ? 0 : (b < a ? -1 : 1);
          }
  
          function getHighestValues() {
            var i, ii;
            for (i = 0; i < disciplines.length; i += 1) {
              aHighVals[i] = [disciplines[i].value, disciplines[i].name];
            }
            aHighVals.sort(mySorting);
            aHighVals.splice(options.topNumber, aHighVals.length - options.topNumber);
  
            for (ii = 0; ii < aHighVals.length; ii += 1) {
              $('#' + aHighVals[ii][1]).addClass('selected');
              $('input[id*="hdnSelectedVals"]')
                .val($('input[id*="hdnSelectedVals"]')
                .val() + aHighVals[ii][1]);
              if (aHighVals.length - 1 > ii) {
                $('input[id*="hdnSelectedVals"]')
                  .val($('input[id*="hdnSelectedVals"]')
                  .val() + ", ");
              }
            }
          }
  
          function submitSurvey() {
            var surveyId, dNumber, dWidth, maxHeight, 
                barHeight, tallBarHeight, i, ii, dScore, discipline;
            // Create visual elements for scores.
            surveyId = 'div#scores-' + $list.attr('id');
            dNumber = 0;
            maxHeight = 350;
            tallBarHeight = 0;
            $(surveyId).empty();
            for (i = 0; i < scores.length; i += 1) {
              if ($('div#' + scores[i].discipline).length === 0) {
                dScore = tallyDiscipline(scores[i].discipline);
                dNumber += 1;
  
                discipline = {};
                discipline.name = scores[i].discipline;
                discipline.value = dScore;
  
                disciplines.push(discipline);
  
                $(surveyId).append("<div id='" 
                  + scores[i].discipline 
                  + "' class='discipline'><div class='discipline-name'>" 
                  + scores[i].discipline 
                  + "</div><div class='discipline-total'>" 
                  + dScore + "</div>" + "</div>");
                if (dScore > tallBarHeight) {
                  tallBarHeight = dScore;
                }
              }
  
              $(surveyId).show('fast');
            }
  
            dWidth = 100 / dNumber;
            for (ii = 0; ii < dNumber; ii += 1) {
              $('.scores .discipline').eq(ii).css({
                'left': Math.floor(dWidth) * ii + '%'
              });
              $('.scores .discipline').eq(ii).css({
                'width': (Math.floor(dWidth) - 1) + '%'
              });
              barHeight = Math.floor((disciplines[ii].value / tallBarHeight) * maxHeight);
              $('.scores .discipline').eq(ii).animate({
                height: barHeight
              }, 2000);
              $('.scores .discipline'); //.addClass('box');
            }
  
            getHighestValues();
  
            $list.hide();
            $('#submitBtn').hide();
  
            $('[id*="btnSaveGifts"]').show();
          }
  
          // ====================
          // Handler:
          // ====================
          $("#submitBtn").click(function () {
            if (!window.localStorage) {
              alert("The Web Storage API is not supported in your browser. " 
                + "You may still submit the form, but your answers will not " 
                + "be saved to your browser.");
            } else {
              submitSurvey();
              $('html, body').animate({
                scrollTop: $("html, body").offset().top
              }, 1000);
            }
          });
  
        });
      }
    });
  })(jQuery);
  
  
  var disciplines = $('#survey1').numericScale({
    'responseRange' : 5,
    'lowOpinionAnswer' : 'Least like me',
    'highOpinionAnswer' : 'Most like me'
  });
  
/*
 * If not stated otherwise in this file or this component's Licenses.txt file the
 * following copyright and licenses apply:
 *
 * Copyright 2016 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/
var currentFocusedCategoryIndex = 1, allProgramsSelectedCategoryIndex = 1, myProgramsCurrentProgram = 0, allProgramsCurrentProgram = 0, myProgramsScrolled = 0, allProgramsScrolled = 0;
var allCategoryArray, allProgramsArray, myProgramsArray, recordedPrograms = [];
var programWidth;
var xOnDown = -1;

// custom
var recIds = [];
var recsMap = [];

$(document).ready(function() {
	$('#myRecordingsInnerContainer').makeScrollableDiv();
	$('#allProgramListsInnerContainer').makeScrollableDiv();
	setBodyFontSize();
	displayProgramCategories();
	allCategoryArray = $('.leftMenuText');
	
	//Set defaults
	// currentFocusedCategoryIndex = useKey('currentFocusedCategoryIndex', currentFocusedCategoryIndex);
	// allProgramsSelectedCategoryIndex = useKey('allProgramsSelectedCategoryIndex', allProgramsSelectedCategoryIndex);
	// myProgramsCurrentProgram = useKey('myProgramsCurrentProgram', myProgramsCurrentProgram);
	// allProgramsCurrentProgram = useKey('allProgramsCurrentProgram', allProgramsCurrentProgram);
	// myProgramsScrolled = useKey('myProgramsScrolled', myProgramsScrolled);
	
	recsMap = getRecordingsMap();
	
	$.each(recsMap, function(i, v) {
		recordedPrograms.push(v.split("=")[1].trim());
		recIds.push(v.split("=")[0].trim());
	});
	
	myPrograms = myPrograms.concat(recordedPrograms);
	focusCurrentCategory();
	displayProgramsForCategory(allCategoryArray[0]);
	displayProgramsForCategory(allCategoryArray[allProgramsSelectedCategoryIndex]);
	focusProgram(allProgramsArray[allProgramsCurrentProgram]);
	focusProgram(myProgramsArray[myProgramsCurrentProgram]);
	displayInfoForCurrentProgram();
	programWidth = $($('.program')[0]).outerWidth() + 0;
	myProgramsAdjustScroll();
	allProgramsScrolled = useKey('allProgramsScrolled', allProgramsScrolled);
	allProgramsAdjustScroll();
});

$(window).resize(function() {
	setBodyFontSize();
	programWidth = $($('.program')[0]).outerWidth() + 0;
	//adjust scroll
});

(function($) {
	$.fn.pop = function() {
		var top = this.get(-1);
		this.splice(this.length - 1, 1);
		return top;
	};
	$.fn.makeScrollableDiv = function() {
		$(this).mousedown(function(event) {
			$(this).data('down', true).data('x', event.clientX).data('scrollLeft', this.scrollLeft);
			if ($(this).is('#myRecordingsInnerContainer') && currentFocusedCategoryIndex != 0) {
				unfocusCurrentCategory()
				currentFocusedCategoryIndex = 0;
				focusCurrentCategory();
			} else if ($(this).is('#allProgramListsInnerContainer') && currentFocusedCategoryIndex == 0) {
				unfocusCurrentCategory()
				currentFocusedCategoryIndex = allProgramsSelectedCategoryIndex;
				focusCurrentCategory();
			}
			return false;
		}).mouseup(function(event) {
			$(this).data('down', false);
		}).mouseout(function(event) {
			if (event.clientX < $(this).offset().left || event.clientY < $(this).offset().top || event.clientY > $(this).offset().top + $(this).height() || event.clientX > $(this).offset().left + $(this).width()) {
				$(this).data('down', false);
			}
		}).mousemove(function(event) {
			if ($(this).data('down') == true) {
				this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
			}
		});
	}
})(jQuery);

function useKey(key, def) {
	if ( typeof (Storage) !== "undefined") {
		if (sessionStorage.getItem(key)) {
			value = sessionStorage.getItem(key);
			sessionStorage.removeItem(key);
			return Number(value);
		}
	}
	return def;
}

function setBodyFontSize() {
	var $body = $('#main');
	var orgHeight = 1080;
	var orgWidth = 1920;
	var currHeight = $body.height();
	var currWidth = $body.width();
	var factor = Math.max((orgWidth / currWidth), (orgHeight / currHeight));
	var fontSize = (16 / factor);
	$body.css('font-size', fontSize);
	$('#overlayConatiner').css('font-size', fontSize);
}

function displayProgramCategories() {
	$channelList = $('#channelList')
	$.each(programCategoryName, function(index, cat) {
		$channelList.append('<div class="leftMenuText" id="' + (index + 1) + '"><div class="leftMenuTextBox">' + cat.programCatName + '</div></div>');
	});
}

function focusCurrentCategory() {
	$(allCategoryArray[currentFocusedCategoryIndex]).addClass('selected');
	if (currentFocusedCategoryIndex == 0) {
		$('#myRecordings').addClass('selected');
		$('#allProgramList').removeClass('selected');
		$('#programInfo').removeClass('selected');
	} else {
		if (!$('#allProgramList').hasClass('selected')) {
			$('#myRecordings').removeClass('selected');
			$('#allProgramList').addClass('selected');
			$('#programInfo').addClass('selected');
			allProgramsAdjustScroll(0);
		}
	}
}

function unfocusCurrentCategory() {
	$(allCategoryArray[currentFocusedCategoryIndex]).removeClass('selected');
	//Reset focus and Scroll for the category being unfocused
	if (currentFocusedCategoryIndex == 0) {
		unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
		myProgramsCurrentProgram = 0;
		focusProgram(myProgramsArray[myProgramsCurrentProgram])
		myProgramsAdjustScroll(0);
	} else {
		unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
		allProgramsCurrentProgram = 0;
		focusProgram(allProgramsArray[allProgramsCurrentProgram])
		allProgramsAdjustScroll(0);
		displayInfoForCurrentProgram();
	}
}

function appendProgram(list, programId) {	
  if(typeof programId.valueOf() === "string"){
    var items = [0,1,2,3,4,5,6,7,8,9,10];
    programId = items[Math.floor(Math.random()*items.length)];
  }  
  var imgPath = imagePaths[programId%imagePaths.length];
	var pname = programNames[programId%programNames.length];
	
	var node = $('<div class="program" title="' + pname + '"><input value="' + programId + '" style="display:none"></input><img class="programImageContainer" src="' + imgPath + '"></img><div class="programImageBorder"></div><div class="programNameContainer">' + pname + '</div><div class="programPointer"></div></div>');
	$(list).append(node);
	//TODO 'mousedown' event not working with .on(), live()...etc
	node.bind('mousedown', function(e) {
		xOnDown = e.pageX;
	});
}

function displayProgramsForCategory(category) {
	category = $(category);
	var $programList, programArray;
	if (category.attr('id') == '0') {
		$programList = $('#myRecordingsInnerContainer');
		programArray = myPrograms;
	} else {
		$programList = $('#allProgramListsInnerContainer');
		programArray = programCategoryName[Number(category.attr('id')) - 1].programs;
	}
	$programList.html('');
	$.each(programArray, function() {
		appendProgram($programList, this);
	});
	if (category.attr('id') == 0) {
		myProgramsArray = $('#myRecordingsInnerContainer .program');
	} else {
		allProgramsArray = $('#allProgramListsInnerContainer .program');
	}
}

function focusProgram(program) {
	$(program).addClass('focusedProgram');	
	$('#programDescriptionInner').html(programDescriptions[getFocusedProgramId()%programDescriptions.length]);
}

function getFocusedProgramId() {
	var programId;
	if(currentFocusedCategoryIndex === 0) {
		programId = myProgramsArray.eq(myProgramsCurrentProgram).find('input').val();
	} else {
		programId = getProgramId($(allProgramsArray[allProgramsCurrentProgram]));
	}
	return programId;
}

function unfocusProgram(program) {
	$(program).removeClass('focusedProgram');
}

function getProgramId(program) {
	return Number($($(program).children()[0]).attr('value'));
}

function displayInfoForCurrentProgram() {
	if (allProgramsArray.length == 0) {
		$('#programDescriptionInner').html('');
		$('#tuneMethod').html('');
		return false;
	}
	var currentProgramId = getProgramId($(allProgramsArray[allProgramsCurrentProgram]));
	$('#programDescriptionInner').html(programDescriptions[currentProgramId%programDescriptions.length]);
	$('#tuneMethod').html('Press OK to tune.');
}

function myProgramsAdjustScroll(value) {
	if ( typeof (value) === "undefined") {
		myProgramsScrolled = myProgramsScrolled
	} else if (value == 0) {
		myProgramsScrolled = 0;
	} else {
		myProgramsScrolled += value
	}
	$('#myRecordingsInnerContainer').scrollLeft(programWidth * myProgramsScrolled);
}

function allProgramsAdjustScroll(value) {
	if ( typeof (value) === "undefined") {
		allProgramsScrolled = allProgramsScrolled
	} else if (value == 0) {
		allProgramsScrolled = 0;
	} else {
		allProgramsScrolled += value
	}
	$('#allProgramListsInnerContainer').scrollLeft(programWidth * allProgramsScrolled);
}

// function launchCurrentProgram() {
	// var currentProgramId = getProgramId($(myProgramsArray[myProgramsCurrentProgram]));
	// launchProgramId(currentProgramId);
// }

// function launchProgramId(currentProgramId) {
	// //Store current state
	// if ( typeof (Storage) !== "undefined") {
		// sessionStorage.setItem('currentFocusedCategoryIndex', currentFocusedCategoryIndex);
		// sessionStorage.setItem('allProgramsSelectedCategoryIndex', allProgramsSelectedCategoryIndex);
		// sessionStorage.setItem('myProgramsCurrentProgram', myProgramsCurrentProgram);
		// sessionStorage.setItem('allProgramsCurrentProgram', allProgramsCurrentProgram);
		// sessionStorage.setItem('myProgramsScrolled', ($('#myRecordingsInnerContainer').scrollLeft() / programWidth));
		// sessionStorage.setItem('allProgramsScrolled', ($('#allProgramListsInnerContainer').scrollLeft() / programWidth));
		// sessionStorage.setItem('recordedPrograms', recordedPrograms.toString());
	// }
	// window.location.assign(programs[currentProgramId].browserURL);
// }

function storeCurrentState() {
	//Store current state
	if ( typeof (Storage) !== "undefined") {
		sessionStorage.setItem('currentFocusedCategoryIndex', currentFocusedCategoryIndex);
		sessionStorage.setItem('allProgramsSelectedCategoryIndex', allProgramsSelectedCategoryIndex);
		sessionStorage.setItem('myProgramsCurrentProgram', myProgramsCurrentProgram);
		sessionStorage.setItem('allProgramsCurrentProgram', allProgramsCurrentProgram);
		sessionStorage.setItem('myProgramsScrolled', ($('#myRecordingsInnerContainer').scrollLeft() / programWidth));
		sessionStorage.setItem('allProgramsScrolled', ($('#allProgramListsInnerContainer').scrollLeft() / programWidth));
		sessionStorage.setItem('recordedPrograms', recordedPrograms.toString());
	}
}

function showOptionsPopup() {
	var currentProgramId = getProgramId($(allProgramsArray[allProgramsCurrentProgram]));
	showOverlay(currentProgramId);
}

function showOverlay(programId) {
	overlayIndex = 0;
	
	// in case of no recordings
	if(currentFocusedCategoryIndex === 0 && recordedPrograms.length <= 0) return;
	
	$('#overlayConatiner').show();
	$('#overlayConatiner').addClass('confirm');
	if(currentFocusedCategoryIndex === 0) {
		$('#overlayTitleContainer').html('RECORDING');
		$('#overlayProgramMessage').html('Would you like to play or delete this recording?');
		$('#overlayButtonOk').show();
		$('#overlayButtonOk').html('PLAY');
		$('#overlayButtonOption').html('DELETE');
		$('#overlayButtonCancel').html('CANCEL');
		$('#overlayProgramName').html(myProgramsArray.eq(myProgramsCurrentProgram).attr('title'));
	}
	else {
		if(allProgramsCurrentProgram === 0) {
			$('#overlayButtonOk').click();
		}
		overlayIndex = 1;
		$('#overlayTitleContainer').html('PROGRAM');
		$('#overlayProgramMessage').html('This is a future showing. Do you want to record?');
		$('#overlayButtonOk').hide();
		$('#overlayButtonOption').html('YES');
		$('#overlayButtonCancel').html('NO');
		$('#overlayProgramName').html(programNames[programId%programNames.length]);
	}
	overlaySelectIndex();
}

function addCurrentProgramToRecorded() {
	if(currentFocusedCategoryIndex === 0) {
		$.get('/cgi-bin/delete_rec.sh?' + recIds[myProgramsCurrentProgram], function(data) {
			console.log("recording deleted!");
			recsMap.splice(myProgramsCurrentProgram, 1);
			window.location.reload();
    	});
	}
	else {
		console.error("error recording program!");
		// alert("error recording program!");
	}
	// var currentProgramId = getProgramId($(allProgramsArray[allProgramsCurrentProgram]));
	// appendProgram($('#myRecordingsInnerContainer'), currentProgramId);
	// myProgramsArray = $('#myRecordingsInnerContainer .program');
	// myPrograms.push(currentProgramId);
	// recordedPrograms.push(currentProgramId);
	// displayInfoForCurrentProgram();
	// animateRecordedProgram(myProgramsArray[myProgramsArray.length - 1]);
}

function animateRecordedProgram(program) {
	$(program).css('opacity', '0.0');
	$(program).animate({
		opacity : 1.0,
	}, 1000, 'linear');
	myProgramsScrolled = myProgramsArray.length - 6;
	$('#myRecordingsInnerContainer').animate({
		scrollLeft : (programWidth * myProgramsScrolled),
	}, 800);
}

//Click events
$(document).on('click', '.leftMenuText', function() {
	indx = allCategoryArray.index(this);
	if (indx == -1)
		return false;
	allProgramsAdjustScroll(0);
	if (indx != currentFocusedCategoryIndex) {
		unfocusCurrentCategory()
		currentFocusedCategoryIndex = indx;
		focusCurrentCategory();
		if (currentFocusedCategoryIndex != 0) {
			allProgramsSelectedCategoryIndex = currentFocusedCategoryIndex;
			displayProgramsForCategory(allCategoryArray[allProgramsSelectedCategoryIndex]);
			allProgramsCurrentProgram = 0;
			focusProgram(allProgramsArray[allProgramsCurrentProgram]);
			displayInfoForCurrentProgram();
		} else {
			myProgramsAdjustScroll(0);
		}
	}
});

$(document).on('click', '#myRecordings .program', function(e) {
	if (xOnDown != e.pageX) {
		return false;
	}
	programIndx = myProgramsArray.index(this);
	if (programIndx != myProgramsCurrentProgram) {
		unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
		myProgramsCurrentProgram = programIndx;
		focusProgram(myProgramsArray[myProgramsCurrentProgram]);
	}
	showOptionsPopup();
});

$(document).on('click', '#allProgramList .program', function(e) {
	if (xOnDown != e.pageX) {
		return false;
	}
	programIndx = allProgramsArray.index(this);
	if (programIndx != allProgramsCurrentProgram) {
		unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
		allProgramsCurrentProgram = programIndx;
		focusProgram(allProgramsArray[allProgramsCurrentProgram]);
		displayInfoForCurrentProgram();
	}
	showOptionsPopup();
});

$(document).on('click', '.overlayButton', function() {
	$('#overlayConatiner').hide();
});

$(document).on('click', '.confirm #overlayButtonOption', function() {
	addCurrentProgramToRecorded();
});

$(document).on('click', '#overlayButtonOk', function() {
	if(currentFocusedCategoryIndex == 0) {
		document.location.href = 'video.html#rec=' + recIds[myProgramsCurrentProgram];
	}
	else {
		document.location.href = 'video.html#' + getFocusedProgramId().toString();
	}
});

$(document).on('click', '#programInfo', function() {
	if (currentFocusedCategoryIndex == 0) {
		unfocusCurrentCategory()
		currentFocusedCategoryIndex = allProgramsSelectedCategoryIndex;
		focusCurrentCategory();
	}
});

//Keyboard events
$(window).keydown(function(event) {
	try {
		if ($('#overlayConatiner').css('display') == 'block')
			handleKeyForOverlay(event.keyCode);
		else
			handleKeyForMain(event.keyCode);
		storeCurrentState();
	} catch(err) {
		// alert(err);
	}
});

function handleKeyForMain(keyCode) {
	
  switch(keyCode) {
		case KEY_MENU:
                case KEY_KB_GUIDE:
                        document.location.href = 'guide.html';
                        break;

		case KEY_OK:
			// Enter
			showOptionsPopup();
			break;
		case KEY_UP:
		case KEY_KB_UP:
			// Up
			if (currentFocusedCategoryIndex != 0) {
				unfocusCurrentCategory();
				currentFocusedCategoryIndex -= 1;
				focusCurrentCategory();
				allProgramsAdjustScroll(0);
				if (allProgramsSelectedCategoryIndex != currentFocusedCategoryIndex && currentFocusedCategoryIndex != 0) {
					displayProgramsForCategory(allCategoryArray[currentFocusedCategoryIndex]);
					focusProgram(allProgramsArray[0]);
					allProgramsCurrentProgram = 0;
					displayInfoForCurrentProgram();
				}
				if (currentFocusedCategoryIndex != 0)
					allProgramsSelectedCategoryIndex = currentFocusedCategoryIndex;
				else
					myProgramsAdjustScroll(0);
			} else {
				unfocusCurrentCategory();
				myProgramsAdjustScroll(0);
				currentFocusedCategoryIndex = allProgramsSelectedCategoryIndex = allCategoryArray.length - 1;
				focusCurrentCategory();
				displayProgramsForCategory(allCategoryArray[currentFocusedCategoryIndex]);
				focusProgram(allProgramsArray[0]);
				allProgramsCurrentProgram = 0;
				displayInfoForCurrentProgram();
			}
			break;
		case KEY_LEFT:
                case KEY_KB_LEFT:
			// Left
			var currentPrograms;
			if (currentFocusedCategoryIndex == 0) {
				if (myProgramsCurrentProgram != 0) {
					unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
					myProgramsCurrentProgram -= 1;
					focusProgram(myProgramsArray[myProgramsCurrentProgram]);
					// displayInfoForCurrentProgram();
					if (myProgramsCurrentProgram < myProgramsScrolled)
						myProgramsAdjustScroll(-1);
					if (($('#myRecordingsInnerContainer').scrollLeft() / programWidth) + 6 < myProgramsCurrentProgram)
						$('#myRecordingsInnerContainer').scrollLeft(programWidth * (myProgramsCurrentProgram - 4));
				} else {
					unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
					myProgramsCurrentProgram = (myProgramsArray.length - 1);
					myProgramsScrolled = myProgramsArray.length - 6;
					myProgramsAdjustScroll();
					focusProgram(myProgramsArray[myProgramsCurrentProgram]);
					// displayInfoForCurrentProgram();
				}
			} else {
				if (allProgramsCurrentProgram != 0) {
					unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsCurrentProgram -= 1;
					focusProgram(allProgramsArray[allProgramsCurrentProgram]);
					displayInfoForCurrentProgram();
					if (allProgramsCurrentProgram < allProgramsScrolled) {
						allProgramsAdjustScroll(-1);
					}
					if (($('#allProgramListsInnerContainer').scrollLeft() / programWidth) + 6 < allProgramsCurrentProgram)
						$('#allProgramListsInnerContainer').scrollLeft(programWidth * (allProgramsCurrentProgram - 4));
				} else {
					unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsCurrentProgram = (allProgramsArray.length - 1);
					focusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsScrolled = allProgramsArray.length - 6;
					allProgramsAdjustScroll();
					displayInfoForCurrentProgram();
				}
			}
			break;
		case KEY_DOWN:
                case KEY_KB_DOWN:
			// Down
			if (currentFocusedCategoryIndex != (allCategoryArray.length - 1)) {
				unfocusCurrentCategory();
				currentFocusedCategoryIndex += 1;
				focusCurrentCategory();
				allProgramsAdjustScroll(0);
				if (allProgramsSelectedCategoryIndex != currentFocusedCategoryIndex) {
					displayProgramsForCategory(allCategoryArray[currentFocusedCategoryIndex]);
					focusProgram(allProgramsArray[0]);
					allProgramsCurrentProgram = 0;
					displayInfoForCurrentProgram();
				}
				if (currentFocusedCategoryIndex != 0)
					allProgramsSelectedCategoryIndex = currentFocusedCategoryIndex;
			} else {
				unfocusCurrentCategory();
				allProgramsAdjustScroll(0);
				currentFocusedCategoryIndex = 0;
				focusCurrentCategory();
				myProgramsAdjustScroll(0);
			}
			break;
		case KEY_RIGHT:
		case KEY_KB_RIGHT:
			// Right
			var currentPrograms;
			if (currentFocusedCategoryIndex == 0) {
				if (myProgramsCurrentProgram != (myProgramsArray.length - 1)) {
					unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
					myProgramsCurrentProgram += 1;
					focusProgram(myProgramsArray[myProgramsCurrentProgram]);
					// displayInfoForCurrentProgram();
					if (myProgramsCurrentProgram > 5)
						myProgramsAdjustScroll(1);
					else
						myProgramsAdjustScroll(0);
				} else {
					unfocusProgram(myProgramsArray[myProgramsCurrentProgram]);
					myProgramsCurrentProgram = 0;
					myProgramsAdjustScroll(0);
					focusProgram(myProgramsArray[myProgramsCurrentProgram]);
					// displayInfoForCurrentProgram();
				}
			} else {
				if (allProgramsCurrentProgram != (allProgramsArray.length - 1)) {
					unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsCurrentProgram += 1;
					focusProgram(allProgramsArray[allProgramsCurrentProgram]);
					displayInfoForCurrentProgram();
					if (allProgramsCurrentProgram > 5)
						allProgramsAdjustScroll(1);
					else
						allProgramsAdjustScroll(0);
				} else {
					unfocusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsCurrentProgram = 0;
					focusProgram(allProgramsArray[allProgramsCurrentProgram]);
					allProgramsAdjustScroll(0);
					displayInfoForCurrentProgram();
				}
			}
			break;
	}
}

var overlayIndex = 0;
function handleKeyForOverlay(keyCode) {
	var maxIndex = $('.overlayButton').length - 1;
	var minIndex = 0;

	switch(keyCode) {
		case KEY_ESC:
			$('#overlayConatiner').hide();
			return;
		case KEY_OK:
			//enter
			$('.overlayButton.selected').click();
		case KEY_LEFT:
		case KEY_KB_LEFT:
			//left
			overlayIndex--;
			break;
		case KEY_RIGHT:
		case KEY_KB_RIGHT:
			//right
			overlayIndex++;		
			break;
	}
	
	if($('#overlayButtonOk').css('display') == 'none') {
		minIndex = 1;
	}
	
	if(overlayIndex > maxIndex) overlayIndex = minIndex;
	if(overlayIndex < minIndex) overlayIndex = maxIndex;
	overlaySelectIndex();
}

function overlaySelectIndex() {
	$('.overlayButton').eq(overlayIndex).addClass('selected').siblings().removeClass('selected');
}

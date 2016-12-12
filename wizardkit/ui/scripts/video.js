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
// program id would be -1 in case playing a recording
var programId = 0;
var recordingId = -1;

// get the channel number or recording id.
try {
	var hash = window.location.hash.split('#')[1];
	// in case of recording play
	if (hash.indexOf("rec") == 0) {
		recordingId = parseInt(hash.split('=')[1]);
		programId = -1;
	} 
	// in case of channel play
	else {
		programId = parseInt(hash);
	}

	if (isNaN(programId))
		programId = 0;
} catch(e) {
}

$(document.body).on("ip", function() {
	if (programId != -1) {
		loadProgram();
	} else {
		loadRecording();
	}
});

$('video').bind('ended', function(){
	console.log("video ended");
	
	if (programId != -1) {
		loadProgram();
	} else {
		loadRecording();
	}
	
});

var playing = true;
var recording = false;
var tuneChannel = '';

var tune_lock;
var rec_lock;

// key handling
$(document).keydown(function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	// recording
	if (code == KEY_REC) {
		if (programId == -1 || recording) {
			return;
		}
		// record
		var freq = $('#main_channel').attr('src').match(/ocap:\/\/(0x..)/i);

		if (freq != null && freq.length == 2) {
			freq = freq[1];
			var url = getRecordUrl(freq, programId);
			$.get(url, function(data) {
				
				recording = true;
				$("#recordIcon").show();

				clearTimeout(rec_lock);
				rec_lock = setTimeout(function() {
					$("#recordIcon").hide();
					recording = false;
				}, 4000);
				return;
			});
		}
	}
	
	// menu/guide key
	if (code == KEY_MENU || code == KEY_KB_GUIDE || code == KEY_GUIDE) {
                playing = false;
		document.location.href = 'guide.html';
	}
	
	// channel up key
	if (code == KEY_PLUS) {
		if (programId != -1) {
			programId = programId >= 999 ? 999 : (programId + 1);
			loadProgram();
		}
	}
	// channel down key 
	else if (code == KEY_MINUS) {
		if (programId != -1) {
			programId = programId <= 0 ? 0 : (programId - 1);
			loadProgram();
		}
	} 
	
	// commented out following snippet for playback rate change
	/*
	// left key
	else if (code == KEY_LEFT) {
		var rate = $('video')[0].playbackRate;
		rate = rate <= .5 ? .5 : (rate - .5);
		$('video')[0].playbackRate = rate;

		showPlaybackStateIcon("Playback Rate: " + rate.toFixed(1));
	} 
	// right key
	else if (code == KEY_RIGHT) {
		var rate = $('video')[0].playbackRate;
		rate = rate >= 3 ? 3 : (rate + .5);
		$('video')[0].playbackRate = rate;

		showPlaybackStateIcon("Playback Rate: " + rate.toFixed(1));
	} 
	*/

	// play key
	else if (code == KEY_PLAY) {
		if(!playing) {
			$('video')[0].play();
			$('#stateIcon').hide();
			playing = true;
		}
	} 
	// pause key
	else if (code == KEY_PAUSE) {
		if (playing) {
			clearTimeout(state_lock);
			$('video')[0].pause();
			$('#stateIcon').show();
			$('#stateIcon').text("I I");
			playing = false;
		}
	}
	// numeric keys, will load that particular channel
	else if (code >= 48 && code <= 57) {
		if (tuneChannel.length >= 3)
			return;

		clearTimeout(tune_lock);
		tuneChannel = tuneChannel + (code - 48).toString();
		$('#channelNumber').show();
		$('#channelNumber').text(tuneChannel);

		tune_lock = setTimeout(function() {
			$('#channelNumber').hide();
			programId = parseInt(tuneChannel);
			loadProgram();
			tuneChannel = '';
		}, 1500);
	}
});


// method to show play rate and hide it after a timeout
var state_lock;
function showPlaybackStateIcon(str) {
	clearTimeout(state_lock);
	$('video')[0].play();
	$('#stateIcon').show();
	$('#stateIcon').text(str);
	playing = true;

	state_lock = setTimeout(function() {
		$('#stateIcon').hide();
	}, 5000);
}

var lock;
function loadProgram() {
	clearTimeout(lock);
	$('#channelNumber').text(programId.toString());
	loadVideo(programUrls[programId % programUrls.length]);
	$('#channelNumber').show();
	lock = setTimeout(function() {
		$('#channelNumber').hide();
	}, 5000);
}

function loadRecording() {
	loadVideo(getRecordPlayUrl(recordingId));
}

// given a url, load the video as video tag source
function loadVideo(url) {
	console.log("loading url:" + url);
	$('#main_channel').attr('src', url);
	$('video').load();
}

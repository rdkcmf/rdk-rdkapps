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
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40, KEY_OK = 13, KEY_PLAY = 13, KEY_PAUSE = 19,
KEY_GUIDE = 18, KEY_MENU = 18, KEY_ESC = 27, KEY_REC = 113, KEY_A = 122, KEY_B = 121, KEY_C = 119, KEY_PLUS = 176, KEY_MINUS = 177;
KEY_KB_GUIDE = 71, KEY_KB_REC = 82, KEY_KB_LEFT= 65, KEY_KB_RIGHT= 68, KEY_KB_UP= 87, KEY_KB_DOWN= 83;

var myPrograms = [];

var programCategoryName = [{
	programCatName : 'HBO',
	programs : [105, 601, 107, 103, 108, 104, 106, 604, 502, 409, 410, 411, 412, 413, 414]
}, {
	programCatName : 'CNN',
	programs : [104, 102, 103, 105, 106, 604, 601, 107, 414, 413, 412, 411, 410, 409, 108]
}, {
	programCatName : 'BBC',
	programs : [101, 403, 107, 601, 604, 106, 105, 103, 410, 108, 409, 411, 414, 412, 413]
}, {
	programCatName : 'Discovery',
	programs : [102, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 108]
}, {
	programCatName : 'Star',
	programs : [103, 502, 503, 504, 106, 604, 103, 107, 102, 402, 108, 410, 407, 406, 409]
}];


var serverBoxIp = '127.0.0.1';
var serverMocaIp = '127.0.0.1';

var programUrls;

function initUrls() {
        baseUrl = window.location.protocol + '//' + window.location.host
	programUrls = [baseUrl + ':8080/vldms/tuner?ocap_locator=ocap://0xa2',
			baseUrl + ':8080/vldms/tuner?ocap_locator=ocap://0xa3',
			baseUrl + ':8080/vldms/tuner?ocap_locator=ocap://0xa4',
			baseUrl + ':8080/vldms/tuner?ocap_locator=ocap://0xa5'];
}

function getRecordingsMap() {
	var jsonText = "";
	var recordingsList = [];

	var xobj = new XMLHttpRequest();
	var request = "/cgi-bin/getRecordings.sh";
	xobj.open('GET', request, false);
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4) {
      jsonText = xobj.responseText;
      obj = JSON.parse(jsonText);
      var recCount = parseInt(obj.recordings.recordingCount)
      for (var i = 0; i < recCount; i++)
      {
          var recName =(obj.recordings.list[i].title);
          var recId = (obj.recordings.list[i].recordingId);
          var element = recId + "=" + recName;
          recordingsList.push(element);
      }
		}
	}
	xobj.send(null);
	return recordingsList;
}


function getRecordUrl(freq, programId) {
  return '/cgi-bin/rec.sh?' + freq ;
}

function getRecordPlayUrl(recId) {
	return 'http://' + serverMocaIp + ':8080/vldms/dvr?rec_id=' + recId;
}

var imagePaths = ['Cover Art/Corporate Headquarters.png',
				'Cover Art/Encounter.png',
				'Cover Art/In her eyes.png',
				'Cover Art/Into the Wild.png',
				'Cover Art/Metamorphosis.png',
				'Cover Art/Mystic Falls.png',
				'Cover Art/Play the Odds.png',
				'Cover Art/Terra Nullius.png',
				'Cover Art/The Highway.png',
				'Cover Art/The Woods.png',
				'Cover Art/Threshold.png'
];

var programDescriptions =
["Conor Richardson has everything a man in his late 20's dreams of -- an exciting, well-paying jobon Wall Street, the breathtaking supermodel girlfriend, a close group of friends, and a supportive family that lives only a few hours away from him outside of New York City. All seems to be going well for the successful financial analyst until he is summoned to travel to Wall Street corporate headquarters for a \"meeting,\" one he is sure to never forgot or remember fondly.",
"Phipps and Sween, twin inhabitants of Pluto, have lived on the planet their entire lives, never expecting to leave. However, when they turn 18, both are told they must take an extended trip to planet Earth to act as undercover spies to determine how humans here live. The duo is ordered to learn the secrets of the human race to inform Plutonians how these creatures live, providing leaders back on their planet with information on how to fight those on Earth most strategically, and ultimately, take over. However, as both Phipps and Sween pretend to be high school seniors at a local school in Florida, both find someone they develop feelings for, causing a conflict of interest between their overall mission and personal endeavors.",
"Paola, a young woman from Mexico City, struggles financially, but is a very hard-working individual. She ends up earning an all-expense paid vacation through a raffle she entered at a local grocery store. Beyond excited for this opportunity to travel to the United States for the first time, Paola lands in Las Vegas, Nevada for her week-long getaway. She meets a man the first day of her trip who wants to show her all around the city, and she hprogramily agrees. The progressing relationship unfolds throughout this enchanting story, showing a woman who does not have much how she can evolve and learn to stand on her own two feet.",
"Liam becomes acquainted with Daniella at an elderly dance he is required to volunteer at with his college lacrosse team to earn community service hours. Soon after meeting her, Liam realizes Daniella is known as very awkward at their small liberal arts college, a girl that is made fun of by many of their peers due to her alternative taste in clothing, keen interest in theatre, and strong opinions during class discussions. However, Liam is intrigued by Daniella's spirit and confidence, and takes the initiative to get to know her when he is not around his team members. He learns a lot more about her than others know, and truly admires her determination to succeed based on her unfortunate circumstances.",
"Fiona and Drake decide to go on hiking Saturday morning to get some fresh air. Both just moved to West Virginia and do not know the area well, simply relying on trail markers for guidance. The two end up getting lost, having to spend the night in the woods with no food, water or sleeping bags. The pair encounters creatures of the night, as well as other obstacles they never thought they would have to deal with. Do the two friends survive this unfortunate experience, or get eaten alive by those animals bigger and stronger than them?",
"Phil Denton, a 20-year-old college student, discovers he has the ability to travel back in time to be his former self and change the present by altering his past actions. A victim of several childhood traumas as a result of an unstable family, he attempts to make things better for himself, but unexpected consequences occur. The film draws heavily on flashbacks of his life from ages 4 and 11, depicting several alternate present-day situations as Phil attempts to alter the past before choosing a final outcome for himself.",
"Christa, a high school senior, learns of a place known as the prime destination to make any wish come true, as long as it is requested at this location. Really wanting something positive to hprogramen for her younger brother who is struggling with depression, she drives a long 3 hours out to Mystic Falls to grant this request. However, she never returns home after this trip. Christa's family and friends tirelessly search for her, but will they ever find her?",
"Glen, an astronaut for NASA, is part of a trip to explore Mars and its inhabitants in the year 2050. As him and his fellow astronauts are about to land on the unexplored planet, their cabin is blown up, killing everyone except Denise, a medical engineer with very little knowledge of space, let alone how to survive when stranded within it. Will the two return back to planet Earth, or end up dying in a land of unexplored territory?",
"James, an entrepreneur, travels weekly for his work, living out of hotels all across the United States. He has many interesting experiences through his travel, interacting with all different types of people. While driving to Omaha one day, he sees a homeless person with a cardboard sign begging for money. In a generous mood, James decides to help him, which leads to all hell breaking loose.",
"Benji and his friends are excited for their annual camping trip to the Programalachian mountains. The group decides to change their usual campsite at the last minute to a different one about 40 miles from their typical spot. Once the group arrives and the sun starts to go down, they realize that there is something eerie about this particular site, and they are not safe. Things only get worse as the night goes on.",
"The Commander, one of the U.S. Navy's many prestigious ships, comes across a key discovery while out at sea one day. A few men aboard discover an extra-terrestrial object that briefly programeared near their ship in the Pacific Ocean. As a result, they assemble a team of experts to find it the object and figure out exactly what it is and if it is dangerous."
];


var programNames =
['Corporate', 'Encounter', 'In her eyes', 'Into the Wild', 'Metamorphosis', 'Mystic Falls', 'Play the Odds', 'Terra Nullius', 'The Highway', 'The Woods', 'Threshold'];


var programs = [101, 102, 103, 104, 105, 106, 301, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 501, 502, 503, 504, 601, 604, 108, 110, 107];

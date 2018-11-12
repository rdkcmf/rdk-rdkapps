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
$(document).keydown(function(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	
	switch(code) {
		case KEY_A :
			e.preventDefault();
			displayString(getDeviceInfo());
			break;
		case KEY_B :
			e.preventDefault();
			displayString(getImageName());
			break;
		case KEY_C :
			e.preventDefault();
			displayString(getVideoResolution());
			break;
	}
});


function displayString(str) {
	console.log(str);
	
	$('#service-manager').remove();
	
	$(document.body).append('<div id="service-manager"' + 
	' style="position:fixed;bottom:5%;left:0px;display:inline-block;padding:10px 20px 10px 50px;color:black;background:yellow;font-family:sans-serif;z-index:10000;">' + 
	str	+
	'</div>');
}

function getDeviceInfo() {
	if(typeof ServiceManager !== 'undefined') {
		var info = ServiceManager.getServiceForJavaScript("deviceSettingService").getDeviceInfo("info.txt");
		var tokens = info.split(" ");

		var boxIp = tokens[1].split("=")[1];
		var mac = tokens[2].split("=")[1];
		
		return "BOX IP: " + boxIp + " , MAC: " + mac;
	}
	else {
		return "Service Manager not defined";
	}
}

function getImageName() {
	if(typeof ServiceManager !== 'undefined') {
		var info = ServiceManager.getServiceForJavaScript("deviceSettingService").getDeviceInfo("info.txt");
		var tokens = info.split(" ");

		var imagename = tokens[0].split("=")[1];
		
		return "IMAGE NAME: " + imagename;
	}
	else {
		return "Service Manager not defined";
	}
}

function getVideoResolution() {
	if(typeof ServiceManager !== 'undefined') {
		var info = ServiceManager.getServiceForJavaScript("org.openrdk.DisplaySettings");
		var displays = info.getConnectedVideoDisplays("null");
		
		var resolution = "";
		
		for(var i = 0; i < displays.length; i++) {
			resolution += displays[i] + ":" + info.getCurrentResolution(displays[i]) + " ";
		}
		
		return "RESOLUTIONS: " + resolution;
	}
	else {
		return "Service Manager not defined";
	}
}

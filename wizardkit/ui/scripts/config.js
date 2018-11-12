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
var isEmulator = false;

// simple regex to get the ip from a string
var ipregex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;

// For emulator
function emulatorConfig() {
	$.ajax({
		url : "/deviceinfo.html",
		dataType : "text",
		success : function(text) {
			serverBoxIp = text.match(ipregex)[0];
			initUrls();
			$(document.body).trigger("ip");
		}
	});
}

// For Gateway Box
function gatewayConfig() {
	var ipdef = new $.Deferred();
	var mocadef = new $.Deferred();
	
	$.ajax({
		url : "/cgi-bin/lanIp.sh",
		dataType : "text",
		success : function(text) {
			serverBoxIp = text.match(ipregex)[0];
			ipdef.resolve();
		}
	});
	
	$.ajax({
		url : "/cgi-bin/mocaIp.sh",
		dataType : "text",
		success : function(text) {
			serverMocaIp = text.match(ipregex)[0];
			mocadef.resolve();
		}
	});
	
	// when both server box ip and moca ip is retrieved
	$.when.apply(undefined, [ipdef, mocadef]).done(function(){
		// initialize urls according to the new ip address.
		initUrls();
		// trigger "ip" event.
		$(document.body).trigger("ip");
	});
}

$(document).ready(function(){
	// check boolean if its emulator or not
	if(isEmulator) emulatorConfig();
	else gatewayConfig();
});

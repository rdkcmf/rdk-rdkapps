#!/bin/sh
###############################################################################
# If not stated otherwise in this file or this component's Licenses.txt file the
# following copyright and licenses apply:
#
# Copyright 2016 RDK Management
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
###############################################################################

#FixME:: we should get rid of this. There is nothing here that can't be done in js
# this should be removed and all this work done in javascript.
echo "" > /tmp/recordings.txt
`wget -O /tmp/recordings.txt http://127.0.0.1:8080/HDPStub/listRecordings`
line=`/bin/cat /tmp/recordings.txt`
echo 'Content-type: application/json'
echo ""
echo "$line"
echo ""

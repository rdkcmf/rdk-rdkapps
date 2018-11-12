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

Log_File="/opt/standalone_log.txt"

echo "Fetching moca ip " > $Log_File

echo 'Content-type: application/json' 
echo "" 
mocaIp=`/sbin/ifconfig | grep -A1 mca0 | grep "inet addr" | cut -d ":" -f 2 | cut -d " " -f 1|head -1`

# if can't be retreived, return a sane value
if [ "$mocaIp" = "" ]
then
   mocaIp="0.0.0.0"
fi

echo '{"mocaIp": "'$mocaIp'" }'

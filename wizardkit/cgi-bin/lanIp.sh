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

echo "Fetching lan ip " >> $Log_File

echo 'Content-type: application/json'
echo ""
lanIp=`/sbin/ifconfig | grep -A1 eth0 | grep "inet addr" | cut -d ":" -f 2 | cut -d " " -f 1`

#may be the interface name is eth1
if [ "$lanIp" = "" ]
then
    lanIp=`/sbin/ifconfig | grep -A1 eth1 | grep "inet addr" | cut -d ":" -f 2 | cut -d " " -f 1`
fi

# if still can't find return a sane value so that someone parsing json doesn't go out of whack.
if [ "$lanIp" = "" ]
then
   lanIp="0.0.0.0"
fi

echo '{"lanIp": "'$lanIp'" }'


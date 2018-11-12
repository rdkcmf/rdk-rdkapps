#!/bin/sh
##########################################################################
# If not stated otherwise in this file or this component's Licenses.txt
# file the following copyright and licenses apply:
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
##########################################################################
#
#PATH=/usr/bin:/bin:/usr/local/bin:/sbin:/usr/local/ccplatform/sbin:/usr/local/lighttpd/sbin:/usr/local/lighttpd/bin:/usr/local/Qt/lib
#LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/Qt/lib

PATH=/usr/bin:/bin:/usr/sbin:/usr/local/bin:/sbin:/usr/local/lighttpd/sbin:/usr/local/sbin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/Qt/lib

if [ -f /etc/os-release ]; then
    lighttpd -m /usr/lib -f /webserver/lighttpd.conf
else
    lighttpd -m /usr/local/lib -f /webserver/lighttpd.conf
fi


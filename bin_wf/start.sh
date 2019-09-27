#!/bin/sh
/sbin/pidof /home/stefan0/webapps/digit/bin/node > /dev/null 2>&1 && exit 0
mkdir -p /home/stefan0/webapps/digit/run
nohup /home/stefan0/webapps/digit/bin/node /home/stefan0/webapps/digit/bin/www.js > /dev/null 2>&1 &
/sbin/pidof /home/stefan0/webapps/digit/bin/node > /home/stefan0/webapps/digit/run/node.pid
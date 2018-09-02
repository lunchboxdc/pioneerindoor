#!/bin/sh

if ping -c 1 host.docker.internal &> /dev/null ; then
	export DB_HOST=host.docker.internal
elif ping -c 1 docker.for.mac.localhost &> /dev/null ; then
	export DB_HOST=docker.for.mac.localhost
elif ping -c 1 localhost &> /dev/null ; then
	export DB_HOST=localhost
fi

pm2 start pm2.json --attach

#!/bin/sh -e

CURRENT_PORT=`grep -oP 'http://site_\K(\d{4})(?=;)' /etc/nginx/nginx.conf`

UPDATE_PORT=3002
if [ ! -z "$1" ] ; then
	UPDATE_PORT=$1
elif [ $CURRENT_PORT -eq 3002 ] ; then
	UPDATE_PORT=3003
fi

NGINX_MATCH=http://site_$CURRENT_PORT
NGINX_REPLACE=http://site_$UPDATE_PORT

sed -i "s#$NGINX_MATCH#$NGINX_REPLACE#g" /etc/nginx/nginx.conf

echo "nginx site port updated to $UPDATE_PORT"
nginx -s reload

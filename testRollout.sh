#!/bin/bash

PORT=0
until ! sleep .5; do
	RESPONSE=`curl -sSf localhost`
	if [ $? -eq 0 ] ; then
		NEW_PORT=$(grep -oP '(?<=PORT::)[[:digit:]]{4}(?=::PORT)' <<< $RESPONSE)
		CHANGED_MESSAGE=""
		if [ $NEW_PORT -ne $PORT ] ; then
			CHANGED_MESSAGE="release"
			PORT=$NEW_PORT
		fi
		echo "$NEW_PORT $CHANGED_MESSAGE"
	fi
done

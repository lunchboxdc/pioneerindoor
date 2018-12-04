#!/bin/bash

# $(aws ecr get-login --no-include-email)

cd ..
docker build -f Dockerfile.site -t 334736187797.dkr.ecr.us-east-2.amazonaws.com/pi-site:latest .
docker push 334736187797.dkr.ecr.us-east-2.amazonaws.com/pi-site:latest

CURRENT_TASK_ARN=$(aws ecs describe-tasks --cluster pi-ecs-cluster --tasks $(aws ecs list-tasks --cluster pi-ecs-cluster --output text --query 'taskArns[]' 2> /dev/null) --output text --query 'tasks[?group==`site`].taskArn' 2> /dev/null)

if [ -z "$CURRENT_TASK_ARN" ] ; then
	echo "warn - no currently running tasks found for pi-site"
else
	CURRENT_PORT=$(aws ecs describe-tasks --cluster pi-ecs-cluster --tasks $CURRENT_TASK_ARN --output text --query 'tasks[?group==`site`].containers[0].networkBindings[0].containerPort' 2> /dev/null)
fi

NODE_PORT=3002
if [ "$CURRENT_PORT" == "3002" ] ; then
	NODE_PORT=3003
fi

cd aws
TASK_REVISION=`aws ecs register-task-definition --cli-input-json "$(cat site-task-definition.json | NODE_PORT=$NODE_PORT envsubst)" --query 'taskDefinition.taskDefinitionArn' | sed -n "s/^.*\/\(.*\)\".*$/\1/p"`
RELEASE_TASK_ARN=$(aws ecs run-task --cluster pi-ecs-cluster --task-definition $TASK_REVISION --count 1 --group site --output text --query 'tasks[0].taskArn')

if [ -z "$RELEASE_TASK_ARN" ] ; then
	echo "error - unable to fetch release taskArn of pi-site"
	echo "leaving task $CURRENT_TASK_ARN running"
	exit 1
else
	echo "started task $RELEASE_TASK_ARN"
fi


if [ ! -z "$CURRENT_TASK_ARN" ] ; then
	echo "sleeping for 10s"
	sleep 10
	aws ecs stop-task --cluster pi-ecs-cluster --task $CURRENT_TASK_ARN
fi

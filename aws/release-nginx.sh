#!/bin/bash

$(aws ecr get-login --no-include-email)

CURRENT_TASK_ARN=$(aws ecs describe-tasks --cluster pi-ecs-cluster --tasks $(aws ecs list-tasks --cluster pi-ecs-cluster --output text --query 'taskArns[]') --output text --query 'tasks[?group==`site`].taskArn')

if [ -z "$CURRENT_TASK_ARN" ] ; then
	echo "warn - no currently running tasks found for pi-site"
else
	echo "current task arn: $CURRENT_TASK_ARN"
	CURRENT_PORT=$(aws ecs describe-tasks --cluster pi-ecs-cluster --tasks $CURRENT_TASK_ARN --output text --query 'tasks[?group==`site`].containers[0].networkBindings[0].containerPort' 2> /dev/null)
	echo "current port: $CURRENT_PORT"
fi

if [ -z "$CURRENT_PORT" ] ; then
	CURRENT_PORT=3002
fi


cd ..
docker build -f Dockerfile.nginx -t 334736187797.dkr.ecr.us-east-2.amazonaws.com/pi-nginx:latest .
docker push 334736187797.dkr.ecr.us-east-2.amazonaws.com/pi-nginx:latest

cd aws
TASK_REVISION=`aws ecs register-task-definition --cli-input-json "$(cat nginx-task-definition.json | NODE_PORT=$CURRENT_PORT envsubst)" --query 'taskDefinition.taskDefinitionArn' | sed -n "s/^.*\/\(.*\)\".*$/\1/p"`
RELEASE_TASK_ARN=$(aws ecs run-task --cluster pi-ecs-cluster --task-definition $TASK_REVISION --count 1 --group nginx --output text --query 'tasks[0].taskArn')

if [ ! -z "$RELEASE_TASK_ARN" ] ; then
	echo "started task $RELEASE_TASK_ARN"
fi

#!/bin/bash

AWS_DEFAULT_REGION=us-east-2
AWS_SECRETS_BUCKET_REGION=us-east-2

if [ -z $1 ] || [ $1 != "delete-pi-prod" ] ; then
    echo "must pass 'delete-pi-prod' as arg!"
    exit 1
fi

echo "deleting prod environment..."

INSTANCE_ID=`aws ec2 describe-instances --filters "Name=key-name,Values=pi-ecs" --query 'Reservations[*].Instances[*].InstanceId' --output text`
if [ ! -z "$INSTANCE_ID" ] ; then
    echo "terminating instance..."
    aws ec2 terminate-instances --instance-ids $INSTANCE_ID
    echo "waiting for instance to terminate..."
    aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID
fi

aws iam remove-role-from-instance-profile --instance-profile-name pi-instance-profile --role-name pi-ecs-role
aws iam delete-instance-profile --instance-profile-name pi-instance-profile
aws iam delete-role-policy --role-name pi-ecs-role --policy-name pi-ecs-role-policy
aws iam delete-role --role-name pi-ecs-role

aws ecs delete-cluster --cluster pi-ecs-cluster

aws ec2 delete-key-pair --key-name pi-ecs
aws ec2 delete-security-group --group-name pi-ecs-security-group

aws ssm delete-parameters --names "pi.db-user" "pi.db-pass" "pi.db-host"

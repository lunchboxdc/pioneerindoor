#!/bin/bash

if [ -z $1 ] || [ $1 != "delete-pi-prod" ] ; then
    echo "must pass 'delete-pi-prod' as arg!"
    exit 1
fi

echo "deleting prod environment..."

aws ec2 terminate-instances --instance-id=$(aws ec2 describe-instances --filters "Name=key-name,Values=pi-ecs" --query 'Reservations[*].Instances[*].InstanceId' --output text)

aws iam remove-role-from-instance-profile --instance-profile-name pi-instance-profile --role-name pi-ecs-role
aws iam delete-instance-profile --instance-profile-name pi-instance-profile
aws iam delete-role-policy --role-name pi-ecs-role --policy-name pi-ecs-role-policy
aws iam delete-role --role-name pi-ecs-role

aws ecs delete-cluster --cluster pi-ecs-cluster

aws ec2 delete-key-pair --key-name pi-ecs
aws ec2 delete-security-group --group-name pi-ecs-security-group

#!/bin/bash

AWS_DEFAULT_REGION=us-east-2
AWS_SECRETS_BUCKET_REGION=us-east-2


printf "iam roles...\n"
aws iam list-roles --query 'Roles[].[Path,RoleName,Description]'
printf "\n\n"

printf "iam role policies...\n"
aws iam list-role-policies --role-name pi-ecs-role
printf "\n\n"

printf "iam instance profiles...\n"
aws iam list-instance-profiles
printf "\n\n"



printf "\n\nec2 key pairs...\n"
aws ec2 describe-key-pairs
printf "\n\n"

printf "ec2 security groups...\n"
aws ec2 describe-security-groups --query 'SecurityGroups[].[Description,GroupName]'
printf "\n\n"

printf "ec2 instances...\n"
aws ec2 describe-instances
printf "\n\n"

printf "ec2 tags...\n"
aws ec2 describe-tags
printf "\n\n"



printf "\n\necs clusters...\n"
aws ecs list-clusters
printf "\n\n"

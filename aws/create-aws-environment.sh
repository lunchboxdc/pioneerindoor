#!/bin/bash


printf "\ncreating pi-ecs-role...\n"
aws iam create-role --role-name pi-ecs-role --assume-role-policy-document file://ecsPolicy.json
printf "\n\ncreating pi-ecs-role-policy...\n"
aws iam put-role-policy --role-name pi-ecs-role --policy-name pi-ecs-role-policy  --policy-document file://rolePolicy.json
printf "\n\ncreating pi-instance-profile...\n"
aws iam create-instance-profile --instance-profile-name pi-instance-profile
printf "\n\nadding pi-ecs-role to pi-instance-profile...\n"
aws iam add-role-to-instance-profile --instance-profile-name pi-instance-profile --role-name pi-ecs-role

printf "\n\ncreating pi-ecs key-pair...\n"
aws ec2 create-key-pair --key-name pi-ecs --query 'KeyMaterial' --output text > pi-ecs.pem
printf "\n\ncreating pi-ecs-security-group...\n"
aws ec2 create-security-group --group-name pi-ecs-security-group --description "pi-ecs-security-group"
printf "\n\nauthorizing pi-ecs-security-group to accept tcp connections on port 22 from any ip...\n\n"
aws ec2 authorize-security-group-ingress --group-name pi-ecs-security-group --protocol tcp --port 22 --cidr 0.0.0.0/0


printf "\n\ncreating ec2 instance under key: pi-ecs\n"
aws ec2 run-instances --image-id ami-0e65e665ff5f3fc5f --count 1 --instance-type t2.nano --key-name pi-ecs --iam-instance-profile Name=pi-instance-profile --security-groups pi-ecs-security-group --user-data file://userdata.txt
printf "\n\ncreating ec2 tag\n"
aws ec2 create-tags --resources $(aws ec2 describe-instances --filters "Name=key-name,Values=pi-ecs" --query 'Reservations[*].Instances[*].InstanceId' --output text) --tags Key=Name,Value=pi-ecs

printf "\n\ncreating pi-ecs-cluster\n"
aws ecs create-cluster --cluster-name pi-ecs-cluster





#   aws iam get-instance-profile --instance-profile-name pi-instance-profile --query 'InstanceProfile.Arn'

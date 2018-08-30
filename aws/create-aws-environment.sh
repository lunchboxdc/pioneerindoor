#!/bin/bash

AWS_DEFAULT_REGION=us-east-2
AWS_SECRETS_BUCKET_REGION=us-east-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')


printf "\n\ncreating db_pass kms key...\n"
DB_USER_KMS_KEY=`aws kms create-key --description 'DB_USER kms key' --query 'KeyMetadata.KeyId' --output text`

printf "\n\naliasing db_pass kms key as 'pi-db-pass-key'...\n"
aws kms create-alias --alias-name alias/pi-db-pass-key --target-key-id $DB_USER_KMS_KEY

printf "\n\ncreating pi.db-pass ssm parameter with kms.KeyId: '$DB_USER_KMS_KEY'...\n"
aws ssm put-parameter --name pi.db-pass --value "$PI_PROD_DB_PASS" --type SecureString --overwrite --key-id $DB_USER_KMS_KEY

printf "\n\ncreating pi.db-user ssm parameter...\n"
aws ssm put-parameter --name pi.db-user --value "pi" --type String --overwrite

printf "\n\ncreating pi.db-host ssm parameter...\n"
aws ssm put-parameter --name pi.db-host --value "pi-master.cs5wg1w14be0.us-east-2.rds.amazonaws.com" --type String --overwrite





printf "\ncreating pi-ecs-role...\n"
aws iam create-role --role-name pi-ecs-role --assume-role-policy-document file://ecsPolicy.json

printf "\n\nputting pi-ecs-role-policy on role pi-ecs-role...\n"
aws iam put-role-policy --role-name pi-ecs-role --policy-name pi-ecs-role-policy  --policy-document "$(cat pi-ecs-role-policy.json | AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID DB_USER_KMS_KEY=$DB_USER_KMS_KEY envsubst)"

printf "\n\ncreating pi-instance-profile...\n"
aws iam create-instance-profile --instance-profile-name pi-instance-profile

printf "\n\nadding pi-ecs-role to pi-instance-profile...\n"
aws iam add-role-to-instance-profile --instance-profile-name pi-instance-profile --role-name pi-ecs-role





rm -f pi-ecs.pem
printf "\n\ncreating pi-ecs key-pair...\n"
aws ec2 create-key-pair --key-name pi-ecs --query 'KeyMaterial' --output text > pi-ecs.pem
chmod 400 pi-ecs.pem

printf "\n\ncreating pi-ecs-security-group...\n"
aws ec2 create-security-group --group-name pi-ecs-security-group --description "pi-ecs-security-group"

printf "\n\nauthorizing pi-ecs-security-group to accept tcp connections on port 22 from any ip...\n\n"
aws ec2 authorize-security-group-ingress --group-name pi-ecs-security-group --protocol tcp --port 22 --cidr 0.0.0.0/0

# https://www.rainerhahnekamp.com/en/single-instance-ecs-setup/   (search for sleep 5)
sleep 5
printf "\n\ncreating ec2 instance under key: pi-ecs\n"
INSTANCE_ID=`aws ec2 run-instances --image-id ami-0e65e665ff5f3fc5f --count 1 --instance-type t2.nano --key-name pi-ecs --iam-instance-profile Name=pi-instance-profile --security-groups pi-ecs-security-group --user-data file://userdata.txt --query "Instances[0].InstanceId" --output text`

if [ ! -z $INSTANCE_ID ] ; then
    printf "\n\ncreating ec2 tag\n"
    aws ec2 create-tags --resources $INSTANCE_ID --tags Key=Name,Value=pi-ecs

    printf "\n\nwaiting for ok status\n"
    aws ec2 wait instance-status-ok --instance-ids $INSTANCE_ID

    printf "\n\ncreating pi-ecs-cluster\n"
    aws ecs create-cluster --cluster-name pi-ecs-cluster
fi



#   aws iam get-instance-profile --instance-profile-name pi-instance-profile --query 'InstanceProfile.Arn'

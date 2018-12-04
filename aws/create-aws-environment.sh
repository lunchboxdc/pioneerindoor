#!/bin/bash

AWS_DEFAULT_REGION=us-east-2
AWS_SECRETS_BUCKET_REGION=us-east-2
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')



# DB_USER_KMS_KEY=$(aws kms list-aliases --query 'Aliases[?AliasName==`alias/pi-db-pass-key`].TargetKeyId' --output text)


printf "\n\ncreating db_pass kms key...\n"
DB_USER_KMS_KEY=`aws kms create-key --description 'DB_USER kms key' --query 'KeyMetadata.KeyId' --output text`

printf "\n\naliasing db_pass kms key as 'pi-db-pass-key'...\n"
aws kms create-alias --alias-name alias/pi-db-pass-key --target-key-id $DB_USER_KMS_KEY

printf "\n\ncreating pi.db-pass ssm parameter with kms.KeyId: '$DB_USER_KMS_KEY'...\n"
aws ssm put-parameter --name /pi/db/pi.db-pass --value "$PI_PROD_DB_PASS" --type SecureString --overwrite --key-id $DB_USER_KMS_KEY

printf "\n\ncreating pi.db-user ssm parameter...\n"
aws ssm put-parameter --name /pi/db/pi.db-user --value "pi" --type String --overwrite

printf "\n\ncreating pi.db-host ssm parameter...\n"
aws ssm put-parameter --name /pi/db/pi.db-host --value "pi-master.cxcoebd0sshf.us-east-2.rds.amazonaws.com" --type String --overwrite





printf "\ncreating pi-ecs-role...\n"
aws iam create-role --role-name pi-ecs-role --assume-role-policy-document file://ecsPolicy.json

printf "\n\nputting pi-ecs-role-policy on role pi-ecs-role...\n"
aws iam put-role-policy --role-name pi-ecs-role --policy-name pi-ecs-role-policy --policy-document "$(cat pi-ecs-role-policy.json | AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID DB_USER_KMS_KEY=$DB_USER_KMS_KEY envsubst)"

printf "\n\ncreating pi-instance-profile...\n"
aws iam create-instance-profile --instance-profile-name pi-instance-profile

printf "\n\nadding pi-ecs-role to pi-instance-profile...\n"
aws iam add-role-to-instance-profile --instance-profile-name pi-instance-profile --role-name pi-ecs-role





printf "\n\ncreating pi-ecs-cluster\n"
aws ecs create-cluster --cluster-name pi-ecs-cluster



#   aws iam get-instance-profile --instance-profile-name pi-instance-profile --query 'InstanceProfile.Arn'

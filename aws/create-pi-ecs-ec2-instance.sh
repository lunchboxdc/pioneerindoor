#!/bin/bash -e


if [ -z "$(aws ec2 describe-key-pairs --query 'KeyPairs[?KeyName==`pi-ecs`].[KeyName]' --output text)" ] ; then
    printf "\ncreating pi-ecs key-pair...\n"
    rm -f pi-ecs.pem
    aws ec2 create-key-pair --key-name pi-ecs --query 'KeyMaterial' --output text > pi-ecs.pem
    chmod 400 pi-ecs.pem
else
    printf "\npi-ecs key-pair exists, skipping"
fi


if [ ! aws ec2 describe-security-groups --group-name pi-ecs-security-group 2&>1 /dev/null ] ; then
    printf "\ncreating pi-ecs-security-group...\n"
    aws ec2 create-security-group --group-name pi-ecs-security-group --description "pi-ecs-security-group"

    printf "\n\nauthorizing pi-ecs-security-group to accept tcp connections on port 22 from any ip...\n\n"
    aws ec2 authorize-security-group-ingress --group-name pi-ecs-security-group --protocol tcp --port 22 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-name pi-ecs-security-group --protocol tcp --port 80 --cidr 0.0.0.0/0

    # https://www.rainerhahnekamp.com/en/single-instance-ecs-setup/   (search for sleep 5)
    sleep 5
else
    printf "\npi-ecs-security-group exists, skipping\n"
fi


printf "\n\ncreating ec2 instance under key: pi-ecs\n"
INSTANCE_ID=`aws ec2 run-instances --image-id ami-0cba86f372788afd3 --count 1 --instance-type t2.micro --key-name pi-ecs --iam-instance-profile Name=pi-instance-profile --security-groups pi-ecs-security-group --user-data file://userdata.txt --query "Instances[0].InstanceId" --output text`

if [ ! -z $INSTANCE_ID ] ; then
    printf "\n\ncreating ec2 tag\n"
    aws ec2 create-tags --resources $INSTANCE_ID --tags Key=Name,Value=pi-ecs

    printf "\n\nwaiting for ok status\n"
    aws ec2 wait instance-status-ok --instance-ids $INSTANCE_ID
fi

printf "\ndone\n"

#!/bin/bash

logYellow() {
    local YELLOW='\033[0;33m'
    local NC='\033[0m'
    echo -e "${YELLOW}$@${NC}"
}

cd ../..

if [[ "$1" == "example" ]]; then
    dockerfile="pureNode.production"
    tg_location="/root/repo/devops/terragrunt/fargate-example"
    ecr_repo="react-test"
    region="<REGION>"
    aws_account_id="<AWS_ACCOUNT_ID>"
else
    logYellow "Please enter a valid environment to use"
    exit 1
fi

current_tag="$2"
if [[ "$2" == "" ]]; then
    current_tag="$(git rev-parse HEAD)"
    logYellow "No optional tag provided, using the git commit: $current_tag"
fi

logYellow "Building image"
docker build --platform linux/amd64 -f "app/dockerfiles/$dockerfile" -t $current_tag ./app

if [[ "$?" != "0" ]]; then
    logYellow "Error during docker build, aborting"
    exit 1
fi

logYellow "Deploying \"$ecr_repo:$current_tag\". Is that correct? y/n"
read;

if [[ "$REPLY" != "y" ]]; then
    logYellow "Aborting"
    exit 0
fi

logYellow "Pushing the image to ECR"
aws_image="$aws_account_id.dkr.ecr.$region.amazonaws.com/$ecr_repo:$current_tag"
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin "$aws_account_id.dkr.ecr.$region.amazonaws.com"
docker tag $current_tag $aws_image
docker push "$aws_image"

logYellow "Updating the terragrunt configs. REMEMBER TO COMMIT THIS"
docker-compose build devops
sed_tag="$aws_account_id.dkr.ecr.$region.amazonaws.com\\/$ecr_repo:$current_tag"
docker-compose run -w $tg_location devops bash -c "sed -i -E 's/^( +image_tag += +).+$/\1\"$sed_tag\"/g' terragrunt.hcl"

logYellow "Starting the deployment"
docker-compose run -w $tg_location devops bash -c "terragrunt init"
docker-compose run -w $tg_location devops bash -c "terragrunt apply"
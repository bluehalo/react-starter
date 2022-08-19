#!/bin/bash

cd ../../app

npm i
if [ $? -eq 0 ]; then
    echo "NPM install failed."
    echo "There might have already been an npm install down with a different version of node."
    echo "If so, delete the node modules folder"
fi
npm run build

if [ $? -eq 0 ]; then
    echo "NPM build failed."
fi

cd ../devops/terragrunt/s3-example

terragrunt init
terragrunt apply
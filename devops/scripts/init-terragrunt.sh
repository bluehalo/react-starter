#!/bin/bash

output() {
    local black='\033[0;30m'
    local red='\033[0;31m'
    local green='\033[0;32m'
    local yellow='\033[0;33m'
    local blue='\033[0;34m'
    local magenta='\033[0;35m'
    local cyan='\033[0;36m'
    local lightgrey='\033[0;37m'
    local white='\033[1;37m'
    local NC='\033[0m'
    local color="${!1}"
    local text=$2
    echo -e "${color}$text${NC}"
}

createNewCert() {
    #Required
    domain="internal.traffic.com"
    commonname=$domain

    #Change to your company details
    country="US"
    state="Canada"
    locality="Toronto"
    organization="test"
    email="this@is.fake"

    #Optional
    password="$(echo $RANDOM | md5sum | head -c 20)"
    echo "$password" > password.txt

    output green "Generating key request for $domain"

    #Create the request
    output green "Creating self signed cert"
    openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -passin "pass:'$password'" \
        -out cert.crt -keyout cert.key -passout pass:$password \
        -subj "/C=$country/ST=$state/L=$locality/O=$organization/CN=$commonname/emailAddress=$email"
}

if [ ! -d "/root/repo/devops" ]; then
    echo "This is only meant to run in the devops container"
    echo "Please run \"docker-compose run devops tg-init\""    
    exit 1
fi

if echo "$@" | grep -q -e "--help"; then
    output green "Hope this helped"
    exit 0
fi

output green "Starting initialization process for the devops folder"

output white "Are you initializing aws, gcp, or azure?"
read;
provider="$REPLY"

if [[ "$provider" != "aws" &&  "$provider" != "gcp" && "$provider" != "azure" ]]; then
    output red "Invalid environment selected, aborting"
    exit 1
elif [[ "$provider" != "aws" ]]; then
    output red "Environment not supported yet"
    exit 1
fi

if [ ! -d "/root/repo/devops/terragrunt/$provider" ]; then
    output green "No terragrunt folder found, making one"
    mkdir -p "/root/repo/devops/terragrunt/$provider"
fi

output green "Copying, but not overwriting, example hcl files"
cp -r -n /root/repo/devops/terragrunt-examples/$provider/* /root/repo/devops/terragrunt/$provider/

output green "Files successfully copied over. You may now undate their configs as necessary"

output white "Would you like to create/update the secrets file? (y/n):"
read;

if [[ "$REPLY" != "y" ]]; then
    output green "Exiting script"
    exit 0
fi

output white "Would you like to create a new cloud encryption key for the secrets? (y/n):"
read;

if [[ "$REPLY" != "y" ]]; then
    output white "Please enter the resource identifier for sops to encrypt with:"
    read;
    sopsKey="$REPLY"
else
    output red "Yo this doesn't work yet"
    exit 1
fi

sopsArg=""
if [[ "$provider" == "aws" ]]; then
    cd /root/repo/devops/terragrunt/$provider/fargate
    sopsArg="--kms $sopsKey"
elif [[ "$provider" == "gcp" ]]; then
    exit 1
else
    exit 1
fi
sops --encrypt $sopsArg /root/repo/devops/terragrunt-examples/secrets.yml > secrets.yml

output green "Creating a new self signed cert for deployed intranet traffic"
createNewCert

output green "Saving cert info into sops"
sops --set "[\"ssl\"][\"passphrase\"] \"$(cat password.txt)\"" ./secrets.yml
sops --set "$(echo '["ssl"]["cert"] "'$(cat cert.crt)'"')" secrets.yml
sops --set "$(echo '["ssl"]["key"] "'$(cat cert.key)'"')" secrets.yml
rm password.txt cert.*

output green "Secrets file sucessfully created and injected with cert information"
output green "You may now uncomment the secrets code from the config file if you desire"
output green "Done, exiting"
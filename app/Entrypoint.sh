#!/bin/bash

echo "$@"
echo ""

if [[ "$1" == "s3-build" ]]; then
    if [ -d "/srv/bin/public" ]; then
        rm -rf /srv/bin/public/*
    fi
    npm run build
else
    exec "$@"
fi
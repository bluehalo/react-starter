#!/bin/bash

echo "$@"
echo ""

# The application expects the certs to be pass in via its environment to prevent
# Files from lingering on the server. Modify this in any way that is needed
# to get the cert information to the server on production
if [ -f "/srv/server.cert" ]; then
    export SSL_CERT="$(cat /srv/server.cert)"
fi

if [ -f "/srv/server.key" ]; then
    export SSL_KEY="$(cat /srv/server.key)"
fi

if [[ "$1" == "s3-build" ]]; then
    if [ -d "/srv/bin/public" ]; then
        rm -rf /srv/bin/public/*
    fi
    npm run build
else
    exec "$@"
fi
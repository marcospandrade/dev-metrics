#!/bin/bash

source ./orchestrator/.env

# Default values
socks_proxy=""
creds=""
nkey=""
cert=""
key=""
ca=""
nsc=""
jetstream_domain=""
jetstream_api_prefix=""
jetstream_event_prefix=""
inbox_prefix=""
user_jwt=""
color_scheme=""
tls_first=false
description="Vendors local account"
url="nats://127.0.0.1:4222"
token=$NATS_TOKEN
user=$NATS_USER
password=$NATS_PASS

# Function to generate JSON object with parameters
function nats_cli_config() {
    echo '{
    "description": "'$description'",
    "url": "'$url'",
    "socks_proxy": "'$socks_proxy'",
    "token": "'$token'",
    "user": "'$user'",
    "password": "'$password'",
    "creds": "'$creds'",
    "nkey": "'$nkey'",
    "cert": "'$cert'",
    "key": "'$key'",
    "ca": "'$ca'",
    "nsc": "'$nsc'",
    "jetstream_domain": "'$jetstream_domain'",
    "jetstream_api_prefix": "'$jetstream_api_prefix'",
    "jetstream_event_prefix": "'$jetstream_event_prefix'",
    "inbox_prefix": "'$inbox_prefix'",
    "user_jwt": "'$user_jwt'",
    "color_scheme": "'$color_scheme'",
    "tls_first": '$tls_first'
    }' | jq .
}

# Write to file at $HOME/.config/orchestrator-cli.json
echo $(nats_cli_config) > $HOME/.config/nats/context/orchestrator-cli.json

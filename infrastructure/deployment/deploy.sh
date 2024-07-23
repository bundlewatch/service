#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../shell-helpers.sh"

if [[ -z $STAGE ]]; then
    STAGE=dev
fi

run "./node_modules/.bin/serverless create_domain"
run "./node_modules/.bin/serverless deploy --stage ${STAGE}"

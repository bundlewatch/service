#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/../shell-helpers.sh"

run "sudo npm install -g serverless"

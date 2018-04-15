#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source "$DIR/shell-helpers.sh"

run "sudo apt-get update"
run "sudo apt-get install python-setuptools python-dev build-essential"
run "sudo easy_install pip"
run "sudo pip install awscli"

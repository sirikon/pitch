#!/bin/bash

set -e

SCRIPT_START_FOLDER=$PWD
PITCH_BIN=$PWD/../bin/pitch.js

function test-folder {
    echo "Running tests for $1"

    cd $SCRIPT_START_FOLDER
    cd $1
    rm -rf dist
    node $PITCH_BIN build
    diff -r dist expected-dist
    if [ $? -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

test-folder simple
test-folder ejs-and-scss
test-folder ejs-and-data
test-folder custom-router
test-folder deep
test-folder full

echo "Testing Successful"
exit 0

#!/bin/bash

set -e

mkdir .build
cd .build
cp -r ../frontend/dist .
cp -r ../.env .
cp -r ../backend/target/release/backend .
cp ../Dockerfile .
docker build -t gcr.io/x-cycling-251008/nsc:$TAG .
cd ..
rm -fr .build

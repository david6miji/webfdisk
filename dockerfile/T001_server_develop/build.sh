#!/bin/bash

docker build -t build/t001_server_develop:0.1 ./
docker tag build/t001_server_develop:0.1 build/t001_server_develop:latest

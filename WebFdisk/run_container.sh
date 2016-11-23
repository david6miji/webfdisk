#!/bin/bash
docker run \
--rm -it \
--name webfdisk \
-p 7000:3000 \
-p 7001:7001 \
-p 3001:3001 \
--privileged \
-v $(pwd):/work \
-v /var/run/docker.sock:/var/run/docker.sock \
build/t001_server_develop:latest

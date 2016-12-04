#!/bin/bash
docker run \
--rm -it \
-p 9000:8080 \
-p 35729:35729 \
-v $(pwd):/work \
build/t001_server_develop:latest

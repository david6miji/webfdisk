FROM david6miji/gulp-kor:latest

MAINTAINER David You <frog@falinux.com>

RUN apt-get update

# docker 
WORKDIR /tmp/
RUN	wget -qO- https://get.docker.com/ | sh
RUN	npm install -g mocha

RUN	apt-get install -y libudev-dev

WORKDIR /work/

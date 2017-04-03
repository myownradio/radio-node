FROM node

RUN echo deb http://httpredir.debian.org/debian jessie-backports main > /etc/apt/sources.list.d/backports.list

RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

FROM node:9.4-stretch

WORKDIR /home/node/pioneer_indoor

COPY package*.json ./
COPY 

RUN npm i
RUN npm i pm2@3.0.0 -g

FROM node:10.9-alpine

WORKDIR /home/node/pioneer_indoor

# using .dockerignore
COPY . .

RUN npm i
RUN npm i pm2@3.0.0 -g

CMD [ "./entry.sh" ]

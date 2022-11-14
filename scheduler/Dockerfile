FROM node:16.14.0

WORKDIR /scheduler

COPY package*.json ./

RUN npm i

COPY . .

CMD ["node", "delete-stale-heartbeats.js"]

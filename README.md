[![CircleCI](https://dl.circleci.com/status-badge/img/gh/JonasGroenbek/heartbeats-service/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/JonasGroenbek/heartbeats-service/tree/main)

#### Idea

This personal project is an idea based off https://github.com/thoughtworks/HeartBeat. This is a health monitoring service, that is designed to run in a cloud context as a scalable process. 

#### How to run

All the below will assume docker, docker-compose user is part of the docker user group and have privileges

###### With docker-compose

`cp ./.env.example ./.env && cp ./scheduler/.env.example ./scheduler/.env && docker-compose up`

###### With docker

`cp ./.env.example ./.env && ./run-database.sh && npm i && npm run start:dev` optionally pass -v flag to the run-database script if you want to mount a volume

###### With postgres (13+) available

`cp ./.env.example ./.env && npm run migration:up && npm i && npm run start:dev`

#### How to run tests

Unfortunately the tests are not availalbe to run on the docker-compose database. To run the test suite docker is required and running `npm run test` should be sufficient. If the project has not been set up `cp ./.env.example ./.env && npm i && npm run test` would do.

#### How to test

###### Create heartbeat

`curl -X POST -H "Content-Type: application/json" \ -d '{ "meta": { "metaData": "something" } }' \ http://localhost:3100/radio-receiver/my-id`

###### Delete heartbeat

`curl -X DELETE -H "Content-Type: application/json" \ http://localhost:3100/radio-receiver/my-id`

###### Get heartbeats

`curl -X GET -H "Content-Type: application/json" \ http://localhost:3100/radio-receiver`

###### Get groups

`curl -X GET -H "Content-Type: application/json" \ http://localhost:3100`

#### Documentation

`http://localhost:{port}/docs`

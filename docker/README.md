# Docker File

## Description

This file was made so you can build fast the application in your own server.

## Usage

It requires to change the ip and port of the current host (localhost in case you want to run it locally) 

First you go to frontend/src/enviroments/enviroment.ts and change the ip for your current one

then in the docker-compose.ym in this folder you also need to change the oportune configuration.

This app is based on a docker-compose.yml file. you can start it by going through the console to this folder and executing the following command:

```bash
docker-compose up
```
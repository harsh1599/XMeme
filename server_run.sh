#!/bin/bash
cd backend


# Setup DB or any other environment variables you want to setup.


npm i
sudo kill 9 $(sudo lsof -t -i:8081)
sudo kill 9 $(sudo lsof -t -i:8080)

sudo systemctl start mongod service
node index

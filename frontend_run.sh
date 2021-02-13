#!/bin/bash
cd frontend


# Setup DB or any other environment variables you want to setup.


npm i
sudo kill 9 $(sudo lsof -t -i:3000)

npm start
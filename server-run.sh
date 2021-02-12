#!/bin/bash
cd backend


# Setup DB or any other environment variables you want to setup.


npm i
sudo systemctl start mongod service
node index

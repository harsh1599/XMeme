#!/bin/bash


#nodejs and npm latest installation
sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm
sudo npm install -g -y n
sudo n latest
sudo npm install -g -y npm
hash -d npm

#pm2 installation 
sudo npm install -g pm2

#mongodb installation

curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
sudo apt install -y mongodb-org






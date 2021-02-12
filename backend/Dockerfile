FROM node:latest
WORKDIR /backend
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 8081
EXPOSE 8080
EXPOSE 27017
RUN systemctl start mongod
CMD ["node","index.js"]


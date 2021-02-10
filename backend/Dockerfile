FROM node:latest
WORKDIR /backend
COPY ../package.json /backend
RUN npm install
COPY . .
CMD ["node","index.js"]


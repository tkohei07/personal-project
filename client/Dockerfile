FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apk update && \
    apk add --no-cache git bash && \
    npm install react-router-dom && \
    npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer && \
    npm install react-rating react-icons jest-fetch-mock @react-google-maps/api && \
    npm install @mui/material @mui/icons-material @mui/system @emotion/react @emotion/styled

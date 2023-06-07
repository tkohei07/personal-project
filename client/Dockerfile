FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN apk update && \
    apk add --no-cache git bash && \
    npm install react-router-dom && \
    npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
RUN npm install react-rating
RUN npm install react-icons

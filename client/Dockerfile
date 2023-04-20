FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN apk update && \
    apk add --no-cache git bash nodejs npm && \
    npm install react-router-dom && \
    npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
# for production
# COPY . .

# EXPOSE 80
EXPOSE 3000

CMD ["npm", "start"]
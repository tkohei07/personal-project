FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN apk update && \
    # apk add --no-cache git bash nodejs npm && \
    apk add --no-cache git bash nginx && \
    npm install react-router-dom && \
    npm install --save-dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer

# CMD ["npm", "start"]

# Build the app for production
COPY . .
RUN npm run build

# Use the official Nginx image to serve the built app
# FROM nginx:1.21

# Copy the built app to Nginx's public directory
# COPY --from=0 /usr/src/app/build /usr/share/nginx/html

# Expose the Nginx server port
EXPOSE 80
# EXPOSE 3000

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
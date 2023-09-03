FROM node:20 as builder

# Create app directory

WORKDIR /usr/source

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Bundle app source
COPY . .

# Stage 2 build for creating smaller image
FROM node:slim
WORKDIR /usr/source
 
COPY --from=builder /usr/source .
 
EXPOSE 4200
 
CMD [ "npm", "start" ]
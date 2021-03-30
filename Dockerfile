FROM node:12

# Update our image
RUN apt-get -y update && \
    apt-get clean

# Set our working directory
WORKDIR /srv

# Copy in our package.json and other root files
COPY package.json postcss.config.js /srv/

# Then install any dependencies, this will help with caching
RUN npm install

# Copy over the remaining source code
COPY src /srv/src

# Run our app
CMD ["npm", "start"]

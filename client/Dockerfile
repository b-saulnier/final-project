FROM node:alpine

RUN npm install -g pm2

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install

# Make sure you delete node_modules on your host, before building the image
# necessary building for svelte
COPY ./ ./
RUN npm run build

CMD ["npm", "run", "docker-start"]

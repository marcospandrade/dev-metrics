FROM node:18

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package*.json ./
# COPY ./.env ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build

USER node

CMD ["npm", "run", "start:prod"]

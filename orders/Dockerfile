FROM node:14-alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
# copy [ from ] [ destination ] 
COPY . .
RUN  rm -rf node_modules

RUN npm install --only=prod

CMD ["npm","start"]

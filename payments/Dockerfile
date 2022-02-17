FROM node:14-alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
# copy [ from ] [ destination ] 
COPY . .

CMD ["npm","start"]

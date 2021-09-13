FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
# copy [ from ] [ destination ] 
COPY . .

CMD ["npm","start"]

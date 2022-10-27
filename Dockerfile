FROM node:16

WORKDIR /chat-forms-nodejs

COPY package.json .

RUN npm install

COPY . .

CMD npm start
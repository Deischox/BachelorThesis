FROM node:16.14

WORKDIR /usr/src/app

COPY ./package.json ./

COPY ./videos ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD ["yarn","start"]
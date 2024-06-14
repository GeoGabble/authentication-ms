FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000
EXPOSE 8088

CMD ["npm", "run", "start:dev"]
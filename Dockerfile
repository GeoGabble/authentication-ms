FROM node:20

WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 3000
EXPOSE 8088

CMD ["npm", "run", "start:dev"]

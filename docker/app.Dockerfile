FROM node

COPY ./package.json .
COPY ./package-lock.json .

WORKDIR /dist

RUN npm install
COPY . .

EXPOSE 8080

CMD npm start
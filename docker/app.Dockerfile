FROM arm64v8/node:latest

COPY ./package.json .
COPY ./package-lock.json .
# WORKDIR /dist

RUN npm install --only=prod
COPY . .

EXPOSE 8080

CMD npm start
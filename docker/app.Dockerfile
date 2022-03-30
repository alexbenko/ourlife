FROM node:17-bullseye
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update
RUN apt-get upgrade -y

COPY ./package.json .
COPY ./package-lock.json .
# WORKDIR /dist

RUN npm install --only=prod
COPY . .

EXPOSE 8080

CMD npm start
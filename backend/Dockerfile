FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000
# required for docker desktop port mapping

CMD ["npm", "run", "prod"]
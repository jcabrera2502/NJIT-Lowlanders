FROM node:lts-alpine AS build 

WORKDIR /usr/app

COPY . .

RUN npm ci

RUN npm run build 

FROM nginx:latest

COPY --from=build /usr/app/build /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM node:20 as build-step

WORKDIR /app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install

RUN yarn build 

FROM nginx:stable-alpine

COPY --from=build-step /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
FROM node:18-alpine AS build
RUN corepack enable yarn

WORKDIR /app

COPY . .

RUN yarn install && \
    yarn build

FROM nginx:stable-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

FROM node:21-alpine

RUN apk upgrade -U \ 
    && apk add ca-certificates ffmpeg libva-intel-driver \
    && rm -rf /var/cache/*

WORKDIR /app
COPY assets/ assets/
COPY package*.json .
COPY tsconfig*.json .
COPY .eslintrc.js .
COPY nest*.json .
COPY ./src .
RUN npm install -g npm@10.4.0
RUN yarn
RUN npm run build
EXPOSE 3000
ENTRYPOINT [ "npm","run"]
CMD ["start:prod"]
FROM tarampampam/node:14-alpine

RUN npm install pm2 -g

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --silent --production

COPY ./build ./build

EXPOSE 3333

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

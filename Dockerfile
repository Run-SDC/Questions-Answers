FROM node:14.17.6

WORKDIR /app
COPY package.json /app

RUN npm install


COPY . /app/

ENV NODE_ENV=production

EXPOSE 2500

CMD ["node", "server/index.js"]
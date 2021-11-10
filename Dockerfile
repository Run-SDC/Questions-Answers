FROM node:14.17.6-stretch

EXPOSE 2500
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./

RUN npm ci
# RUN npm install --only=production && npm cache clean --force

COPY . .



RUN npm install pm2 -g

CMD ["pm2-runtime", "./server/index.js"]






# WORKDIR /app

# COPY package.json /app

# RUN npm install


# COPY . /app/

# ENV NODE_ENV=production

# EXPOSE 2500

# CMD ["node", "server/index.js"]
# Use a imagem Node.js como base
FROM node:18

WORKDIR /app

COPY package*.json ./

COPY .env-local ./.env

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
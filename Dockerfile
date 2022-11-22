FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV PORT 5000

EXPOSE 5000

CMD ["node","index.js"]
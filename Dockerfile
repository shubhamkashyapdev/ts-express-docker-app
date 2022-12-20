FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY vite.config.ts .

RUN yarn install

COPY . .

ENV PORT 5000

EXPOSE 5000

CMD ["npm","run", "dev"]
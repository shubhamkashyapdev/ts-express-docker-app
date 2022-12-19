FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY vite.config.ts .

RUN yarn install
RUN mkdir node_modules/.vite/deps_temp && chmod -R 777 node_modules/.vite/deps_temp

COPY . .

ENV PORT 5000

EXPOSE 5000

CMD ["npm","run", "dev"]
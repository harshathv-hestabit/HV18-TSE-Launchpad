FROM node:24-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm","run","dev","--","--host"]
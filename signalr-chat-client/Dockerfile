FROM node:12-alpine

RUN apk add yarn

WORKDIR /app

# copy csproj and restore as distinct layers
COPY . ./

RUN yarn install

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]
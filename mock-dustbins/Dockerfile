FROM node:16

WORKDIR /mock-dustbins

ADD . .

RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]

EXPOSE 4001

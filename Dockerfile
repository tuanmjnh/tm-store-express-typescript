FROM node:12.6-alpine

WORKDIR /app/
ADD ./dist .
ADD ./package.json .
ADD ./package-lock.json .
ADD ./.env .
RUN ls -alh

RUN npm i --production
CMD [ "npm", "start" ]
EXPOSE 8001
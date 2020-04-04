FROM node

RUN mkdir -p /usr/src/codenames \
    && chown node /usr/src/codenames
EXPOSE 2000

USER node
WORKDIR /usr/src/codenames

ADD * ./
ADD server/ ./server/
ADD public/ ./public/

RUN npm install

CMD npm start

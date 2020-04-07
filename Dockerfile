FROM node:13

EXPOSE 2000
ENV REQUIRE_HTTPS=false

USER node
RUN mkdir -p /home/node/codenames
WORKDIR /home/node/codenames

ADD * ./
ADD server/ ./server/
ADD public/ ./public/

RUN npm install

CMD npm start

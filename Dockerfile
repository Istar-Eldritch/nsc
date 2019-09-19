FROM node:12-alpine

WORKDIR /opt

COPY dist ./dist

CMD ["node", "dist/server/server.js"]

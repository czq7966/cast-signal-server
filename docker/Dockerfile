FROM node:10.14.1
RUN mkdir app \
    &&  cd /app \
    &&  npm install adhoc-cast-signaler-server-ota \
    &&  cd /app/node_modules/adhoc-cast-signaler-server-ota \
    &&  npm install -g forever  \
    &&  npm install
WORKDIR /app/node_modules/adhoc-cast-signaler-server-ota
EXPOSE 8080
CMD ["forever", "dist/server/index.js"]
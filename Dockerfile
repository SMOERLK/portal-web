FROM node:12.18.4-alpine
WORKDIR '/app'

COPY package.json .
RUN npm install
RUN npm rebuild node-sass
COPY . .
CMD ["npm", "start"]
EXPOSE 3000
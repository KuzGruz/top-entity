FROM node:alpine
WORKDIR /opt/app
ADD package*.json ./
RUN npm ci
ADD . .
RUN npm run build
RUN npm prune --production
CMD ["node", "dist/main.js"]

FROM node:20.19.0-alpine

WORKDIR /app

ENV npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false \
    npm_config_loglevel=warn

# Do not use npm ci here. Railway/npm sometimes hangs or throws
# "Exit handler never called" during clean install. This app is small,
# so one tolerant npm install is safer for Railway.
COPY package.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]

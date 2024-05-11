FROM node:18.16.0-alpine AS development
WORKDIR /usr/src/app
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install
COPY --chown=node:node . .
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN yarn run build

# BUILD
FROM node:18.16.0-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=development
COPY --chown=node:node package*.json yarn.lock ./
COPY --chown=node:node .env.development ./.env
RUN yarn install --production
# COPY node_modules from previous stage to build
COPY --chown=node:node . .
COPY --chown=node:node --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/app.js" ]


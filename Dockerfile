# syntax = docker/dockerfile:1-experimental

FROM node:lts-alpine

ENV APP_PATH /app
ENV NODE_ENV production

ARG DEPLOY_SITE=local

# Set working directory
WORKDIR $APP_PATH

# Copy all files from current directory to working dir in image
COPY . $APP_PATH/

# Start react build compilation routine
RUN yarn install --network-timeout=500000
RUN yarn add -g react-scripts env-cmd prettier eslint-plugin-prettier eslint-config-prettier serve
RUN yarn build:${DEPLOY_SITE}
RUN yarn cache clean --all

# Expose to the world
EXPOSE 5000
CMD [ "yarn", "serve" ]

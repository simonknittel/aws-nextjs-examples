# Reference: https://nextjs.org/docs/deployment#docker-image


#
# builder
#

FROM docker.io/library/node:16.13.0-alpine3.14 AS builder

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

# Build app
WORKDIR /app
COPY next.js .
RUN apk add --no-cache libc6-compat && \
    npm ci && \
    NEXT_TELEMETRY_DISABLED=1 npm run build

# Prepare app for runner step
WORKDIR /output
RUN cp /app/next.config.js ./ && \
    cp /app/package.json ./ && \
    cp -a /app/.next/standalone/. ./ && \
    cp -a /app/.next/static .next && \
    rm -f .env


#
# dependencies
#

FROM docker.io/library/node:16.13.0-alpine3.14 AS dependencies

# Download  extract oauth2-proxy
ARG OAUTH2_PROXY_VERSION=7.2.1
ADD https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v$OAUTH2_PROXY_VERSION/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz
RUN tar -xf /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz -C /tmp


#
# runner
#

FROM docker.io/library/node:16.13.0-alpine3.14 AS runner

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Move oauth2-proxy from dependencies step to runner and install config
ARG OAUTH2_PROXY_VERSION=7.2.1
COPY --from=dependencies /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64/oauth2-proxy /usr/local/bin
COPY oauth2-proxy.cfg /etc/oauth2-proxy.cfg

# Environmental variables for oauth2-proxy
ENV OAUTH2_PROXY_CLIENT_ID=
ENV OAUTH2_PROXY_CLIENT_SECRET=
ENV OAUTH2_PROXY_COOKIE_SECRET=

# Move built Next.js from builder step to runner
COPY --chown=node:node --from=builder /output /app

# Environmental variables for Next.js
ENV AWS_ACCESS_KEY_ID=
ENV AWS_SECRET_ACCESS_KEY=
ENV CSRF_SECRET=

USER node

EXPOSE 8080/tcp

# We must use a separated shell script in order to support environmental
# variables and optional command line parameters (see
# https://stackoverflow.com/a/49156417/3942401)
ENTRYPOINT ["./entrypoint.sh"]

FROM public.ecr.aws/bitnami/node:16.13.0-prod-debian-10-r23

# Download, extract and install oauth2-proxy
ARG OAUTH2_PROXY_VERSION=7.2.0
ADD https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v$OAUTH2_PROXY_VERSION/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz
RUN tar -xf /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64.tar.gz -C /tmp && \
    cp /tmp/oauth2-proxy-v$OAUTH2_PROXY_VERSION.linux-amd64/oauth2-proxy /usr/local/bin

COPY oauth2-proxy.cfg /etc/oauth2-proxy.cfg

ENV CLIENT_ID=
ENV CLIENT_SECRET=
ENV COOKIE_SECRET=

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8080/tcp

# We must use a separated shell script in order to support environmental
# variables and optional command line parameters (see
# https://stackoverflow.com/a/49156417/3942401)
ENTRYPOINT ["./entrypoint.sh"]

#!/bin/bash

/usr/local/bin/oauth2-proxy \
  --config /etc/oauth2-proxy.cfg \
  --client-id $CLIENT_ID \
  --client-secret $CLIENT_SECRET \
  --cookie-secret $COOKIE_SECRET \
  $@

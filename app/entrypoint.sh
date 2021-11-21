#!/bin/sh

set -e

# Start Next.js
cd /app
node_modules/.bin/next start &
pid1=$!

# Start oauth2-proxy
/usr/local/bin/oauth2-proxy \
  --config /etc/oauth2-proxy.cfg \
  --client-id $OAUTH2_CLIENT_ID \
  --client-secret $OAUTH2_CLIENT_SECRET \
  --cookie-secret $COOKIE_SECRET \
  $@ &
pid2=$!

# Wait for any process to exit
for p in $pid1 $pid2; do
  wait $p
  exit $?
done

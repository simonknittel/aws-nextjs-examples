#!/bin/sh

set -e

# Start Next.js
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production
cd /app && node_modules/.bin/next start &
pid1=$!

# Start oauth2-proxy
/usr/local/bin/oauth2-proxy --config /etc/oauth2-proxy.cfg $@ &
pid2=$!

# Wait for any process to exit
for p in $pid1 $pid2; do
  wait $p
  exit $?
done

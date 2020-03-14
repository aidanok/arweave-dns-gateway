#!/bin/sh
rsync -r -v -z -e ssh --exclude .git --exclude node_modules --exclude greenlock.d ./ root@blah.blockbin.xyz:~/arweave-dns-gateway

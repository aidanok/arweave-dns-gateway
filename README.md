
# Arweave DNS Gateway

Quick PoC that allow people to register domain names with a TXT record and, have them automatically
receive a cert with lets encrypt, and reverse proxies them to an Arweave gateway.

Usage:

deploy somewhere, probably on the same machine as gateway.

follow express-greenlock instructions to setup a config, edit some of the source for hardcoded things like blockbin.xyz 

Read code, make better, use a proper db, use nginx perhaps.

`npm run start`

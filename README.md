
# Arweave DNS Gateway

Quick PoC that allow people to register domain names with a TXT record and, have them automatically
receive a cert with lets encrypt, and reverse proxies them to an Arweave gateway.

## Dev Usage / Info

deploy somewhere, probably on the same machine as gateway.

follow express-greenlock instructions to setup a config, edit some of the source for hardcoded things like blockbin.xyz 

Read code, make better, use a proper db, use nginx perhaps.

`npm run start`

# User usage

### Register a domain that will be served

```bash
curl -X POST -H "Content-Type: text/plain" --data "mycooldomain.com" https://api.blockbin.xyz/v0/add_domain
```

### Setup DNS Records

CNAME for `mycooldomain.com` pointing to `gw.blockbin.xyz`
TXT for `arweavetx.mycooldomain.com` set the the TX ID

### Go!

Navigate to `https://mycooldomain.com`, the first navigation may take some time as 
as an SSL cert is generated. The TX you set will be served under the 
secure origin of `https://mycooldomain.com`

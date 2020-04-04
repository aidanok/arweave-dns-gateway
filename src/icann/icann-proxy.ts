import express from 'express'
import httpProxy from "http-proxy";
import { dnsLookupTx } from './icann-lookup';

const icannProxy = express.Router();

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

icannProxy.all('*', async (req, res, next) => {
  
  try {
    
    console.log(`Trying to route ${req.hostname}..`);
    
    const result = await dnsLookupTx(req.hostname); 
    
    if (typeof result === 'number') {
      res.sendStatus(result)
      return;
    }

    if (typeof result === 'string') {
      res.status(400).send(result);
      return
    }

    // Proxy! 
    proxy.web(req, res, { target: result.location, followRedirects: true });

  } catch (e) {
    console.error(e);
    res.status(500).send(`Unexpected error routing request`);
  }

})

export { icannProxy } 

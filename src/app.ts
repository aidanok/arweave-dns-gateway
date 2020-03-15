import express from "express";
import httpProxy from "http-proxy";

// @ts-ignore
import evh from "express-vhost";

import { apiApp } from './api';
import { dnsLookupTx } from "./main";

const app = express();
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

// use evh middleware and 'trust proxy' to pass X-Forwarded-For header.
app.use(evh.vhost(app.enabled("trust proxy")));

evh.register(
  "api.blockbin.xyz",
  apiApp,
);

app.all('*', async (req, res, next) => {
  
  try {
    
    if (req.hostname.toLowerCase().endsWith('blockbin.xyz')) {
      apiApp(req, res, next);
      return;
    }

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

export { app };

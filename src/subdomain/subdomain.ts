import express from "express";
import multicodec from 'multicodec';
import multibase from "multibase";
import { getRedirectedUrl } from "../upstream/upstream";
import httpProxy from "http-proxy";

const subdomainApi = express.Router();

const subdomainProxy = express.Router();

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

proxy.on('proxyRes', (res) => {
  console.log(`proxyRes: ${res.url}, ${res.statusCode}`)
})

subdomainApi.get('/tx/:tx', async (req, res) => {
  try {
    console.log(`API req: ${req.url}`);
    if (typeof req.params.tx !== 'string') {
      return res.status(400).send('Bad Request'); 
    }

    const bytes = Buffer.from(req.params.tx, 'base64');
    if (bytes.length !== 32) {
      return res.status(400).send('Bad Request');
    }

    //const prefix = multicodec.addPrefix(multicodec.SHA2_256, bytes);
    const base32 = multibase.encode("base32", bytes);

    const redirectTo = `https://${base32}.${req.hostname.replace('api.', '')}`;
    res.redirect(redirectTo);    
    return;

  } catch (e) {
    res.status(500).send('Unexpected error\n');
  }
})


subdomainProxy.all('*', async (req, res) => {

  console.log(`Proxy req: ${req.url}, ${req.method}`);

  try { 
  
    const prefix = req.hostname.split('.')[0];
    const bytes = multibase.decode(prefix);
    console.log(`Convered prefix to ${bytes.length} bytes`);
    if (bytes.length !== 32) {
      return res.status(400).send('Bad Request');
    }

    const txId = bytes.toString('base64')
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/\=/g, "");
    
    console.log(`TX: ${txId}`);

    const location = await getRedirectedUrl(txId);

    if (typeof location === 'number') {
      return res.sendStatus(location);
    }
    console.log(`Proxying to: ${location}`);
    //res.send(location);
    proxy.web(req, res, { target: location, followRedirects: true, changeOrigin: true, autoRewrite: true }, (err) => {
      console.error(err);
      throw(err);
    })

  } catch (e) {
    res.status(500).send('Unexpected error');
  }
})


export { subdomainApi, subdomainProxy }
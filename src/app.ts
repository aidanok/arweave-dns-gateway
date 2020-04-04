import express from "express";
import nocache from "nocache";
// @ts-ignore
import evh from "express-vhost";

import { icannApi } from './icann/icann-api';
import { icannProxy } from "./icann/icann-proxy";
import { subdomainApi, subdomainProxy } from "./subdomain/subdomain";

const app = express();

// use evh middleware and 'trust proxy' to pass X-Forwarded-For header.
app.use(evh.vhost(app.enabled("trust proxy")));

// no cache everywhere
app.use(nocache());

// weaved.page subdomain API and Proxy.
evh.register('api.weaved.page', subdomainApi);
evh.register('*.weaved.page', subdomainProxy);

// ICANN DNS API and Proxy
evh.register("api.blockbin.xyz", icannApi);
app.all('*', icannProxy);

export { app };



// @ts-ignore
import greenlock from "greenlock-express";

import { app } from './app';

greenlock
.init({
    packageRoot: __dirname + "/..",
    configDir: __dirname + "../greenlock.d",
    maintainerEmail: "admin@blockbin.xyz",
    cluster: false
})
// Serves on 80 and 443
// Get's SSL certificates magically!
.serve(app);
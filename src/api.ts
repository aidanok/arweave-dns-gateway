import express from 'express';
import { spawn } from 'child_process';
import bodyParser from 'body-parser';


const validDomainName = /^(((?!-))(xn--|_{1,1})?[a-z0-9-]{0,61}[a-z0-9]{1,1}\.)*(xn--)?([a-z0-9][a-z0-9\-]{0,60}|[a-z0-9-]{1,30}\.[a-z]{2,})$/

const app = express(); 

app.use(bodyParser.text());

function addDomainName(domain: string) {
  return new Promise((res, rej) => {
    const cmd = spawn(`npx`, [`greenlock`, `add`, `--subject`, domain, `--altnames`, domain])
    cmd.on('close', (code) => {
      if (code == 0) {
        res();
      } else {
        rej(`Command failed with code: ${code}`);
      }
    })
  })
}

app.post('/v0/add_domain', async (req, res) => {
  try {
    let domain = req.body;
    if (typeof domain !== 'string') {
      res.status(400).send('Bad Request');
      return;
    }
    domain = domain.toLowerCase();
    if (!validDomainName.test(domain)) {
      res.status(400).send(`Not a valid domain name\n`);
      return; 
    }
    await addDomainName(domain);
    res.status(200).send('Domain added. Navigating to the domain the first time can take some time while an SSL cert is issued.\n');
  }

  catch (e) {
    console.error(e);
    res.status(500).send('Interal Server Error');
  }
})


app.get('/v0/convert_tx', async (req, res) => {

})

export { app as apiApp }
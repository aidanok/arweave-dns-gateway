import { resolveTxt } from "dns"; 
import { promisify } from "util";
import { createProxyMiddleware } from "http-proxy-middleware";
import LRU from "lru-cache";
import ax from 'axios';

const resolveTxtRecords = promisify(resolveTxt);

const GATEWAY_URL = `https://arweave.net`;

export interface ResolvedTx {
  tx: string
  location: string
}

const cache = new LRU<string, ResolvedTx>({
  max: 200,
  dispose: (key: string, target: ResolvedTx) => {
    console.log(`Removing ${key} from cache`);
  }
})

/**
 * Returns the redirected location or a http error code.
 * @param tx 
 */
async function getRedirectedUrl(tx: string) {
  const resp = await ax.get(`${GATEWAY_URL}/${tx}`, { maxRedirects: 0, validateStatus: () => true })
  if (resp.status !== 301) {
    return resp.status;
  }
  return resp.headers.location as string;
}

/**
 * Returns either the resolved info, or, a string error, or a http error code 
 * received from the upstream gateway. 
 * @param hostname 
 */
export async function dnsLookupTx(hostname: string): Promise<ResolvedTx | string | number> {
  let resolved = cache.get(hostname);
  if (!resolved) {
    console.log(`${hostname} not in cache, looking up DNS record`);
    
    const records = await resolveTxtRecords(`arweavetx.${hostname}`);
    
    const tx = records[0][0];
    
    if (typeof tx !== 'string' || tx.length !== 43) {
      console.error(`${hostname} has invalid TXT record: ${tx}`);
      return 'invalid_dns';
    }

    const location = await getRedirectedUrl(tx);
    if (typeof location === 'number') {
      console.error(`Upstream returned http error code: ${location}`)
      return location;
    }

    resolved = {
      tx, 
      location
    }

    cache.set(hostname, resolved);
    console.log(`Added to cache: ${tx} - ${location}`);
  }

  return resolved;
}



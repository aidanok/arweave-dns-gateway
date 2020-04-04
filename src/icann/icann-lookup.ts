import { resolveTxt } from "dns"; 
import { promisify } from "util";
import LRU from "lru-cache";
import { getRedirectedUrl } from "../upstream/upstream";

const resolveTxtRecords = promisify(resolveTxt);

const CACHE_TTL_MINUTES = 20;

export interface ResolvedTx {
  tx: string
  location: string
}

const cache = new LRU<string, ResolvedTx>({
  max: 200,
  maxAge: 1000 * 60 * CACHE_TTL_MINUTES,
  dispose: (key: string, target: ResolvedTx) => {
    console.log(`Removing ${key} from cache`);
  }
})

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




import ax from 'axios';

const GATEWAY_URL = `https://arweave.net`;

/**
 * Returns the redirected location or a http error code.
 * @param tx
 */
export async function getRedirectedUrl(tx: string) {
  const resp = await ax.get(`${GATEWAY_URL}/${tx}`, { maxRedirects: 0, validateStatus: () => true })
  if (resp.status !== 301) {
    return resp.status;
  }
  return resp.headers.location as string;
}

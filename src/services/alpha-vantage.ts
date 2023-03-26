import alpha from 'alphavantage';
import logger from '../middleware/logger';
import { type AlphaPriceResp } from 'src/types/alpha-vantage';
import config from '../config/config';
import type { Fiat } from '../types/types';

class AlphaVantageClass {
  fiatUnit: Fiat;
  client = alpha({ key: config.alphaVantage.KEY ?? '' });

  constructor(fiatUnit: Fiat = 'USD') {
    this.fiatUnit = fiatUnit;
  }

  async getCryptoRate(ticker: string) {
    const response = await this.client.crypto.daily(ticker, this.fiatUnit);
    return response;
  }

  async getForexRate(ticker: string) {
    const response = await this.client.forex.rate(ticker, this.fiatUnit);
    return response as AlphaPriceResp;
  }

  private serialize(json: Record<string, unknown>) {
    let obj = {};

    logger.info(json);

    for (const [k, v] of Object.entries(json)) {
      const newTitle = k
        .replace('1.', '')
        .replace('2.', '')
        .replace('3.', '')
        .replace('4.', '')
        .replace('5.', '')
        .replace('6.', '')
        .replace('7.', '')
        .replace('8.', '')
        .replace('9.', '')
        .trim()
        .replace(' ', '_');

      obj[newTitle] = v;
    }

    return obj;
  }
}

const AlphaVantage = new AlphaVantageClass();
export default AlphaVantage;

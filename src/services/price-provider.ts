import AlphaVantage, { AlphaVantageClass } from './alpha-vantage';

interface PricingOption<T> {
  name: string;
  preferred: 0 | 1 | 2 | 3;
  crypto?: boolean;
  service: T;
  health?: 'healthy' | 'high_use' | 'dead';
}

class PriceProvider {
  pricingServices = <PricingOption<AlphaVantageClass>[]>[
    {
      name: 'AlphaVantage',
      preferred: 3,
      crypto: true,
      service: AlphaVantage
    }
  ];

  service?: PricingOption<unknown>;

  constructor() {
    this.pricingServices.forEach((serv) => {
      serv.health = 'healthy';
    });
    this.service = this.pricingServices[0];
  }

  search(ticker: string) {}

  getCryptoPrice() {
    this.service?.service.
  }

  getForexPrice() {}
}

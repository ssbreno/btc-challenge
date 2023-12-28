import axios from 'axios';
import { from, lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export class BTCMarketUseCase {
  async execute(): Promise<any> {
    const baseUrl = `${process.env.INTEGRATION_BTC}`;
    try {
      const response$ = from(axios.get(baseUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      })).pipe(
        map(response => response.data),
        catchError(error => { throw new Error(error); })
      );

      return await lastValueFrom(response$);
    } catch (error) {
      throw error;
    }
  }
}

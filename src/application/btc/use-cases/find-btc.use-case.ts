import axios from 'axios'
import { catchError, from, map } from 'rxjs'

export class BTCMarketUseCase {
  fetchBitcoinTicker() {
    return from(axios.get(`${process.env.INTEGRATION_BTC}`)).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new Error(`Error fetching Bitcoin data: ${error.message}`)
      }),
    )
  }
}

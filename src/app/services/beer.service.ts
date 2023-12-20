import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {
  catchError,
  concatMap,
  EMPTY,
  expand,
  map,
  Observable,
  of,
  retry,
  tap,
  throwError,
  timeout,
  toArray,
} from 'rxjs';
import {Beer} from '../models/beer';

const SRM_COLORS: { [key: number]: string } = {
  1: '#FFE699',
  2: '#FFD878',
  3: '#FFCA5A',
  4: '#FFBF42',
  5: '#FBB123',
  6: '#F8A600',
  7: '#F39C00',
  8: '#EA8F00',
  9: '#E58500',
  10: '#DE7C00',
  11: '#D77200',
  12: '#CF6900',
  13: '#CB6200',
  14: '#C35900',
  15: '#BB5100',
  16: '#B54C00',
  17: '#B04500',
  18: '#A63E00',
  19: '#A13700',
  20: '#9B3200',
  21: '#952D00',
  22: '#8E2900',
  23: '#882300',
  24: '#821E00',
  25: '#7B1A00',
  26: '#771900',
  27: '#701400',
  28: '#6A0E00',
  29: '#660D00',
  30: '#5E0B00',
  31: '#5A0A02',
  32: '#600903',
  33: '#520907',
  34: '#4C0505',
  35: '#470606',
  36: '#440607',
  37: '#3F0708',
  38: '#3B0607',
  39: '#3A070B',
  40: '#36080A',
};

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  // base url
  private readonly beersUrl = 'https://api.punkapi.com/v2/beers';

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get color code from SRM value
   * @param srm
   */
  getSrmColor(srm: number): string {
    const roundedSrm = Math.round(srm);
    if (roundedSrm > 40) {
      return '#000000';
    } else {
      return SRM_COLORS[roundedSrm];
    }
  }

  /**
   * GET a random beer from API
   * @returns a random beer
   */
  fetchRandomBeer(): Observable<Beer> {
    const randomBeerUrl = `${this.beersUrl}/random`;
    return this.httpClient.get<Beer[]>(randomBeerUrl).pipe(
      timeout(5000),
      retry(2),
      // need to convert array to single object.
      map((beers) => {
        if (beers.length === 0) {
          throw new Error('random beer array length is 0.');
        }
        return beers[0];
      }),
      tap((beer) => console.log(`random beer fetched: ${beer.name}`)),
      catchError(this.handleError),
    );
  }

  /**
   * GET all beers from API
   * get multiple times until the end.
   * @returns all beers
   */
  fetchAllBeers(): Observable<Beer[]> {
    let page = 1;
    return this.fetchBeerPageByConditions(undefined, page).pipe(
      expand((pageData) =>
        pageData.length > 0 ? this.fetchBeerPageByConditions(undefined, ++page) : EMPTY,
      ),
      tap((pageData) =>
        console.log(`got page data. page: ${page}, length: ${pageData.length}`),
      ),
      concatMap((pageData) => of(...pageData)),
      toArray(), // all pageData flattened to an array
    );
  }

  /**
   * GET beers by specified IDs
   * @param ids
   */
  fetchBeersByIds(ids: number[]): Observable<Beer[]> {
    const params = new HttpParams().set('ids', ids.join('|'));
    console.debug(`search beers with: ${JSON.stringify(params)}`);
    return this.httpClient.get<Beer[]>(this.beersUrl, {params: params});
  }

  /**
   * GET beers with specified conditions
   * @param searchCondition
   * @param page
   * @param perPage
   */
  fetchBeerPageByConditions(searchCondition?: SearchCondition, page: number = 1, perPage: number = 30): Observable<Beer[]> {
    let params = new HttpParams();
    if (searchCondition) {
      searchCondition.name ? params = params.append('beer_name', searchCondition.name) : null;
      searchCondition.abvLower ? params = params.append('abv_gt', searchCondition.abvLower - 1) : null;
      searchCondition.abvUpper ? params = params.append('abv_lt', searchCondition.abvUpper + 1) : null;
      searchCondition.ibuLower ? params = params.append('ibu_gt', searchCondition.ibuLower - 1) : null;
      searchCondition.ibuUpper ? params = params.append('ibu_lt', searchCondition.ibuUpper + 1) : null;
      searchCondition.ebcLower ? params = params.append('ebc_gt', searchCondition.ebcLower - 1) : null;
      searchCondition.ebcUpper ? params = params.append('ebc_lt', searchCondition.ebcUpper + 1) : null;
      searchCondition.brewedAfter ? params = params.append('brewed_after', this.formatDate(searchCondition.brewedAfter)) : null;
      searchCondition.brewedBefore ? params = params.append('brewed_before', this.formatDate(searchCondition.brewedBefore)) : null;
    }
    params = params.append('page', page);
    params = params.append('per_page', perPage);
    console.debug(`search beers with condition: ${JSON.stringify(searchCondition)}`);
    console.debug(`search beers with params: ${JSON.stringify(params)}`);
    console.debug(`page: ${page}`);
    return this.httpClient.get<Beer[]>(this.beersUrl, {params: params});
  }

  /**
   * Format date string to suitable format to API
   * @param dateString
   * @private
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
  }

  /**
   * Handle error both from client and backend.
   * @param error
   * @returns an error Observable
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('A client-side or network error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('An error occurred. Please try again later.'),
    );
  }
}

/**
 * SearchCondition
 */
export interface SearchCondition {
  name?: string;
  abvLower?: number;
  abvUpper?: number;
  ibuLower?: number;
  ibuUpper?: number;
  ebcLower?: number;
  ebcUpper?: number;
  brewedAfter?: string;
  brewedBefore?: string;
}

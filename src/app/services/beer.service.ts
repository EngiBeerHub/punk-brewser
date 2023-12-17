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

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  // base url
  private readonly beersUrl = 'https://api.punkapi.com/v2/beers';

  constructor(private httpClient: HttpClient) {
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

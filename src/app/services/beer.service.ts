import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
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
     * GET beers from API
     */
    getBeers(): Observable<Beer[]> {
        return this.httpClient.get<Beer[]>(this.beersUrl);
    }

    /**
     * GET a random beer from API
     * @returns a random beer
     */
    getRandomBeer(): Observable<Beer> {
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
    getAllBeers(): Observable<Beer[]> {
        let page = 1;
        return this.getPage(page).pipe(
            expand((pageData) =>
                pageData.length > 0 ? this.getPage(++page) : EMPTY,
            ),
            tap((pageData) =>
                console.log(`got page data. page: ${page}, length: ${pageData.length}`),
            ),
            concatMap((pageData) => of(...pageData)),
            toArray(), // all pageData flattened to an array
        );
    }

    /**
     * GET a paginated data from API
     * @param page page index starts from 1
     * @param perPage beers per page
     * @returns beer list
     */
    getPage(page: number, perPage = 30): Observable<Beer[]> {
        const url = `${this.beersUrl}?page=${page}&per_page=${perPage}`;
        return this.httpClient.get<Beer[]>(url);
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

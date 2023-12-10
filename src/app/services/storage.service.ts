import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly KEY_FAV_IDS = 'FavoritesIds';
  favIds: number[] = [];

  constructor(private storage: Storage) {
    void this.init();
  }

  /**
   * Init storage and retrieve stored data
   */
  async init() {
    // initialize storage
    const storage = await this.storage.create();
    await storage.defineDriver(CordovaSQLiteDriver);
    this._storage = storage;
    // get stored data
    const storedIds = await this._storage.get(this.KEY_FAV_IDS);
    this.favIds = JSON.parse(storedIds) ?? [];
  }

  /**
   * Add beer to favorites
   * @param beerId
   */
  add(beerId: number) {
    this.favIds.push(beerId);
    this._storage?.set(this.KEY_FAV_IDS, JSON.stringify(this.favIds));
  }

  /**
   * Remove beer from favorites
   * @param beerId
   */
  remove(beerId: number) {
    const removeIndex = this.favIds.indexOf(beerId);
    const isFound = removeIndex != -1;
    if (isFound) {
      this.favIds.splice(removeIndex, 1);
      this._storage?.set(this.KEY_FAV_IDS, JSON.stringify(this.favIds));
    }
  }

  set(key: string, value: any) {
    return this._storage?.set(key, value);
  }

  get(key: string) {
    return this._storage?.get(key);
  }

  // remove(key: string) {
  //   return this._storage?.remove(key);
  // }

  clear() {
    this._storage?.clear();
  }

  get keys() {
    return this._storage?.keys();
  }

  get length() {
    return this._storage?.length();
  }
}

import { startWith, tap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Stores every emitted value in localStorage,
 * starts with the stored value if one exists,
 * and shares the replay of all of this
 *
 * @param cacheKey Key used in localStorage
 */
export const shareAndCache = (cacheKey: string) => <T>(source: Observable<T>) => {
    // Check if we have a valid cached value
    let cachedValue: T | null = null;
    try {
        cachedValue = JSON.parse(localStorage[cacheKey]);
    } catch (parseException) {}

    // Cache future values
    let result = source.pipe(tap(next => (localStorage[cacheKey] = JSON.stringify(next))));


    if (cachedValue) {
        result = result.pipe(startWith(<T>cachedValue));
    }
    // shareReplay is a stylistic / personal choice? good idea or bad idea? who knows!?
    return result.pipe(shareReplay(1));
};

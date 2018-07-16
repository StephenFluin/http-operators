import { exhaustMap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

/**
 * Repeats underlying observable on a timer
 *
 * @param interval Number of miliseconds to wait for refresh
 */
export const keepFresh = (interval: number) => <T>(source: Observable<T>) => {
    const trigger = timer(0, interval);
    return trigger.pipe(
        exhaustMap(() => source)
    );
};

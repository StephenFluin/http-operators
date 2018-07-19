import {
    Observable,
    timer,
    Subscriber,
    TeardownLogic,
    Operator,
    SchedulerLike,
    asyncScheduler,
    Subscription,
} from 'rxjs';
import { retryWhen, switchMap, mergeMap, tap } from 'rxjs/operators';

/**
 * Repeats underlying observable on a timer
 *
 * @param maxTries The maximum number of attempts to make, or -1 for unlimited
 * @param initialWait Number of seconds to wait for refresh
 */
export const retryExponentialBackoff = (
        maxTries = -1,
        initialWait = 1,
        scheduler: SchedulerLike = asyncScheduler
    ) => <T> (
    source: Observable<T>
) => {
    return new Observable<T>(subscriber => {
        let count = 1;
        const subscription = new Subscription();

        const subscribe = () =>
            subscription.add(
                source.subscribe({
                    next(value: T) {
                        count = 1;
                        subscriber.next(value);
                    },
                    error(err: any) {
                        if (count <= maxTries) {
                            subscription.add(scheduler.schedule(subscribe, initialWait * Math.pow(2, count++)));
                        }
                    },
                    complete() {
                        subscriber.complete();
                    },
                })
            );

        subscribe();

        return subscription;
    });
};

// class REBOperator<T> implements Operator<T, T> {
//     constructor(private source: Observable<T>, private maxTries: number, private initialWait: number) {}
//     call(subscriber: Subscriber<T>, source: any): TeardownLogic {
//         return source.subscribe(new REBSubscriber(subscriber, this.maxTries, this.initialWait, this.source));
//     }
// }

// class REBSubscriber<T> extends Subscriber<T> {
//     count = 1;
//     constructor(
//         destination: Subscriber<any>,
//         private maxTries: number,
//         private initialWait: number,
//         private source: Observable<T>
//     ) {
//         super(destination);
//         console.log('REB subscriber created.');
//     }
//     error(err: any) {
//         if (!this.isStopped) {
//             if (this.count >= this.maxTries && this.maxTries !== -1) {
//                 console.log('Should be all done. no more tries left.');
//                 return super.error(err);
//             }
//             const timeout = this.initialWait * Math.pow(this.count, 2);
//             console.log(`Waiting ${timeout} more miliseconds, count is ${this.count} of ${this.maxTries} max tries`);
//             this.count = this.count + 1;
//             setTimeout(() => this.source.subscribe(this._unsubscribeAndRecycle()), timeout);
//         }
//     }
// }



export const retryWhenExponentialbackoff = (maxTries = -1, initialWait = 1, ) => <T>(source: Observable<T>) => {

    return source.pipe(
        (innerSource: Observable<T>) => {
            let count = 1;
            return innerSource.pipe(
                retryWhen((errors) => {
                    return errors.pipe(
                        switchMap(error => {
                            return timer(initialWait * Math.pow(count++, 2));
                            }
                        ),
                    );
                }),
                tap(() => count = 1),
            );
        }

    );
};

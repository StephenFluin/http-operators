# HTTP Operators
I'm starting work on a collection of useful RxJS operators. These operators are intended to be useful in the context of an Angular App where you have asynchronous data coming through RxJS, such as a standard Angular HttpClient GET or POST.

# How to use
1. Import the operator you want to use
1. Use it
1. Profit

# Example
```
import { cacheAndShare, keepFresh, retryExponentialBackoff } from 'http-operators';

...

constructor(http: HttpClient) {
    this.data$ = http.get<MyDataType>(pathToAPI).pipe(
            // Retry at most 5 times, starting with a 1 second wait
            retryExponentialBackoff(5, 1000),

            // Keep Fresh every 5 minutes
            keepFresh(1000 * 60 * 5),

            // Cache in localStorage['repos']
            shareAndCache('repos'),
    );
}
```

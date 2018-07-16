import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { shareAndCache } from '../operators/sharedCached';
import { keepFresh } from '../operators/keepFresh.operator';
import { retryExponentialBackoff } from '../operators/retryExponentialBackoff.operator';

export interface GitHubSearch {
    items: { name: string; description: string }[];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'app';
    repos;
    constructor(http: HttpClient) {
        const path = 'https://zapi.github.com/search/repositories?q=angular';
        this.repos = http.get<GitHubSearch>(path).pipe(
            map(results => results.items),

            retryExponentialBackoff(5, 1000),

            // Keep Fresh
            // keepFresh(10000),

            // Cache
            shareAndCache('repos'),
        );
    }
}

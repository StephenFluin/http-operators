import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { keepFresh, shareAndCache, retryExponentialBackoff } from '../../operators/';

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

            // Retry at most 5 times, starting with a 1 second wait
            retryExponentialBackoff(5, 1000),

            // Keep Fresh every 5 minutes
            keepFresh(1000 * 60 * 5),

            // Cache
            shareAndCache('repos'),
        );
    }
}

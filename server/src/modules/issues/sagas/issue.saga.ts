import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { SchemaValidator } from '@core/utils';
import { CalculateIssueEstimatesCommand } from '../commands/calculate-issue-estimates/calculate-issue-estimates.command';
import { StartCalculateIssueEstimativesEvent } from '../events/start-calculate-issue-estimatives';
import { SyncIssuesCommand } from '../commands/sync-issues/sync-issues.command';
import { StartSyncIssuesEvent } from '../events/start-sync-issues.event';

export class IssueSaga {
    @Saga()
    startSyncingIssues($: Observable<any>) {
        return $.pipe(
            ofType(StartSyncIssuesEvent),
            map(ev => SchemaValidator.toInstance(ev, SyncIssuesCommand)),
        );
    }

    @Saga()
    startCalculateIssueEstimatives($: Observable<any>) {
        return $.pipe(
            ofType(StartCalculateIssueEstimativesEvent),
            map(ev => SchemaValidator.toInstance(ev, CalculateIssueEstimatesCommand)),
        );
    }
}

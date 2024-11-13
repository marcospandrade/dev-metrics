import { Saga, ofType } from '@nestjs/cqrs';

import { Observable, map } from 'rxjs';

import { SchemaValidator } from '@core/utils';
import { StartCalculateIssueEstimatesEvent } from '../events/start-calculate-issue-estimates.event';
import { SyncIssuesCommand } from '../commands/sync-issues/sync-issues.command';
import { StartSyncIssuesEvent } from '../events/start-sync-issues.event';
import { HandleIssueCalculationCommand } from '../commands/handle-issue-calculation/handle-issue-calculation.command';

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
            ofType(StartCalculateIssueEstimatesEvent),
            map(ev => SchemaValidator.toInstance(ev, HandleIssueCalculationCommand)),
        );
    }

    // @Saga()
    // generateSpecificEstimate($: Observable<any>) {
    //     return $.pipe(
    //         ofType(GenerateSpecificEstimateEvent),
    //         map(ev => SchemaValidator.toInstance(ev, CalculateIssueEstimatesCommand)),
    //     );
    // }
}

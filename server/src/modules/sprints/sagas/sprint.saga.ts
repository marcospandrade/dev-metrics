import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { StartGeneratingEstimatesEvent } from '../events/start-generating-estimates.event';
import { SchemaValidator } from '@core/utils';
import { GenerateSprintEstimatesCommand } from '../commands/generate-sprint-estimates/generate-sprint-estimates.command';

export class SprintSaga {
    @Saga()
    startGeneratingSprintEstimatives($: Observable<any>) {
        return $.pipe(
            ofType(StartGeneratingEstimatesEvent),
            map(ev => SchemaValidator.toInstance(ev, GenerateSprintEstimatesCommand)),
        );
    }
}

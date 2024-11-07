import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { StartGeneratingEstimativesEvent } from '../events/start-generating-estimatives.event';
import { SchemaValidator } from '@core/utils';
import { GenerateSprintEstimativesCommand } from '../commands/generate-sprint-estimatives/generate-sprint-estimatives.command';

export class SprintSaga {
    @Saga()
    startGeneratingSprintEstimatives($: Observable<any>) {
        return $.pipe(
            ofType(StartGeneratingEstimativesEvent),
            map(ev => SchemaValidator.toInstance(ev, GenerateSprintEstimativesCommand)),
        );
    }
}

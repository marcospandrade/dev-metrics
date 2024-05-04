import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CqrsErrorHandlerService } from './cqrs-error-handler.service';

@Module({
    imports: [CqrsModule],
    providers: [CqrsErrorHandlerService],
    exports: [CqrsErrorHandlerService],
})
export class CqrsErrorHandlerModule {}

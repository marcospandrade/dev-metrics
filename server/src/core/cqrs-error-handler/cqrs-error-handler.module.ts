import { Module } from '@nestjs/common';

import { CqrsErrorHandlerService } from './cqrs-error-handler.service';

@Module({
    providers: [CqrsErrorHandlerService],
    exports: [CqrsErrorHandlerService],
})
export class CqrsErrorHandlerModule { }

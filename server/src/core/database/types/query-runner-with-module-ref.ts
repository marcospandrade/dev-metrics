import { ModuleRef } from '@nestjs/core';
import { QueryRunner } from 'typeorm';

export interface QueryRunnerWithModuleRef extends QueryRunner {
    moduleRef: ModuleRef;
}

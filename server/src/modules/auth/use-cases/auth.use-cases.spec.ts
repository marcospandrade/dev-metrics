import { TestBed } from '@automock/jest';
import { AuthFactoryService } from './auth-factory.service';

describe('AuthService', () => {
    let service: AuthFactoryService;

    beforeEach(async () => {
        service = TestBed.create(AuthFactoryService).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

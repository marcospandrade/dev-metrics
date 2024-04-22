import { TestBed } from '@automock/jest';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        controller = TestBed.create(AuthController).compile().unit;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

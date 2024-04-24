import { TestBed } from '@automock/jest';

import { TeamUseCases } from './team.use-cases';
import { Team } from '../entities/team.entity';

describe('TeamUseCasesService', () => {
    let service: TeamUseCases;

    // let teamRepositoryMock: MockType<Repository<Team>>;

    beforeEach(() => {
        service = TestBed.create(TeamUseCases).mock(Team).using({}).compile().unit;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getTeamsByUser', () => {
        it('should return all teams by specific user id', () => {
            // service.getTeamsByUser();
        });
    });
});

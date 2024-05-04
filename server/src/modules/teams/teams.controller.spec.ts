import { TeamController } from './teams.controller';
import { TestBed } from '@automock/jest';
import { TeamUseCases } from './use-cases/teams.use-cases';
import { User } from '@modules/auth/entities/user.entity';

describe('TeamController', () => {
    let controller: TeamController;

    const getTeamsByUserMock = jest.fn();

    beforeEach(() => {
        controller = TestBed.create(TeamController)
            .mock(TeamUseCases)
            .using({
                getTeamsByUser: getTeamsByUserMock,
            })
            .compile().unit;
    });

    describe('GET => /', () => {
        it('should call getTeamsByUser function for route', async () => {
            const userId = { id: '1' } as User;
            getTeamsByUserMock.mockReturnValue([
                {
                    id: 'test',
                },
            ]);

            const result = await controller.getTeams(userId);
            expect(result).toEqual([
                {
                    id: 'test',
                },
            ]);
        });
    });

    describe('POST => /', () => {
        it('should call createTeams', async () => {
            const userId = { id: '1' } as User;
            getTeamsByUserMock.mockReturnValue([
                {
                    id: 'test',
                },
            ]);

            const result = await controller.getTeams(userId);
            expect(result).toEqual([
                {
                    id: 'test',
                },
            ]);
        });
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

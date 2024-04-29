import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/auth/entities/user.entity';
import { CreateTeamDto } from '../dto/createTeam.dto';
import { LoggerService } from '@core/logger/logger.service';
import { AddTeamParticipantCommand } from '../commands/addTeamParticipants/add-team-participant.command';
import { Participant } from '../entities/participant.entity';
import { UpdateTeamCommand } from '../commands/updateTeam/update-team-command';

@Injectable()
export class TeamUseCases {
    public constructor(
        @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
        @InjectRepository(Participant) private readonly participantRepository: Repository<Participant>,
        private readonly logger: LoggerService,
    ) {}

    public async getTeamsByUser(user: User): Promise<Team[]> {
        const teams = await this.teamRepository.find({
            where: {
                createdById: user.id,
            },
        });

        if (!teams) {
            this.logger.error(`User: ${user.id} has no teams`);
        }

        return teams;
    }

    public async createTeam(payload: CreateTeamDto, userId: string) {
        const { identifiers } = await this.teamRepository.insert({ ...payload, createdById: userId });

        return this.findTeamById(identifiers[0].id);
    }

    public async findTeamById(id: string): Promise<Team> {
        const team = await this.teamRepository.findOne({
            where: {
                id,
            },

            relations: {
                participants: true,
            },
        });

        if (!team) {
            throw new NotFoundException('Team not found');
        }

        return team;
    }

    public async addParticipantToSpecificTeam(payload: AddTeamParticipantCommand) {
        const { participants, teamId } = payload;
        const insertParticipants = participants.map(participant => {
            participant.teamId = teamId;
            return this.participantRepository.create(participant);
        });

        this.logger.info(insertParticipants, 'Participants to be inserted: ');

        return this.participantRepository.save(insertParticipants);
    }

    public async updateTeamById(payload: UpdateTeamCommand): Promise<Team> {
        const { teamId, ...rest } = payload;
        await this.teamRepository.update({ id: teamId }, rest);
        this.logger.info(`Team: ${teamId} updated!`);

        return this.findTeamById(teamId);
    }

    public async deleteTeamById(teamId: string) {
        await this.teamRepository.softDelete({ id: teamId });
    }
}

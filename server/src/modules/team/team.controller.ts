import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { TeamUseCases } from './use-cases/team.use-cases';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { User } from '@modules/auth/entities/user.entity';
import { JwtAuthGuard } from '@modules/auth/strategies/jwt-bearer/jwt-auth.guard';
import { CreateTeamDto } from './dto/createTeam.dto';
import { CommandBus } from '@nestjs/cqrs';
import { SchemaValidator } from '@core/utils';
import { CreateTeamCommand } from './commands/createTeam/create-team.command';
import { Team } from './entities/team.entity';
import { UpdateTeamDto } from './dto/updateTeam.dto';
import { UpdateTeamCommand } from './commands/updateTeam/update-team-command';
import { CreateParticipantDto } from './dto/createParticipant.dto';
import { AddTeamParticipantCommand } from './commands/addTeamParticipants/add-team-participant.command';
import { Participant } from './entities/participant.entity';

@Controller('team')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class TeamController {
    public constructor(
        private readonly commandBus: CommandBus,
        private readonly teamService: TeamUseCases,
    ) {}

    @Get()
    public getTeams(@CurrentUser() user: User) {
        return this.teamService.getTeamsByUser(user);
    }

    @Get('/:id')
    public getTeamById(@Param('id') teamId: string) {
        return this.teamService.findTeamById(teamId);
    }

    @Post()
    public createTeam(@Body() payload: CreateTeamDto, @CurrentUser() user: User) {
        const commandPayload = {
            ...payload,
            userId: user.id,
        };
        return this.commandBus.execute<CreateTeamCommand, Team>(
            SchemaValidator.toInstance(commandPayload, CreateTeamCommand),
        );
    }

    @Post('/add-participant/:teamId')
    public addParticipant(@Param('teamId') teamId: string, @Body() payload: CreateParticipantDto) {
        return this.commandBus.execute<AddTeamParticipantCommand, Participant>(
            SchemaValidator.toInstance({ teamId, participants: [payload] }, AddTeamParticipantCommand),
        );
    }

    @Put('/:teamId')
    public updateTeamById(@Body() payload: Omit<UpdateTeamDto, 'teamId'>, @Param('teamId') teamId: string) {
        return this.commandBus.execute<UpdateTeamCommand, Team>(
            SchemaValidator.toInstance({ ...payload, teamId }, UpdateTeamCommand),
        );
    }

    @Delete('/:teamId')
    public deleteTeamById(@Param('teamId') teamId: string) {
        return this.teamService.deleteTeamById(teamId);
    }
}

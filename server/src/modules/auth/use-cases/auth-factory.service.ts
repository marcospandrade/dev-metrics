import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { EventBus } from '@nestjs/cqrs';

import { Repository } from 'typeorm';

import { UserAtlassianInfo } from '@lib/atlassian/interfaces/user-info.model';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { IAccessibleResources } from '@lib/atlassian/interfaces/accessible-resources.model';
import { NotifyProjectLoginEvent } from '@modules/integration-project/events/notify-project-login.event';
import { LoggerService } from '@core/logger/logger.service';
import { SchemaValidator } from '@core/utils';

@Injectable()
export class AuthFactoryService {
    public constructor(
        private readonly logger: LoggerService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
        private eventBus: EventBus,
    ) {}

    public async checkUserExists(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
            select: {
                email: true,
                id: true,
                name: true,
            },
        });

        return user;
    }

    public async createUser(payload: CreateUserDto): Promise<User> {
        const user = await this.userRepository.save(payload);

        if (!user) {
            throw new BadRequestException('User not created');
        }

        return user;
    }

    public generateJwtToken(
        state: string,
        userInfo: UserAtlassianInfo,
        urlAuthenticated: string,
        cloudId: string,
    ): string {
        this.logger.info('Generating jwt tokens...');

        const payload = {
            state: state,
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
            jobTitle: userInfo.extended_profile.job_title,
            urlAuthenticated,
            cloudId,
        };

        return this.jwtService.sign(payload, { secret: this.configService.get('JWT_KEY') });
    }

    public notifyProjectNewLogin(projectData: IAccessibleResources): void {
        this.logger.info({ projectUrl: projectData.url }, 'Publish event NotifyProjectLoginEvent: ');
        this.eventBus.publish<NotifyProjectLoginEvent>(
            SchemaValidator.toInstance({ projectId: projectData.id }, NotifyProjectLoginEvent),
        );
    }
}

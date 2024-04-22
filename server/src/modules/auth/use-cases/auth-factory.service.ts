import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserAtlassianInfo } from '@lib/atlassian/interfaces/user-info.model';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
@Injectable()
export class AuthFactoryService {
    private readonly logger = new Logger(AuthFactoryService.name);
    public constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    public async checkUserExists(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        return user;
    }

    public async createUser(payload: CreateUserDto): Promise<User> {
        const user = await this.userRepository.insert(payload);

        if (!user) {
            throw new BadRequestException('User not created');
        }

        return;
    }

    public async generateJwtToken(
        state: string,
        userInfo: UserAtlassianInfo,
        urlAuthenticated: string,
        cloudId: string,
    ): Promise<string> {
        this.logger.log('Generating jwt tokens...');
        // NOTE: Check later if it's necessary to add more information to the token, like (atlassian access token and refresh_token)
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
}

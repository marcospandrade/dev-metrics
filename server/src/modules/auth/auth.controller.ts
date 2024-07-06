import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { RequestUser } from '@shared/helpers/generic.helpers';
import { CurrentUser } from '@core/decorators/current-user.decorator';

import { UserAtlassianInfo } from '@lib/atlassian/types/user-info.type';
import { JwtAuthGuard } from './strategies/jwt-bearer/jwt-auth.guard';
import { ResponseMessage } from '@core/decorators/response-message';
import { AuthFactoryService } from './use-cases/auth-factory.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authUseCase: AuthUseCase,
        private readonly authFactoryService: AuthFactoryService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ResponseMessage('login successfully')
    public async login(@Body() body: LoginDto) {
        const { user, accessibleResources } = await this.authUseCase.login(body);
        (() => this.authFactoryService.notifyIntegrationServerNewLogin({ ...accessibleResources, userId: user.id }))()

        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: RequestUser) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('/refresh-token')
    refreshToken(@CurrentUser() user: UserAtlassianInfo) {
        return this.authUseCase.refreshToken(user.email);
    }
}

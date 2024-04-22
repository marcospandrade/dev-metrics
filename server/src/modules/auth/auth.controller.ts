import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, HttpStatus } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthUseCase } from './use-cases/auth.use-cases';
import { RequestUser } from '@shared/helpers/generic.helpers';
import { CurrentUser } from '@core/decorators/current-user.decorator';

import { UserAtlassianInfo } from '@lib/atlassian/interfaces/user-info.model';
import { JwtAuthGuard } from './strategies/jwt-bearer/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authUseCase: AuthUseCase) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    public login(@Body() body: LoginDto) {
        return this.authUseCase.login(body);
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

import { IsString } from 'class-validator';

export class CheckHasOnlyOneProjectEvent {
    @IsString()
    cloudId: string;

    @IsString()
    userEmail: string;
}

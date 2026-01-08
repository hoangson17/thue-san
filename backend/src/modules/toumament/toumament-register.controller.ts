import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ToumamentService } from './toumament.service';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('tournaments-register')
export class ToumamentRegisterController {
    constructor(private readonly toumamentService: ToumamentService) {}

    @Post(':id')
    @UseGuards(AuthGuard)
    toumamentRegister(@Param('id') toumamentId: number, @Req() request: any) {
        return this.toumamentService.toumamentRegister(toumamentId, request.user.id);
    }
}

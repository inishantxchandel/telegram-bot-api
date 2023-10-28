import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';
import { CronService } from 'src/services/ cron.service';
@Module({
  imports: [HttpModule],

  providers: [TelegramService, CronService],
})
export class TelegramModule {}

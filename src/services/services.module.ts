import { Module } from '@nestjs/common';
import { CronService } from './ cron.service';
import { HttpModule } from '@nestjs/axios';
@Module({})
export class ServicesModule {
  imports: [HttpModule];
  providers: [CronService];
}

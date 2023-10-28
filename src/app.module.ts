import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './google.strategy';
import { AdminModule } from './admin/admin.module';
import { ServicesModule } from './services/services.module';
@Module({
  imports: [HttpModule, TelegramModule, AdminModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}

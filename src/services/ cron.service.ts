/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { TelegramService } from '../telegram/telegram.service'; // Import your Telegram service
const User = require('../../models/user');
import { HttpService } from '@nestjs/axios'; // Import HttpService
import { map } from 'rxjs/operators'; // Import the map operator
@Injectable()
export class CronService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly httpService: HttpService, // Inject HttpService
  ) {
    this.scheduleHelloMessages();
  }

  private async scheduleHelloMessages() {
    // Schedule a task to send "Hello" messages to users every 5 minutes
    cron.schedule('0 8 * * *', async () => {
      try {
        const users = await User.findAll(); // Fetch all users from the database

        // Send "Hello" message to each user
        users.forEach((user) => {
          const userCity = user.subscribedCity;
          const userId = user.chatId;
          try {
            this.httpService
              .get(
                `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=cba4c26dafd172128fea15a0c77b24ba`,
              )
              .pipe(map((response) => response.data))
              .subscribe((weatherInfo) => {
                const weatherDescription = weatherInfo.weather[0].description;
                const temperature = weatherInfo.main.temp;
                const humidity = weatherInfo.main.humidity;
                const windSpeed = weatherInfo.wind.speed;

                const weatherMessage = `Weather in ${userCity}:
                  Description: ${weatherDescription}
                  Temperature: ${(temperature - 273.15).toFixed(2)}°C
                  Humidity: ${humidity}%
                  Wind Speed: ${windSpeed} m/s`;
                this.telegramService.sendMessage(userId, weatherMessage);
              });
          } catch (error) {
            console.log(error);
            this.telegramService.sendMessage(
              userId,
              'Failed to fetch weather data. Please try again later.',
            );
          }
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    });
  }
}

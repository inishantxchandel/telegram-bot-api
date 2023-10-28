/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'; // Import HttpService
const TelegramBot = require('node-telegram-bot-api');
const token = '6828236841:AAFRXfhIL2WqKDksCGsYiufHptbqlczFjAo'; // Replace with your Telegram bot token
import { map } from 'rxjs/operators'; // Import the map operator
const User = require('../../models/user');
@Injectable()
export class TelegramService {
  private readonly bot: any;
  private logger = new Logger(TelegramService.name);

  constructor(private readonly httpService: HttpService) {
    this.bot = new TelegramBot(token, { polling: true });
    this.bot.on('message', this.onReceiveMessage);
    this.setupCommands();
  }

  onReceiveMessage = (msg: any) => {
    this.logger.debug(msg);
  };

  sendMessage = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };

  private setupCommands() {
    this.bot.onText(/\/subscribe (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const city = match[1]; // Extract the city name from the regex match
      try {
        // Create a new user record and save it to the database
        await User.create({ chatId, subscribedCity: city });
        this.bot.sendMessage(
          chatId,
          `You have subscribed to daily weather updates for ${city}.`,
        );
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          // Unique constraint error means the user is already subscribed
          this.bot.sendMessage(
            chatId,
            'You are already subscribed to weather updates.',
          );
        } else {
          this.bot.sendMessage(
            chatId,
            'Failed to save your subscription. Please try again later.',
          );
        }
      }
      try {
        this.httpService
          .get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=cba4c26dafd172128fea15a0c77b24ba`,
          )
          .pipe(map((response) => response.data))
          .subscribe((weatherInfo) => {
            const weatherDescription = weatherInfo.weather[0].description;
            const temperature = weatherInfo.main.temp;
            const humidity = weatherInfo.main.humidity;
            const windSpeed = weatherInfo.wind.speed;

            const weatherMessage = `Weather in ${city}:
              Description: ${weatherDescription}
              Temperature: ${(temperature - 273.15).toFixed(2)}°C
              Humidity: ${humidity}%
              Wind Speed: ${windSpeed} m/s`;
            this.bot.sendMessage(chatId, weatherMessage);
          });
      } catch (error) {
        console.log(error);
        this.bot.sendMessage(
          chatId,
          'Failed to fetch weather data. Please try again later.',
        );
      }
    });
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const startMessage = `Welcome to the Weather Bot!\n\nTo subscribe to weather updates, use the /subscribe command followed by the city name. For example, /subscribe London.`;
      this.bot.sendMessage(chatId, startMessage);
    });
  }
}

<p align="center">
  <a href="https://github.com/ahmethkablama/ktun-weather-bot/blob/main/README.tr.md">Turkish</a> |
  <a href="https://github.com/ahmethkablama/ktun-weather-bot/blob/main/README.md">English</a>
</p>

# Konya Technical University Weather Boat

Weather based on Konya Technical University with data from The Weather Channel; You can learn instantly, daily and hourly, and you can send warning notifications to people or groups in case of weather events that develop above normal.

KTUN WEATHER BOT       | 
-----------------------| 
[![@ktunhavadurumu_bot](https://img.shields.io/badge/%F0%9F%92%AC%20Telegram-%40ktunhavadurumu__bot-red)](https://telegram.me/ktunhavadurumu_bot)|


## Bot Commands
Command                 | Explanation
----------------------- | ----------------------------------------    
`/start`                | Starts the bot
`/anlik`                | Instant weather
`/bugun`                | Today's weather
`/yarin`                | Tomorrow's weather
`/ongunluk`             | 10 days weather
`/saatlik`              | 24 hour weather
`/konumhava`            | Your location's weather
`/komutlar`             | Bot commands
`/iletisim`             | Developer communication


## Preparation
1. Create bot and get API TOKEN via official Telegram bot [@BotFather](https://telegram.me/BotFather)
2. If you are going to run the bot on yourself:
   * Send your own message to the bot [@userinfobot](https://telegram.me/userinfobot) and get your ID
   * Go to the bot you created and launch it
3. If you run the Bot on a group:
   * Send a message with the group name to the bot [@userinfobot](https://telegram.me/userinfobot) and get the ID
   * Add the bot to your group and give it admin


## Local Operation

1. Clone or download and unzip the repo `https://github.com/ahmethkablama/ktun-recent-earthquakes-bot`
* You can use the following command for cloning
```bash
git clone https://github.com/ahmethkablama/ktun-recent-earthquakes-bot
```
2. install `npm` from terminal
```bash
npm install
```
3. Create `.env` file based on `.env-example` file
4. Fill in the `YOUR_API_TOKEN` and `YOUR_ID` sections in the `.env` file according to you
5. install `npm` from terminal
6. Run it with the command `npm run start` or `node bot.js`

## Running on Server (Cpanel)

1. Download the repo `https://github.com/ahmethkablama/ktun-recent-earthquakes-bot`
2. Create an empty folder with your bot's name in your server's home directory
3. Upload bot files to the folder you created
4. Create `.env` file based on `.env-example` file
5. Fill in the `YOUR_API_TOKEN` and `YOUR_ID` sections in the `.env` file according to your own
6. From your server panel (described as Cpanel) go to the `Setup Node.js App` tab
7. Go to the step of creating a new application by clicking the `CREATE APPLICATION` button
8. Select the appropriate Node.js version and mode. Type your bot's path and startup file (designated as `bot.js`)
9. Install NPM with `Run NPM Install` command and run your bot with `Run JS script` command


## Libraries Used

* [Nodejs](https://nodejs.org/en/)
* [Telegraf Package](https://www.npmjs.com/package/telegraf)
* [Axios Package](https://www.npmjs.com/package/axios)
* [Cheerio Package](https://www.npmjs.com/package/cheerio)
* [Cron Package](https://www.npmjs.com/package/cron)

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
`/hakkinda`             | Project GitHub link and developer communication


<p align="center">
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/831dcb62-57e1-4cb3-b3a6-a9ec8a39f344" width="350" hspace="10" >
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/36b66eba-4799-4fa1-9f10-6a3b35c18b9d" width="350" hspace="10" >
</p>

<p align="center">
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/81575f57-cd8c-4158-be76-ee8e3395d3c1" width="350" hspace="10" >
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/c20ea647-9cf3-43cd-98b4-f3d248095f2c" width="350" hspace="10" >
</p>

## Preparation
1. Create bot and get API TOKEN via official Telegram bot [@BotFather](https://telegram.me/BotFather)
2. Send your own message with the group name to the bot [@userinfobot](https://telegram.me/userinfobot) and copy the IDs
3. Go to the bot you created, click the "Start" button and add your bot to your group and give it admin


## Local Operation

> Note: This step was done with "Visual Studio Code".

1. Clone or download and unzip the repo `https://github.com/ahmethkablama/ktun-weather-bot`
* You can use the following command for cloning
  ```bash
  git clone https://github.com/ahmethkablama/ktun-weather-bot
  ```
2. install `npm` from terminal
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env-example` file
4.Replace `YOUR_API`, `YOUR_ID` and `GROUP_ID` in the `.env` file with [@BotFather](https://telegram.me/BotFather) and [@userinfobot](https://telegram.me/userinfobot) Fill according to API and IDs found in bots
5. install `npm` from terminal
6. Run it with the command `npm run start` or `node bot.js`

## Running on Server (Cpanel)

> Note: This step requires a dedicated IP address or a domain-named server (hosting).

1. Download the repo `https://github.com/ahmethkablama/ktun-weather-bot`
2. Create an empty folder with your bot's name in your server's home directory
3. Upload bot files to the folder you created
4. Create `.env` file based on `.env-example` file
5. Replace `YOUR_API`, `YOUR_ID` and `GROUP_ID` in the `.env` file with [@BotFather](https://telegram.me/BotFather) and [@userinfobot](https://telegram.me/userinfobot) Fill according to API and IDs found in bots
6. From your server panel (described as Cpanel) go to the `Setup Node.js App` tab
7. Go to the step of creating a new application by clicking the `CREATE APPLICATION` button
8. Select the appropriate Node.js version and mode. Type your bot's path and startup file (designated as `bot.js`)
9. Install NPM with `Run NPM Install` command and run your bot with `Run JS script` command


## Restarting the Bot with CronJob

> Note: This step is to restart the bot in case the button running on the server is disabled due to software and server errors.

1. Go to the free service [@Cron-Job](https://cron-job.org/en/) and complete the registration process.
2. Go to the `Cronjobs` page from the relevant menu and click the `CREAT CRONJOB` button
3. On the page that opens, you can write your bot's name in the 'Title' section.
4. In the 'URL' section, fill in 'http://SİTENİZ.com/BOTuzun_SUNUCU_YOLU/BOTuzun_ADI.js' according to you. (Fill in the part that says YOUR SITE with your domain name or IP address)
5. In the `Execution schedule` section, enter the time frequency you want
6. Tick `Treat redirects with HTTP 3xx status code as success` in the `ADVANCED` section above
7. Click the `SAVE` button and save your settings.

> Note: Every time the Cron Job runs, it will throw a `Cronjob execution: Failed (timeout)` error. Don't mind this, your bot will run automatically whenever you want.


## Libraries Used

* [Nodejs](https://nodejs.org/en/)
* [Telegraf Package](https://www.npmjs.com/package/telegraf)
* [Axios Package](https://www.npmjs.com/package/axios)
* [Cheerio Package](https://www.npmjs.com/package/cheerio)
* [Cron Package](https://www.npmjs.com/package/cron)

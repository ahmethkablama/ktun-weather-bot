const axios = require('axios'); 
const cheerio = require('cheerio'); 
const dayjs = require('dayjs'); 
const CronJob = require('cron').CronJob; 
const { Telegraf } = require('telegraf')
require('dotenv').config(); 
const { telegrafThrottler } = require('telegraf-throttler');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN)
const throttler = telegrafThrottler();

require('dayjs/locale/tr'); 
dayjs.locale('tr');

const instantweather = [];
const tendaysweather = [];
const hourlyweather = [];
let latitude = 38.0089681; let longitude = 32.5200461;
let FeelingStatus = "";
let FeelingWeather = "";
let WeatherStatusKey = "";
let ConditionWeather = [];
let S1An = 1; S2An = 1; S3An = 1; S4An = 1; S5An = 1; S6An = 1; S7An = 1;
let R1An = 1; R2An = 1; R3An = 1; R4An = 1; R5An = 1; R6An = 1; R7An = 1;
let SU1 = 1; let SU2 = 1; let SU3 = 1; let SU4 = 1; let SU5 = 1;
let RainAlert= 1; let SnowAlert = 1; let SleetAlert = 1;
let ErrorSwitchInstantWeather = 0, ErrorSwitchWeather10Day = 0, ErrorSwitchWeather24Hour = 0;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function setInstantWeatherData() {
  WeatherStatusKey = 1;
  let WeatherData = {
    temperature: '', feelslike: '', status: '', highlow: '', wind: '', humidity: '', uvindex: '', time: '', rain: '', rainstatus: '', fog: '', 
    snows_1: '', snows_2: '', snows_3: '', snows_4: '', snows_5: '', snows_6: '',
    snowfall: '', snowfall_1: '', snowfall_2: '', snowfall_3: '', snowfall_4: '', snowfall_5: '', snowfall_6: ''
  };
  try{
  const { data } = await axios.get(`https://weather.com/tr-TR/weather/today/l/${latitude},${longitude}`); 
  const $ = cheerio.load(data);
  for (var i = instantweather.length; i > 0; i--) {
    instantweather.shift();
   }
   $('body').each((index, element) => { 

    $(element).find('div:first main div:nth-child(2) main').each((index, element) => {
    WeatherData.temperature = $(element).find('div:nth-child(1) div section div div:nth-child(2) div:nth-child(1) div:first span:first ').text().trim();
    WeatherData.status = $(element).find('div:nth-child(1) div section div div:nth-child(2) div:nth-child(1) div:last svg title ').text().trim(); 
    WeatherData.highlow = $(element).find('main div:nth-child(1) div section div div:nth-child(2) div:nth-child(1) div:first div:nth-child(3) ').text().trim();
    WeatherData.time = $(element).find('main div:nth-child(1) div section div div:nth-child(1) span:first').text().trim().replace(" GMT+03:00 itibariyle", "");
    WeatherData.rain = $(element).find('main div:nth-child(2) section div:first div h2').text().trim();
    WeatherData.rainstatus = $(element).find('main div:nth-child(2) section div:first div p').text().trim().replace("olasılığı", "bekleniyor").replace("olası", "bekleniyor");
    });

    $(element).find('div:first main div:nth-child(2) main div:nth-child(4) section').each((index, element) => {
    WeatherData.snowfall = $(element).find('div h2').text().trim().replace("Kar", "❄️ *Kar").replace("yağışı", "Yağış").replace("Miktarları", "Miktarı* ❄️");
    WeatherData.snows_1 = $(element).find('ul li:nth-child(1) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_1 = $(element).find('ul li:nth-child(1) p span').text().trim().replace("< ", "").replace(" cm", "");
    WeatherData.snows_2 = $(element).find('ul li:nth-child(2) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_2 = $(element).find('ul li:nth-child(2) p span').text().trim().replace("< ", "").replace(" cm", "");
    WeatherData.snows_3 = $(element).find('ul li:nth-child(3) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_3 = $(element).find('ul li:nth-child(3) p span').text().trim().replace("< ", "").replace(" cm", "");
    WeatherData.snows_4 = $(element).find('ul li:nth-child(4) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_4 = $(element).find('ul li:nth-child(4) p span').text().trim().replace("< ", "").replace(" cm", "");
    WeatherData.snows_5 = $(element).find('ul li:nth-child(5) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_5 = $(element).find('ul li:nth-child(5) p span').text().trim().replace("< ", "").replace(" cm", "");
    WeatherData.snows_6 = $(element).find('ul li:nth-child(6) h3').text().trim().replace("Sa.", "hour içinde ~");
    WeatherData.snowfall_6 = $(element).find('ul li:nth-child(6) p span').text().trim().replace("< ", "").replace(" cm", "");
    });
    
    if (WeatherData.rain == "Yağmur" || WeatherData.rain == "Kar" || WeatherData.rain == "Karla Karışık Yağmur") 
    {
      WeatherData.feelslike = $('div:first main div:nth-child(2) main div:nth-child(6) section div:first div:first span:first ').text().trim().replace("°", "");

      $(element).find('div:nth-child(1) main div:nth-child(2) main div:nth-child(6) section ').each((index, element) => {
      WeatherData.wind = $(element).find('div:nth-child(2) div:last').text().trim().replace(" km/s", "").replace("Wind Direction", ""); 
      WeatherData.humidity = $(element).find('div:nth-child(3) div:nth-child(3) div:last').text().trim().replace("%", "");
      WeatherData.uvindex = $(element).find('div:nth-child(6) div:last').text().trim();
      WeatherData.fog = $(element).find('div:nth-child(7) div:last').text().trim();
    })}

     else
    {
      WeatherData.feelslike = $('div:first main div:nth-child(2) main div:nth-child(5) section div:first div:first span:first ').text().trim().replace("°", "");
      
      $(element).find('div:nth-child(1) main div:nth-child(2) main div:nth-child(4) section ').each((index, element) => {
      WeatherData.wind = $(element).find('div:nth-child(2) div:last').text().trim().replace(" km/s", "").replace("Wind Direction", ""); 
      WeatherData.humidity = $(element).find('div:nth-child(3) div:nth-child(3) div:last').text().trim().replace("%", "");
      WeatherData.uvindex = $(element).find('div:nth-child(6) div:last').text().trim();
      WeatherData.fog = $(element).find('div:nth-child(7) div:last').text().trim();
    })}
     

    instantweather.push({ ...WeatherData });  
  });

    ErrorSwitchInstantWeather = 0;
    await WeatherStatus();
  }

  catch(err){
    //console.log(err);
    ErrorSwitchInstantWeather = 1;
  } 

    //console.log(`${instantweather[0].wind}`);

} 



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getWindandTemperatureJob = new CronJob('* * * * *', async () => { 
  latitude = 38.0089681; 
  longitude = 32.5200461;

  if(ErrorSwitchInstantWeather == 0){

  for (var i = instantweather.length; i > 0; i--) {
    instantweather.shift();
   }
  await setInstantWeatherData();
  await setWeather24Hour();

for (i = 0; i <= 2; i++) {

if (instantweather[0].rain == 'Yağmur' && hourlyweather[i].rain > 65 && RainAlert== 0) { RainAlert= 1; SnowAlert = 0; SleetAlert = 0;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `🌧️ *YAĞMUR UYARISI* 🌧️ \n\n${instantweather[0].rainstatus}`, {parse_mode: 'Markdown'});
}

else if (instantweather[0].rain == 'Kar' && SnowAlert == 0 && instantweather[0].snowfall_2 > 2 && instantweather[0].snowfall_3 > 2 ) { SnowAlert = 1; RainAlert= 0; SleetAlert = 0;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `🌨️ *KAR UYARISI* 🌨️ \n${instantweather[0].rainstatus}
    
${instantweather[0].snowfall}
${instantweather[0].snows_1} ${instantweather[0].snowfall_1} cm
${instantweather[0].snows_2} ${instantweather[0].snowfall_2} cm
${instantweather[0].snows_3} ${instantweather[0].snowfall_3} cm
${instantweather[0].snows_4} ${instantweather[0].snowfall_4} cm
${instantweather[0].snows_5} ${instantweather[0].snowfall_5} cm
${instantweather[0].snows_6} ${instantweather[0].snowfall_6} cm
`, {parse_mode: 'Markdown'});
}

else if (instantweather[0].rain == 'Karla Karışık Yağmur' && SleetAlert == 0 && instantweather[0].snowfall_2 > 2 && instantweather[0].snowfall_3 > 2) { SleetAlert = 1; RainAlert= 0; SnowAlert = 0;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `🌧️ *KARLA KARIŞIK YAĞMUR UYARISI* 🌨️ \n${instantweather[0].rainstatus}
     
${instantweather[0].snowfall}
${instantweather[0].snows_1} ${instantweather[0].snowfall_1} cm
${instantweather[0].snows_2} ${instantweather[0].snowfall_2} cm
${instantweather[0].snows_3} ${instantweather[0].snowfall_3} cm
${instantweather[0].snows_4} ${instantweather[0].snowfall_4} cm
${instantweather[0].snows_5} ${instantweather[0].snowfall_5} cm
${instantweather[0].snows_6} ${instantweather[0].snowfall_6} cm
`, {parse_mode: 'Markdown'});
}    

else if (instantweather[0].rain === ''){ SleetAlert = 0; SnowAlert = 0; RainAlert= 0;}

}

if (parseInt(instantweather[0].feelslike) >= 55 && S1An == 0 && S2An == 1 && S3An == 1 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S1An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🔥 \n\nHissedilen sıcaklık *54°C* 'yi aşarak "*ÇOK TEHLİKELİ SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Isı veya güneş çarpması tehlikesi oluşur. Termal şok an meselesidir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= 54 && parseInt(instantweather[0].feelslike) >= 42 && S1An == 0 && S2An == 0 && S3An == 1 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S2An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🔥 \n\nHissedilen sıcaklık *41°C* 'yi aşarak "*TEHLİKELİ SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Güneş çarpması, ısı krampları veya ısı bitkinliği meydana gelebilir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= 41 && parseInt(instantweather[0].feelslike) >= 33 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S3An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🥵 \n\nHissedilen sıcaklık *32°C* 'yi aşarak "*ÇOK SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Fiziksel etkinliğe ve etkilenme süresine bağlı olarak kuvvetli termal stres ile birlikte ısı çarpması ısı krampları ve ısı yorgunlukları oluşabilir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) > -6 && parseInt(instantweather[0].feelslike) < 28) { S1An = 0; S2An = 0; S3An = 0; S4An = 0; S5An = 0; S6An = 0; S7An = 0;}
else if (parseInt(instantweather[0].feelslike) <= -11 && parseInt(instantweather[0].feelslike) >= -19 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S4An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *DÜŞÜK SICAKLIK UYARISI* 🥶 \n\nHissedilen sıcaklık *-10°C* 'yi aşarak "*ÇOK SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Kuru ciltte 5 saatten daha az sürede çatlama ve rüzgâr ısırığı riski.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= -20 && parseInt(instantweather[0].feelslike) >= -34 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 1 && S5An == 0 && S6An == 0 && S7An == 0) { S5An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *ÇOK DÜŞÜK SICAKLIK UYARISI* 🥶 \n\nHissedilen sıcaklık *-25°C* 'yi aşarak "*AŞIRI SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Açıkta kalan vücut yüzeylerinde 1 dakika içinde donma riski.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= -35 && parseInt(instantweather[0].feelslike) >= -50 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 1 && S5An == 1 && S6An == 0 && S7An == 0) { S6An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *AŞŞIRI DÜŞÜK SICAKLIK UYARISI* ❄️ \n\nHissedilen sıcaklık *-45°C* 'yi aşarak "*TEHLİKELİ SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Açıkta kalan vücut yüzeylerinde 30 saniye içinde donma riski.*`, {parse_mode: 'Markdown'})}


if (parseInt(instantweather[0].wind) <= 20 ) { R1An = 0; R2An = 0; R3An = 0; R4An = 0; R5An = 0; R6An = 0; R7An = 0;}
else if (parseInt(instantweather[0].wind) <= 40 && parseInt(instantweather[0].wind) > 28 && R1An == 0 && R2An == 0 && R3An == 0 && R4An == 0 && R5An == 0 && R6An == 0 && R7An == 0) { R1An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *KUVVETLİ RÜZGAR UYARISI* 🌬 \n\nAnlık rüzgar *28km/s* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) <= 50 && parseInt(instantweather[0].wind) > 40 && R1An == 1 && R2An == 0 && R3An == 0 && R4An == 0 && R5An == 0 && R6An == 0 && R7An == 0) { R2An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *FIRTINA RÜZGARI UYARISI* 💨 \n\nAnlık rüzgar *40km/s* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) <= 60 && parseInt(instantweather[0].wind) > 50 && R1An == 1 && R2An == 1 && R3An == 0 && R4An == 0 && R5An == 0 && R6An == 0 && R7An == 0) { R3An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *FIRTINA UYARISI* 💨 \n\nAnlık rüzgar *50km/s* hızı aşarak *${instantweather[0].ruzgarn}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) <= 75 && parseInt(instantweather[0].wind) > 60 && R1An == 1 && R2An == 1 && R3An == 1 && R4An == 0 && R5An == 0 && R6An == 0 && R7An == 0) { R4An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *KUVVETLİ FIRTINA UYARISI* 🌪 \n\nAnlık rüzgar *60km/s* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) <= 90 && parseInt(instantweather[0].wind) > 75 && R1An == 1 && R2An == 1 && R3An == 1 && R4An == 1 && R5An == 0 && R6An == 0 && R7An == 0) { R5An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *BÜYÜK FIRTINA UYARISI* 🌪 \n\nAnlık rüzgar *75km/s°C* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) <= 100 && parseInt(instantweather[0].wind) > 90 && R1An == 1 && R2An == 1 && R3An == 1 && R4An == 1 && R5An == 1 && R6An == 0 && R7An == 0) { R6An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *ÇOK BÜYÜK FIRTINA UYARISI* 🌪 \n\nAnlık rüzgar *90km/s* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].wind) >= 100 && R1An == 1 && R2An == 1 && R3An == 1 && R4An == 1 && R5An == 1 && R6An == 1 && R7An == 0) { R7An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *KASIRGA UYARISI* 🌪 \n\nAnlık rüzgar *100km/s* hızı aşarak *${instantweather[0].wind}km/s* hıza ulaşmıştır.`, {parse_mode: 'Markdown'})}


if (parseInt(instantweather[0].feelslike) >= 55 && S1An == 0 && S2An == 1 && S3An == 1 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S1An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🔥 \n\nHissedilen sıcaklık *54°C* 'yi aşarak "*ÇOK TEHLİKELİ SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Isı veya güneş çarpması tehlikesi oluşur. Termal şok an meselesidir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= 54 && parseInt(instantweather[0].feelslike) >= 42 && S1An == 0 && S2An == 0 && S3An == 1 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S2An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🔥 \n\nHissedilen sıcaklık *41°C* 'yi aşarak "*TEHLİKELİ SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Güneş çarpması, ısı krampları veya ısı bitkinliği meydana gelebilir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= 41 && parseInt(instantweather[0].feelslike) >= 33 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S3An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YÜKSEK SICAKLIK UYARISI* 🥵 \n\nHissedilen sıcaklık *32°C* 'yi aşarak "*ÇOK SICAK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Fiziksel etkinliğe ve etkilenme süresine bağlı olarak kuvvetli termal stres ile birlikte ısı çarpması ısı krampları ve ısı yorgunlukları oluşabilir.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) > -6 && parseInt(instantweather[0].feelslike) < 28) { S1An = 0; S2An = 0; S3An = 0; S4An = 0; S5An = 0; S6An = 0; S7An = 0;}
else if (parseInt(instantweather[0].feelslike) <= -11 && parseInt(instantweather[0].feelslike) >= -19 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 0 && S5An == 0 && S6An == 0 && S7An == 0) { S4An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *DÜŞÜK SICAKLIK UYARISI* 🥶 \n\nHissedilen sıcaklık *-10°C* 'yi aşarak "*ÇOK SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Kuru ciltte 5 saatten daha az sürede çatlama ve rüzgâr ısırığı riski.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= -20 && parseInt(instantweather[0].feelslike) >= -34 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 1 && S5An == 0 && S6An == 0 && S7An == 0) { S5An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *ÇOK DÜŞÜK SICAKLIK UYARISI* 🥶 \n\nHissedilen sıcaklık *-25°C* 'yi aşarak "*AŞIRI SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Açıkta kalan vücut yüzeylerinde 1 dakika içinde donma riski.*`, {parse_mode: 'Markdown'})}
else if (parseInt(instantweather[0].feelslike) <= -35 && parseInt(instantweather[0].feelslike) >= -50 && S1An == 0 && S2An == 0 && S3An == 0 && S4An == 1 && S5An == 1 && S6An == 0 && S7An == 0) { S6An = 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *AŞŞIRI DÜŞÜK SICAKLIK UYARISI* ❄️ \n\nHissedilen sıcaklık *-45°C* 'yi aşarak "*TEHLİKELİ SOĞUK*" kategorisi olan *${instantweather[0].feelslike}°C* 'ye ulaşmıştır. \n\n*Açıkta kalan vücut yüzeylerinde 30 saniye içinde donma riski.*`, {parse_mode: 'Markdown'})}


if (parseFloat(instantweather[0].fog) >= 10.0 || instantweather[0].fog == "Sınırsız") { SU1 = 0; SU2 = 0; SU3 = 0; SU4 = 0; SU5 = 0;}
else if (parseFloat(instantweather[0].fog) >= 2.0 && parseFloat(instantweather[0].fog) < 5.0 && SU1 == 0 && SU2 == 0 && SU3 == 0 && SU4 == 0 && SU5 == 0) { SU1 == 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *HAFİF PUS UYARISI* 💨 \n\nGörüş mesafesi *5 km* 'den *${instantweather[0].fog}* 'ye düşmüştür.`, {parse_mode: 'Markdown'})}
else if (parseFloat(instantweather[0].fog) >= 1.0 && parseFloat(instantweather[0].fog) < 2.0 && SU1 == 1 && SU2 == 0 && SU3 == 0 && SU4 == 0 && SU5 == 0) { SU2 == 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YOĞUN PUS UYARISI* 💨 \n\nGörüş mesafesi *2 km* 'den *${instantweather[0].fog}* 'ye düşmüştür.`, {parse_mode: 'Markdown'})}
else if (parseFloat(instantweather[0].fog) >= 0.5 && parseFloat(instantweather[0].fog) < 1.0 && SU1 == 1 && SU2 == 1 && SU3 == 0 && SU4 == 0 && SU5 == 0) { SU3 == 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *HAFİF SİS UYARISI* 🌫 \n\nGörüş mesafesi *1 km* 'den *${instantweather[0].fog}* 'ye düşmüştür.`, {parse_mode: 'Markdown'})}
else if (parseFloat(instantweather[0].fog) >= 0.1 && parseFloat(instantweather[0].fog) < 0.5 && SU1 == 1 && SU2 == 1 && SU3 == 1 && SU4 == 0 && SU5 == 0) { SU4 == 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *YOĞUN SİS UYARISI* 🌫 \n\nGörüş mesafesi *0.5 km* 'den *${instantweather[0].fog}* 'ye düşmüştür.`, {parse_mode: 'Markdown'})}
else if (parseFloat(instantweather[0].fog) <= 0.1 && SU1 == 1 && SU2 == 1 && SU3 == 1 && SU4 == 1 && SU5 == 0) { SU5 == 1;
  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, `⚠️ *ÇOK YOĞUN SİS UYARISI* 🌫 \n\nGörüş mesafesi *0.1 km* 'den *${instantweather[0].fog}* 'ye düşmüştür.`, {parse_mode: 'Markdown'})}

}})


async function WeatherStatus() {
  FeelingWeather = parseInt(instantweather[0].feelslike);
   //console.log(FeelingWeather);
  
    if ((FeelingWeather) <= '-60' ) { FeelingStatus = "çok tehlikeli soğuk"; }
    else if (FeelingWeather <= '-45' && FeelingWeather > '-59') { FeelingStatus = "tehlikeli soğuk"; }
    else if (FeelingWeather <= '-25' && FeelingWeather > '-45') { FeelingStatus = "aşırı soğuk"; }
    else if (FeelingWeather <= '-9' && FeelingWeather > '-25') { FeelingStatus = "çok soğuk"; }
    else if (FeelingWeather <= '5' && FeelingWeather > '-9') { FeelingStatus = "soğuk"; }
    else if (FeelingWeather <= '12' && FeelingWeather > '5') { FeelingStatus = "ürpertici soğuk"; }
    else if (FeelingWeather <= '19' && FeelingWeather > '12') { FeelingStatus = "serin"; }
    else if (FeelingWeather <= '24' && FeelingWeather > '19') { FeelingStatus = "ılık"; }
    else if (FeelingWeather <= '28' && FeelingWeather > '24') { FeelingStatus = "bunaltıcı sıcak"; }
    else if (FeelingWeather <= '32' && FeelingWeather > '28') { FeelingStatus = "sıcak"; }
    else if (FeelingWeather <= '41' && FeelingWeather > '32') { FeelingStatus = "çok sıcak"; }
    else if (FeelingWeather <= '54' && FeelingWeather > '41') { FeelingStatus = "tehlikeli sıcak"; }
    else if (FeelingWeather >= '55') { FeelingStatus = "çok tehlikeli sıcak"; }
    else { FeelingStatus = "bilinmiyor"; }
  //console.log(FeelingStatus);
}
  


const getWeatherJob = new CronJob('00 09 * 0-5,8-11 1-5', async () => { 
  latitude = 38.0089681; 
  longitude = 32.5200461;
  if(ErrorSwitchInstantWeather == 0){
  for (var i = instantweather.length; i > 0; i--) {
    instantweather.shift();
   }
  await setInstantWeatherData();
  await WeatherStatus();
  await WeatherTranslationAndEmoji();

  bot.telegram.sendMessage(process.env.TELEGRAM_GROUP_ID, WeatherGroupShare(), {parse_mode: 'Markdown'}, {disable_notification: true}); 
  
}});


function WeatherGroupShare() {
return `
🌡 Anlık: *${instantweather[0].temperature}C*  *${instantweather[0].status}* 
🫥 Hissedilen: *${instantweather[0].feelslike}°C* _(${FeelingStatus})_
💧Nem: *%${instantweather[0].humidity}*   🍃 Rüzgar: *${instantweather[0].wind}km/s*
🌆 Gündüz:*${instantweather[0].highlow.replace("Gün", "").replace("Gece", "C*   🌃 Gece:*").replace(" • ", "")}C*
`}


function InstantWeather() { 
return `
🌡 Anlık: *${instantweather[0].temperature}C*  *${instantweather[0].status}*
🫥 Hissedilen: *${instantweather[0].feelslike}°C* _(${FeelingStatus})_
💧Nem: *%${instantweather[0].humidity}*  🍃 Rüzgar: *${instantweather[0].wind}km/s*  ☀️ UV: *${instantweather[0].uvindex.replace(" / ", "/").replace("/10", "")}*
🌆 Gündüz:*${instantweather[0].highlow.replace("Gün", "").replace("Gece", "C*  🌃 Gece:*").replace(" • ", "")}C*  🕣 ${instantweather[0].time.replace("EET itibariyle", "")}
`}



async function setWeather10Day() {
  WeatherStatusKey = 2;
  let Weather10DayData = {
    genel: [], date: [], day: [], highest: [], lowest: [], status: [], rain: [], wind: []
  };
  try{
  const { data } = await axios.get(`https://weather.com/tr-TR/weather/tenday/l/${latitude},${longitude}`);
  const $ = cheerio.load(data); 
  for (var i = tendaysweather.length; i > 0; i--) {
    tendaysweather.shift();
   }
  Weather10DayData.genel = $('.DailyContent--narrative--hplRl:first').text().trim();
  
  for (let i=1 ; i<11 ; i++){
   // tendaysweather[i].highest
    Weather10DayData.date = dayjs().add(i-1, 'day').format('D MMMM dddd 🗓');
    //Weather10DayData.day = $(`body div:first main div:nth-child(2) main div:nth-child(1) div section div:nth-child(2) details:nth-of-type(${i}) summary div div h3`).text().trim();
    Weather10DayData.highest = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(1) span:first`).text().trim();
    Weather10DayData.lowest = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(1) span:nth-child(2) span`).text().trim();
    Weather10DayData.status = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(2) svg title`).text().trim();
    Weather10DayData.rain = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(3) span`).text().trim();
    Weather10DayData.wind = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(4) span`).text().trim();

    if (i == 1 ) { Weather10DayData.date = "Bugün 🗓"; }

    else if (i == 2 ) { Weather10DayData.date = "Yarın 🗓"; }

    tendaysweather.push({ ...Weather10DayData });  
    Weather10DayData = {
    genel: [], date: [], day: [], highest: [], lowest: [], status: [], rain: [], wind: []
    };
  }
  ErrorSwitchWeather10Day = 0;
}

catch(err){
  //console.log(err);
  ErrorSwitchWeather10Day = 1;
} 
} 


function TodayWeather() { 
return `
*${tendaysweather[0].status}*
En yüksek: *${tendaysweather[0].highest}C*  🌆
En düşük: *${tendaysweather[0].lowest}C*  🌃
Yağmur ihtimali: *%${tendaysweather[0].rain.replace("%", "")}* ☔️ 
Rüzgar: *${tendaysweather[0].wind}* 🍃
`}

function TomorrowWeather() {
return `
*${tendaysweather[1].status}*
En yüksek: *${tendaysweather[1].highest}C*  🌆
En düşük: *${tendaysweather[1].lowest}C*  🌃
Yağmur ihtimali: *%${tendaysweather[1].rain.replace("%", "")}* ☔️ 
Rüzgar: *${tendaysweather[1].wind}* 🍃
`}


async function TenDailyWeather() { //
  let TenDailyWeatherList = '';
  tendaysweather.forEach(item => {
    TenDailyWeatherList += TenDailyWeatherPush(item);
  });
  //console.log(`${TenDailyWeatherList}`);
  return TenDailyWeatherList;
}

function TenDailyWeatherPush(tendaysweather) {
return `
*${tendaysweather.date}*
*${tendaysweather.status}*
En yüksek: *${tendaysweather.highest}C*  🌆
En düşük: *${tendaysweather.lowest}C*  🌃
Yağmur ihtimali: *%${tendaysweather.rain.replace("%", "")}* ☔️ 
Rüzgar: *${tendaysweather.wind}* 🍃
`}



async function setWeather24Hour() {
  WeatherStatusKey = 3;
  let Weather24HourData = {
    hour: "", temperature: "", status: "", rain: "", wind: ""
  };
  try{
  const { data } = await axios.get(`https://weather.com/tr-TR/weather/hourbyhour/l/${latitude},${longitude}`);
  const $ = cheerio.load(data);
  for (var i = hourlyweather.length; i > 0; i--) {
    hourlyweather.shift();
   }
  for (let i=1 ; i<25 ; i++){
    Weather24HourData.hour = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div h3`).text().trim();
    Weather24HourData.temperature = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(1) span`).text().trim();
    Weather24HourData.status = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(2) svg title`).text().trim();
    Weather24HourData.rain = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(3) span`).text().trim().replace("%", "");
    Weather24HourData.wind = $(`body div:first main div:nth-child(2) main div section details:nth-of-type(${i}) summary div div div:nth-of-type(4) span`).text().trim();
 
    hourlyweather.push({ ...Weather24HourData });

    Weather24HourData = {
      hour: "", temperature: "", status: "", rain: "", wind: ""
    };
  }
  ErrorSwitchWeather24Hour = 0;
  await WeatherClockEmoji();
  }
  catch(err){
    //console.log(err);
    ErrorSwitchWeather24Hour = 1;
  }  
}

async function HourlyWeather() {
  let HourlyWeatherList = '';
  hourlyweather.forEach(item => {
    HourlyWeatherList += HourlyWeatherPush(item);
  });
  //console.log(`${HourlyWeatherList}`);
  return HourlyWeatherList;
}

function HourlyWeatherPush(hourlyweather) { 
return `
*${hourlyweather.hour}*
Sıcaklık: *${hourlyweather.temperature}C* 🌡
Durum: *${hourlyweather.status}*
Yağmur ihtimali: *%${hourlyweather.rain}* ☔️ 
Rüzgar: *${hourlyweather.wind}* 🍃
`}


async function WeatherClockEmoji() {
for (let i=0 ; i<24 ; i++){
  if (hourlyweather[i].hour === '0:00' || hourlyweather[i].hour === '12:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕛'; }
  else if ( hourlyweather[i].hour === '1:00' ||  hourlyweather[i].hour === '13:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕐'; }
  else if ( hourlyweather[i].hour === '2:00' ||  hourlyweather[i].hour === '14:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕑'; }
  else if ( hourlyweather[i].hour === '3:00' ||  hourlyweather[i].hour === '15:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕒'; }
  else if ( hourlyweather[i].hour === '4:00' ||  hourlyweather[i].hour === '16:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕓'; }
  else if ( hourlyweather[i].hour === '5:00' ||  hourlyweather[i].hour === '17:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕔'; }
  else if ( hourlyweather[i].hour === '6:00' ||  hourlyweather[i].hour === '18:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕕'; }
  else if ( hourlyweather[i].hour === '7:00' ||  hourlyweather[i].hour === '19:00') {hourlyweather[i].hour = hourlyweather[i].hour + ' 🕖'; }
  else if ( hourlyweather[i].hour === '8:00' ||  hourlyweather[i].hour === '20:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕗'; }
  else if ( hourlyweather[i].hour === '9:00' ||  hourlyweather[i].hour === '21:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕘'; }
  else if ( hourlyweather[i].hour === '10:00' ||  hourlyweather[i].hour === '22:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕙'; }
  else if ( hourlyweather[i].hour === '11:00' ||  hourlyweather[i].hour === '23:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕚'; }
  else if ( hourlyweather[i].hour === '12:00' ||  hourlyweather[i].hour === '24:00') { hourlyweather[i].hour = hourlyweather[i].hour + ' 🕛'; }
  else { hourlyweather[i].hour = "bilinmiyor"; }
  //console.log(hourlyweather[i].hour);
  }
}


async function WeatherTranslationAndEmoji() {
  if (WeatherStatusKey == 1 ) {var listlength = instantweather.length;}
  else if (WeatherStatusKey == 2 ) {var listlength = tendaysweather.length;}
  else if (WeatherStatusKey == 3 ){var listlength = hourlyweather.length;}
  
  for (let i=0 ; i<listlength ; i++){

    if (WeatherStatusKey == 1 ) {ConditionWeather[0] = instantweather[0].status;}
    else if (WeatherStatusKey == 2 ) {ConditionWeather[i] = tendaysweather[i].status;}
    else if (WeatherStatusKey == 3 ){ConditionWeather[i] = hourlyweather[i].status;}

    //console.log(ConditionWeather[i]);

    if (ConditionWeather[i] == 'Sunny' ) { ConditionWeather[i] = "Güneşli ☀️"; }
    else if (ConditionWeather[i] == 'Foggy') { ConditionWeather[i] = "Sisli 🌫️"; }
    else if (ConditionWeather[i] == 'Mostly Sunny') { ConditionWeather[i] = "Çoğunlukla Güneşli 🌤"; }
    else if (ConditionWeather[i] == 'Mostly Cloudy') { ConditionWeather[i] = "Yer Yer Bulutlu ⛅️"; }
    else if (ConditionWeather[i] == 'Partly Cloudy') { ConditionWeather[i] = "Parçalı Bulutlu 🌥"; }
    else if (ConditionWeather[i] == 'Cloudy') { ConditionWeather[i] = "Bulutlu ☁️"; }
    else if (ConditionWeather[i] == 'Scattered Showers Night') { ConditionWeather[i] = "Hafif Yağışlı Gece 🌧🌙"; }
    else if (ConditionWeather[i] == 'Thunderstorm') { ConditionWeather[i] = "Fırtına 🌪️"; }
    else if (ConditionWeather[i] == 'Scattered Showers') { ConditionWeather[i] = "Hafif Yağışlı 🌧"; }
    else if (ConditionWeather[i] == 'Rain') { ConditionWeather[i] = "Sağnak Yağışlı 🌧"; }
    else if (ConditionWeather[i] == 'Rain and Snow') { ConditionWeather[i] = "Karla Karışık Yağmur 🌧"; }
    else if (ConditionWeather[i] == 'Snow') { ConditionWeather[i] = "Kar Yağışlı 🌨"; }
    else if (ConditionWeather[i] == 'Heavy Rain') { ConditionWeather[i] = "Şiddetli Yağışlı ⛈💨"; }
    else if (ConditionWeather[i] == 'Scattered Thunderstorms Night') { ConditionWeather[i] = "Gök Gürültülü Gece ⛈🌙"; }
    else if (ConditionWeather[i] == 'Scattered Thunderstorms') { ConditionWeather[i] = "Yer Yer Gök Gürültülü Sağnak ⛈"; }
    else if (ConditionWeather[i] == 'Isolated Thunderstorms') { ConditionWeather[i] = "Gök Gürültülü 🌩"; }
    else if (ConditionWeather[i] == 'Wind') { ConditionWeather[i] = "Rüzgârlı 💨"; }
    else if (ConditionWeather[i] == 'Partly Cloudy Night') { ConditionWeather[i] = "Parçalı Bulutlu Gece ☁️🌙"; }
    else if (ConditionWeather[i] == 'Mostly Cloudy Night') { ConditionWeather[i] = "Yoğun Bulutlu Gece ☁️🌙"; }
    else if (ConditionWeather[i] == 'Mostly Clear Night') { ConditionWeather[i] = "Çoğunlukla Açık Gece 🌙"; }
    else if (ConditionWeather[i] == 'Clear Night') { ConditionWeather[i] = "Açık Gece 🌙"; }
    else { ConditionWeather[i] = ConditionWeather[i]; }

    if (WeatherStatusKey == 1 ) {instantweather[0].status = ConditionWeather[0];}
    else if (WeatherStatusKey == 2 ) {tendaysweather[i].status = ConditionWeather[i];}
    else if (WeatherStatusKey == 3 ){hourlyweather[i].status = ConditionWeather[i];}
  }
}


async function startBot() { 

bot.use(throttler);

bot.start(async (ctx) => { bot.telegram.sendMessage(ctx.chat.id,`Selamun Aleyküm *${ctx.from.first_name}* 🙂 hoş geldin
\nBot ile *The Weather Channel* sitesinden (weather.com) alınan verilerle Konya Teknik Üniversitesi merkezli hava durumu bilgilerini görüntüleyebilirsiniz.
\nTüm komutları görüntülemek için sol alttaki *☰ Menü* bölümünü kullanabilirsiniz.`, {disable_web_page_preview: true , parse_mode: 'Markdown'})
if (ctx.chat.id != 1705065791) bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
})


 
bot.command('komutlar', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);

ctx.replyWithMarkdown(`Aşağıdaki komutlara tıklayarak ilgili bilgileri çağırabilirsiniz.

*/anlik (anlık hava durumu)*
*/bugun (bugün hava durumu)*
*/yarin (yarın hava durumu)*
*/ongunluk (10 günlük hava durumu)*
*/saatlik (24 saatlik hava durumu)*
*/konumhava (konumunuzdaki hava durumu)*
*/iletisim (geliştirici iletişimi)*
`).then(function(resp) {}).catch(function(err) {})
});


bot.command('anlik', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  latitude = 38.0089681; longitude = 32.5200461;
  await setInstantWeatherData(); await WeatherTranslationAndEmoji(); 

  if (ErrorSwitchInstantWeather == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  else if (ErrorSwitchInstantWeather == 0){
    bot.telegram.sendMessage(ctx.chat.id, InstantWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

});


 bot.command('bugun', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  latitude = 38.0089681; longitude = 32.5200461;
  await setWeather10Day(); await WeatherTranslationAndEmoji();

  if (ErrorSwitchWeather10Day == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  else if (ErrorSwitchWeather10Day == 0){
    bot.telegram.sendMessage(ctx.chat.id, TodayWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
});

 bot.command('yarin', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  latitude = 38.0089681; longitude = 32.5200461;
  await setWeather10Day(); await WeatherTranslationAndEmoji();

  if (ErrorSwitchWeather10Day == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  else if (ErrorSwitchWeather10Day == 0){
    bot.telegram.sendMessage(ctx.chat.id, TomorrowWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
});

 bot.command('ongunluk', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  latitude = 38.0089681; longitude = 32.5200461;
  await setWeather10Day(); await WeatherTranslationAndEmoji();

  if (ErrorSwitchWeather10Day == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  else if (ErrorSwitchWeather10Day == 0){
    bot.telegram.sendMessage(ctx.chat.id, await TenDailyWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
});

 bot.command('saatlik', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  latitude = 38.0089681; longitude = 32.5200461;
  await setWeather24Hour(); await WeatherTranslationAndEmoji();
  if (ErrorSwitchWeather24Hour == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  else if (ErrorSwitchWeather24Hour == 0){
    bot.telegram.sendMessage(ctx.chat.id, await HourlyWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
});

bot.command('konumhava', (ctx) => {
bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
bot.telegram.sendMessage(ctx.chat.id,  "*Lütfen altta bulunan 📎 ataç ikonundan mevcut konumunuzu paylaşın.*", {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});

bot.on('location', async (ctx) => {
  latitude = ctx.message.location.latitude; longitude = ctx.message.location.longitude;
  ctx.replyWithMarkdown('*Hangi hava durumunu istediğinizi seçin*',
    {
      reply_markup:{
        inline_keyboard: [
            [{text: "Anlık Havadurumu", callback_data: "anlik"}, {text: "Saatlik Havadurumu", callback_data: "saatlik"}],
            [{text: "Bugün Havadurumu", callback_data: "bugun"}, {text: "Yarın Havadurumu", callback_data: "yarin"}],
            [{text: "On Günlük Havadurumu", callback_data: "ongunluk"}]
        ]
      }
    })

    bot.action('anlik', async (ctx) =>{
      ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
      await setInstantWeatherData(); await WeatherTranslationAndEmoji();

      if (ErrorSwitchInstantWeather == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      else if (ErrorSwitchInstantWeather == 0){
        bot.telegram.sendMessage(ctx.chat.id, InstantWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }

    })
    
    bot.action('saatlik', async (ctx) =>{
      ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
      await setWeather24Hour(); await WeatherTranslationAndEmoji(); 

      if (ErrorSwitchWeather24Hour == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      else if (ErrorSwitchWeather24Hour == 0){
        bot.telegram.sendMessage(ctx.chat.id, await HourlyWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }

    })
    
    bot.action('bugun', async (ctx) =>{
      ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
      await setWeather10Day(); await WeatherTranslationAndEmoji();

      if (ErrorSwitchWeather10Day == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      else if (ErrorSwitchWeather10Day == 0){
        bot.telegram.sendMessage(ctx.chat.id, TodayWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }

    })
    
    bot.action('yarin', async (ctx) =>{
      ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
      await setWeather10Day(); await WeatherTranslationAndEmoji();

      if (ErrorSwitchWeather10Day == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      else if (ErrorSwitchWeather10Day == 0){
        bot.telegram.sendMessage(ctx.chat.id, TomorrowWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }

    })
    
    bot.action('ongunluk', async (ctx) =>{
      ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
      await setWeather10Day(); await WeatherTranslationAndEmoji();

      if (ErrorSwitchWeather10Day == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*The Weather Channel sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      else if (ErrorSwitchWeather10Day == 0){
        bot.telegram.sendMessage(ctx.chat.id, await TenDailyWeather(), {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }

    })
  })

});

bot.command('hakkinda', async (ctx) => {
bot.telegram.sendMessage(ctx.chat.id,`Proje açık kaynak olarak [GitHub](https://github.com/ahmethkablama/ktun-weather-bot) üzerinden geliştirilmektedir. Siz de projeye katılarak geliştirilmesine yardımcı olabilirsiniz.
    
Yazılım ile ilgili sorun, öneri ve görüşlerinizi @ahmethkablama 'ya iletebilirsiniz. 

[LinkedIn](https://www.linkedin.com/in/ahmethkablama/) | [Instagram](https://www.instagram.com/ahmethkablama/) | [Web](http://ahmethkablama.com/)`, {parse_mode: 'Markdown' , disable_web_page_preview: true});
bot.telegram.sendMessage(process.env.TELEGRAM_YOUR_ID,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
});

bot.launch();

}

async function runBot() {
  await setInstantWeatherData();
  await setWeather10Day();
  await setWeather24Hour();
  await startBot();
  getWindandTemperatureJob.start();
  getWeatherJob.start();
}

runBot();



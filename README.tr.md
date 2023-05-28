<p align="center">
  <a href="https://github.com/ahmethkablama/ktun-weather-bot/blob/main/README.tr.md">Türkçe</a> |
  <a href="https://github.com/ahmethkablama/ktun-weather-bot/blob/main/README.md">İngilizce</a>
</p>

# Konya Teknik Üniversitesi Hava Durumu Botu 

The Weather Channel sitesinden alınan verilerle Konya Teknik Üniversitesi merkezli hava durumu; anlık, günlük ve saatlik olarak öğrenebilir, normalin üstüne gelişen hava olaylarında kişilere veya grupları uyarı bildirim gönderebilirsiniz.

KTÜN HAVA DURUMU BOTU| 
-----------------------| 
[![@ktunhavadurumu_bot](https://img.shields.io/badge/%F0%9F%92%AC%20Telegram-%40ktunhavadurumu__bot-red)](https://telegram.me/ktunhavadurumu_bot)|


## Bot Komutları
Komut                   | Açıklama
----------------------- | ----------------------------------------    
`/start`                | Botu başlatır
`/anlik`                | Anlık hava durumu
`/bugun`                | Bugünün hava durumu
`/yarin`                | Yarının hava durumu
`/ongunluk`             | 10 günlük hava durumu
`/saatlik`              | 24 saatlik hava durumu
`/konumhava`            | Konumunuzun hava durumu
`/komutlar`             | Bot komutları
`/hakkinda`             | Proje GitHub bağlantısı ve geliştirici iletişimi


<p align="center">
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/831dcb62-57e1-4cb3-b3a6-a9ec8a39f344" width="350" hspace="10" >
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/36b66eba-4799-4fa1-9f10-6a3b35c18b9d" width="350" hspace="10" >
</p>

<p align="center">
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/81575f57-cd8c-4158-be76-ee8e3395d3c1" width="350" hspace="10" >
    <img src="https://github.com/ahmethkablama/ktun-weather-bot/assets/29388602/c20ea647-9cf3-43cd-98b4-f3d248095f2c" width="350" hspace="10" >
</p>

## Hazırlık
1. Resmi Telegram botu [@BotFather](https://telegram.me/BotFather) aracılığı ile bot oluştur ve API TOKEN'i alın
2. Grup adıyla gönderilen ve kendinize ait bir mesajı [@userinfobot](https://telegram.me/userinfobot) botuna gönderin ve ID leri kopyalayın
3. Oluşturduğunuz bota gidin, "Başlat" butonuna tıklayın ve botunuzu grubunuza ekleyip yöneticilik verin


## Yerelde Çalıştırma

> Not: Bu adım "Visual Studio Code" ile birlikte yapılmıştır.

1. Repoyu `https://github.com/ahmethkablama/ktun-weather-bot` klonlayın veya indirip açın
* Klonlama için aşağıdaki komutu kullanabilirsiniz
  ```bash
  git clone https://github.com/ahmethkablama/ktun-weather-bot
  ```
2. terminalden `npm` kurulumunu gerçekleştirin
   ```bash
   npm install
   ```
3. `.env-example` dosyasına göre `.env` dosyasını oluşturun
4. `.env` dosyasının içinde bulunan `YOUR_API`, `YOUR_ID` ve `GROUP_ID` kısımlarını [@userinfobot](https://telegram.me/userinfobot) ve [@userinfobot](https://telegram.me/userinfobot) botlarında bulunan API ve ID lere göre doldurun
5. terminalden `npm` kurulumunu gerçekleştirin
6. `npm run start` veya `node bot.js` komutuyla çalıştırın


## Sunucuda Çalıştırma (Cpanel)

> Not: Bu adım ayrılmış bir IP adresine veya bir alan adına bağlı sunucuya (hostinge) ihtiyacınız vardır.

1. Repoyu `https://github.com/ahmethkablama/ktun-weather-bot` indirin
2. Sunucunuzun ana dizinine botunuzun adıyla boş bir klasör oluşturun
3. Oluşturduğunuz klasöre bot dosyalarını yükleyin
4. `.env-example` dosyasına göre `.env` dosyasını oluşturun
5. `.env` dosyasının içinde bulunan `YOUR_API`, `YOUR_ID` ve `GROUP_ID` kısımlarını [@userinfobot](https://telegram.me/userinfobot) ve [@userinfobot](https://telegram.me/userinfobot) botlarında bulunan API ve ID lere göre doldurun
6. Sunucu panelinizden (Cpanel olarak tarif edilmektedir) `Setup Node.js App` sekmesine gidin
7. `CREATE APPLİCATİON` butonuna tıklayarak yeni bir uygulama oluşturma adımına gidin
8. Uygun Node.js versiyonunu ve modunu seçin. Botunuzun dosya yolunu ve başlangıç dosyasını (`bot.js` olarak belirlenmiştir) yazın
9. `Run NPM Install` komutuyla NPM kurulumunu yapın ve `Run JS script` komutuyla botunuzu çalıştırın


## CronJob ile Botu Yeniden Çalıştırılması

> Not: Bu adım sunucu üzerinde çalışan buton yazılım ve sunucu hatalarından dolayı devre dışı kalması durumunda botu yeniden çalıştırması içindir.

1. Ücretsiz bir servis olan [@Cron-Job](https://cron-job.org/en/) sitesine gidip üyelik işlemlerini tamamlayın.
2. İlgili menüden `Cronjobs` sayfasına gidin ve `CREAT CRONJOB` butonuna tıklayın
3. Açılan sayfada `Title` kısmına botunuzun isminizi yazabilirsiniz.
4. `URL` bölümünde `http://SİTENİZ.com/BOTUNUZUN_SUNUCU_YOLU/BOTUNUZUN_ADI.js` kendinize göre doldurun. (SİTENİZ yazan kısmı alan adı veya IP adresinizle doldurun)
5. `Execution schedule` bölümünde kendi istediğiniz ettiğiniz zaman sıklığını girin
6. Üstteki `ADVANCED` bölümünden `Treat redirects with HTTP 3xx status code as success` tikini işaretleyin
7. `SAVE` butonuna tıklayarak ve yaptığınız ayarları kaydedin.

> Not: Cron Job her çalıştığında `Cronjob execution: Failed (timeout)` hatası verecektir. Buna aldırmayın, botunuz istediğiniz zamanlarda otomatik olarak çalışacaktır.

## Kullanılan Kütüphaneler

* [Nodejs](https://nodejs.org/en/)
* [Telegraf Package](https://www.npmjs.com/package/telegraf)
* [Axios Package](https://www.npmjs.com/package/axios)
* [Cheerio Package](https://www.npmjs.com/package/cheerio)
* [Cron Package](https://www.npmjs.com/package/cron)
* [Throttler Package](https://www.npmjs.com/package/telegraf-throttler)
* [Dayjs Package](https://www.npmjs.com/package/dayjs)

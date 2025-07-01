# Steam İndirim Botu

Merhaba! Bu, Discord sunucularında Steam oyun indirimlerini takip eden ve oyun bilgileri sunan bir bottur. `/oyun-bilgi` komutuyla oyun detaylarını renkli bir şekilde görebilir, `/sistem-kur` ile indirim bildirimi kanalı ayarlayabilir ve `/sistem-sıfırla` ile ayarları sıfırlayabilirsiniz. Bot, Steam API ve Discord.js kullanarak çalışır. 🚗🎮

## Özellikler
- **Oyun Bilgisi**: `/oyun-bilgi` komutuyla bir oyunun fiyat, yapımcı, desteklenen diller ve Metascore bilgilerini renkli embed mesajlarıyla görün.
  - Fiyat
  - TL Fiyatı
  - Yapımcı
  - Desteklenen Diller
  - Metascore
- **İndirim Takibi**: Steam indirimlerini her 30 dakikada bir kontrol eder ve ayarlanan kanala bildirir.
- **Kolay Kurulum**: `/sistem-kur` ile indirim bildirim kanalını ayarlayın, `/sistem-sıfırla` ile sıfırlayın.

## Kurulum

### Gereksinimler
- **Node.js**: v18.20.8 veya üstü
- **npm**: v10.8.2 veya üstü
- **Discord Bot Token**: [Discord Developer Portal](https://discord.com/developers/applications) üzerinden alın.

### Adım Adım Kurulum
1. **Depoyu Klonlayın**:
   ```bash
   git clone https://github.com/Wasetrox/steam-bot
   cd steam-bot
   ```

2. **Bağımlılıkları Yükleyin**:
   ```bash
   modul.bat
   ```

3. **.env Dosyasını Oluşturun**:
   Proje kök dizininde `.env` adında bir dosya oluşturun ve şu bilgileri ekleyin:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   SES_ID=botun_gireceği_ses
   ```

4. **Botu Başlatın**:
   ```bash
   baslat.bat
   ```


### Proje Yapısı
```
Steam-Indirim-Bot/
├── src/
│   ├── commands/
│   │   ├── sistem-kur.js        # İndirim kanalı ayarlama komutu
│   │   ├── oyun-bilgi.js        # Oyun bilgisi gösterme komutu
│   │   ├── sistem-sıfırla.js    # İndirim sistemini sıfırlama komutu
│   ├── events/
│   │   ├── ready.js             # Bot hazır olduğunda çalışan olay
│   │   ├── interactionCreate.js # Komut etkileşimlerini işler
│   ├── data/
│   │   ├── discountChannel.json # İndirim kanalı ayarlarını depolar
├── wase.js                      # Botun ana dosyası
├── package.json                 # Proje bağımlılıkları
├── .env                         # Çevre değişkenleri (token ve API anahtarı)
├── node_modules/                # Bağımlılıklar
```

## Kullanım
Botu Discord sunucunuza ekledikten sonra şu komutları kullanabilirsiniz:
- **/oyun-bilgi [oyun adı veya App ID]**:
  - Örnek: `/oyun-bilgi Assetto Corsa` veya `/oyun-bilgi 244210`
  - Oyun bilgilerini renkli embed formatında gösterir.
- **/sistem-kur [kanal]**:
  - İndirim bildirimlerinin gönderileceği kanalı ayarlar (yönetici izni gerekir).
  - Örnek: `/sistem-kur #indirimler`
- **/sistem-sıfırla**:
  - İndirim sistemini sıfırlar (yönetici izni gerekir).

## Bağımlılıklar
- `discord.js`: ^14.16.3
- `axios`: ^1.7.7
- `rss-parser`: ^3.15.5
- `dotenv`: ^16.4.5

## Sorun Giderme
- **"Oyun bulunamadı!" Hatası**:
  - Oyun adını tam yazdığınızdan emin olun (örneğin, "Assetto Corsa").
  - Alternatif olarak Steam App ID kullanın (örneğin, `244210`).
- **Bağımlılık Sorunları**:
  ```bash
  npm install
  npm audit fix
  ```
- **Hata Mesajları**: Konsoldaki hata mesajlarını kontrol edin ve gerekirse destek için paylaşın.

## Proje Görüntüleme Sayısı

[![GitHub Views](https://komarev.com/ghpvc/?username=wasetrox&repo=discord-advanced-token-checker&label=Görüntüleme)](https://github.com/wasetrox/steam-bot)

## Lisans
Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

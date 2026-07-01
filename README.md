# Etkinlik Yonetim Sistemi

Etkinlikleri eklemek, filtrelemek ve kontenjan durumunu takip etmek icin hazirlanmis
tarayici tabanli bir yonetim paneli.

## Ozellikler

- Yeni etkinlik ekleme
- Kayit ve giris ekrani
- Ayrı admin ve kullanici girisi
- Admin icin etkinlik ekleme/silme yetkisi
- Kullanici icin etkinlikleri goruntuleme ve katilimci ekleme
- Sabit admin hesaplari: `admin@gmail.com` ve `admin1@gmail.com` / sifre `1234`
- Etkinlik kartlarinda gorsel kullanimi
- Etkinlik arama
- Kategori ve durum filtreleme
- Kontenjan ve katilimci takibi
- Katilimci ekleme
- Etkinlik silme
- Ozet istatistikler
- Open-Meteo API ile lokasyona gore hava durumu cekme
- Ticketmaster API ile sehre gore konser listeleme
- Konser kartlarinda API'den gelen etkinlik fotograflari
- Konser sonucunda gorsel yoksa otomatik yedek konser gorseli
- Konser kartlarinda fiyat bilgisi alani
- Liste sonucunda fiyat yoksa Ticketmaster detay endpoint'inden fiyat denemesi
- Konser tarihi icin hava durumu alani
- Biletix'e yonlendirmeden uygulama ici sepet arayuzu
- Sepette toplam fiyat hesaplama
- Kullaniciya API key gostermeden backend proxy ile konser arama
- Manifest, Melike Sahin ve benzeri sanatcilar icin hizli arama butonlari
- LocalStorage ile veri saklama
- Mobil uyumlu arayuz

## Kullanilan Teknolojiler

- HTML
- CSS
- JavaScript
- Node.js
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Ticketmaster Discovery API

## Calistirma

Projeyi indirdikten sonra klasore gir:

```bash
git clone https://github.com/ervasila/etkinlik_yonetim_sistemi.git
cd etkinlik_yonetim_sistemi
```

Ticketmaster API key'i ortam degiskeni olarak vererek calistir:

```bash
TICKETMASTER_API_KEY=api_key_buraya node server.js
```

Ya da `.env` dosyasi olustur:

```bash
cp .env.example .env
```

`.env` icine kendi key'ini yaz:

```text
TICKETMASTER_API_KEY=api_key_buraya
PORT=5174
```

Sonra normal calistir:

```bash
node server.js
```

Sonra tarayicida `http://localhost:5174` adresini ac.

API key sadece sunucuda tutulur. Kullanici uygulamada API key girmez.
Ornek ortam dosyasi icin `.env.example` dosyasina bakabilirsin.

## Klasor Yapisi

```text
etkinlik_yonetim_sistemi/
├── index.html
├── styles.css
├── script.js
├── server.js
├── .env.example
└── README.md
```

## Gelistirme Fikirleri

- Etkinlik duzenleme
- Katilimci listesi
- CSV disari aktarma
- Takvim gorunumu
- Konserleri tek tikla etkinlik listesine aktarma
- Kullanici girisi ve backend

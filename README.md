# Etkinlik Yonetim Sistemi

Etkinlikleri eklemek, filtrelemek ve kontenjan durumunu takip etmek icin hazirlanmis
tarayici tabanli bir yonetim paneli.

## Ozellikler

- Yeni etkinlik ekleme
- Etkinlik arama
- Kategori ve durum filtreleme
- Kontenjan ve katilimci takibi
- Katilimci ekleme
- Etkinlik silme
- Ozet istatistikler
- Open-Meteo API ile lokasyona gore hava durumu cekme
- Ticketmaster API ile sehre gore konser listeleme
- Konser kartlarinda API'den gelen etkinlik fotograflari
- Manifest, Melike Sahin ve benzeri sanatcilar icin hizli arama butonlari
- LocalStorage ile veri saklama
- Mobil uyumlu arayuz

## Kullanilan Teknolojiler

- HTML
- CSS
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Ticketmaster Discovery API

## Calistirma

Projeyi indirdikten sonra `index.html` dosyasini tarayicida acman yeterli.

```bash
git clone https://github.com/ervasila/etkinlik_yonetim_sistemi.git
cd etkinlik_yonetim_sistemi
```

Alternatif olarak yerel sunucu ile calistirabilirsin:

```bash
python3 -m http.server 5174
```

Sonra tarayicida `http://localhost:5174` adresini ac.

## Klasor Yapisi

```text
etkinlik_yonetim_sistemi/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Gelistirme Fikirleri

- Etkinlik duzenleme
- Katilimci listesi
- CSV disari aktarma
- Takvim gorunumu
- Konserleri tek tikla etkinlik listesine aktarma
- Kullanici girisi ve backend

# Harbie v3 — Güncel Durum

**Canlı:** https://ensarturkes.github.io/harbies-website/
**Repo:** github.com/ensarturkes/harbies-website (public, GitHub Pages, main/root)
**Yerel:** /Users/ensar/Desktop/Harbie · test sunucusu: `python3 scratchpad/nocache_server.py` → :8766

> **Not:** 20 Tem 01:00 civarı GitHub'da arıza vardı (Actions/Pages/API), `b53d65d`
> derlemesi "building"de takıldı. Canlı adres bir süre eski sürümü gösterdi.
> Kod GitHub'da eksiksiz; arıza geçince kendiliğinden yayına girer.

## Yapı
- `index.html` (hero + manifesto + slogan şeridi + karakter vitrini + lifestyle + SES + kurumsal şerit)
- `karakter-{muhendis,futbolcu,berber,itfaiyeci}.html` — sekmeli hikâye (Manifesto / Hatay / Gelişim)
- `hikayemiz.html`, `kurumsal.html` — editoryal düzen (gönderimsiz form)
- `css/`: tokens · base · components · pages
- `js/`: data · shell · scenes (vitrin) · ses · tabs · form · motion (GSAP) · yarn (iplik)
- `tools/knit-tile.py` — örgü kordon maskesi üreteci
- `assets/brand/` logo + favicon · `assets/v3/img/g/` ürün görselleri · `assets/v3/img/nav/` menü küçükleri
- `assets/v3/img2/web/*.jpg` (vitrin kareleri) · `assets/v3/video2/*.mp4` (4 video)

## Alınan kararlar
- **Vitrin:** tam ekran video, karakter sağda / metin solda, sol daraltılmış seçici, scroll ile tek tek değişir.
  Üst ve alt kenarda 120px geçiş katmanı (`.showcase-pin::before/::after`) → video zemine eriyor.
  1280px üstünde arayüz tam genişliğe alınır, liste sola yaslanır (`clamp(32px,5vw,104px)`).
- **İplik:** SVG döşeme + **mask-image**; renk `var(--accent)`'ten gelir, bölümün rengini alır.
  Üreteç `tools/knit-tile.py`. Gövde %18, ilmek/alt kenar %42 opaklık.
- **Logo:** gerçek logo nav (34px) + footer (48px) + favicon. Vektör hâli müşteriden istenecek.
- **Nav:** Koleksiyon üzerine gelince dört karakter açılır menüde (görsel + ad + sahne).
  Mobilde hamburger menüde girintili alt bağlantı.
- **İç sayfalar:** editoryal giriş + yapışkan etiketli metin + Vizyon/Misyon şeridi + numaralı kartlar.
- Hareket scroll'a bağlı; dekoratif öğede sonsuz döngü yok.
- Satış Shopify'da (`shop.harbies.com` — adres teyit edilmedi).

## docx denetimi
33 metin parçası tek tek kontrol edildi, hepsi yerinde. Sonradan eklenenler:
destekleyici sloganlar (manifesto altı şerit) ve B2B form giriş metni.
Tek bilinçli sapma: docx "hikayene/Hikayemiz", sitede şapkalı "hikâyene/Hikâyemiz".
Kurumsal çözüm kartlarının birer cümlelik açıklamaları docx listesinden yeniden yazıldı.

## Higgsfield kotası
**472 kredi kaldı** (plus). 4K görsel = 4 kredi/adet — ucuz. Videolar pahalı, kotayı onlar yiyor.
Karakter ürün görselleri 4K'dan yeniden üretildi (16 kredi), mevcut kareler referans verilerek
karakter kimliği korundu.

## Açık işler
1. Hero başlığı 3 satıra iniyor — 2 satıra sabitlensin mi?
2. İtfaiyeci videosunun son karesi poster ile tam örtüşmüyor; mühendis videosunda vinç ortada değişiyor.
   Düzeltmek video kredisi ister — kullanıcıyla konuşulacak.
3. Çok geniş ekranda nav logosu (1200px kapsayıcı) ile vitrin listesi (5vw) aynı hizada değil.
   Bilinçli; rahatsız ederse nav da aynı boşluğa alınır.
4. Ayırıcıda berber pembesi en açık ton, o bölümde şerit soluk kalıyor.
5. Sekme metinleri taslak — müşteri revize edecek.
6. Logonun vektör hâli (SVG/AI/EPS) gerekli: favicon için yıldızı temiz çıkarmak ve keskinlik için.

## Ortam notu — iCloud
Proje iCloud Drive'da. "Mac Depolamayı Optimize Et" büyük dosyaların içeriğini buluta atıyor;
dosya boyutu görünür ama okuma boş döner, `git status` kilitlenir.
Teşhis: `stat -f "%Sf" dosya` → `dataless` bayrağı ve `%b` blok sayısı 0.
Çözüm: `brctl download <yol>`. Dosya bozuk değildir, sadece inmemiştir.

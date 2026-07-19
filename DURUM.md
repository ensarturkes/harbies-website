# Harbie v3 — Güncel Durum (compact öncesi not)

**Canlı:** https://ensarturkes.github.io/harbies-website/
**Repo:** github.com/ensarturkes/harbies-website (public, GitHub Pages, main/root)
**Yerel:** /Users/ensar/Desktop/Harbie · test sunucusu: `python3 scratchpad/nocache_server.py` → :8766

## Yapı
- `index.html` (hero + manifesto + karakter vitrini + lifestyle + SES + kurumsal şerit)
- `karakter-{muhendis,futbolcu,berber,itfaiyeci}.html` — sekmeli hikâye (Manifesto / Hatay / Gelişim)
- `hikayemiz.html`, `kurumsal.html` (gönderimsiz form)
- `css/`: tokens · base · components · pages
- `js/`: data (karakter verisi tek kaynak) · shell · scenes (vitrin) · ses · tabs · form · motion (GSAP) · yarn (iplik)
- `assets/v3/img2/web/*.jpg` (8 kare, karakter SAĞDA) · `assets/v3/video2/*.mp4` (4 video, sağdan giriş)
- Eski/yedek: `assets/v3/img`, `assets/v3/video`, `_legacy/`

## Alınan kararlar
- Karakter vitrini: tam ekran video, **karakter sağda / metin solda**, sol daraltılmış seçici (132px), scroll ile tek tek değişir, tıklanabilir.
- Perde: **krem gradyan + koyu mürekkep** (siyah karartma reddedildi — marka pastel).
- Hero: `.container` flex büzülme hatası düzeltildi; giriş animasyonu **CSS** (`heroRise`, fill-mode:both).
- Hareket: GSAP scroll'a bağlı; dekoratif öğede **sonsuz döngü yok** (UI-UX Pro Max kuralı).
- Tipografi: 9 token boyut, 12px altı yok. Dokunma hedefleri ≥44px.
- Satış Shopify'da (`shop.harbies.com` — adres teyit edilmedi).
- **Yeni AI görsel/video ÜRETİLMEYECEK** — aylık kota yarılandı, kalan ~488 kredi.

## Açık işler
1. **İplik görünümü** — kullanıcı örgülü/saç örgüsü dokulu kordon referansı verdi (pembe, V şeklinde ilmekler).
   Şu anki hâl: `css/components.css` içinde `.knit-divider` → SVG data-URI döşeme (240x44, bükümlü kordon).
   Yapılacak: örgü dokusunu birebir yakalamak (bkz. aşağıdaki yöntem).
2. Hero başlığı 3 satıra iniyor — 2 satıra sabitlensin mi?
3. İtfaiyeci videosu son karesi poster ile tam örtüşmüyor (küçük sıçrama).
4. Mühendis videosunda vinç tasarımı ortada değişiyor.
5. Sekme metinleri taslak — müşteri revize edecek.

## İplik için planlanan yöntem
Saf CSS gradyanla örgü dokusu yapılamaz. Yöntem: **SVG döşeme, örgü segmentleri hesaplanarak**.
Python ile sinüs dalgası örneklenip, dalga boyunca eğimi dönüşümlü ("/ \ / \") küçük yuvarlatılmış
ilmek şekilleri yerleştirilir; üstüne açık ışık + koyu gölge katmanı. Tek periyot döşeme olarak
`background-repeat:repeat-x` ile yatayda kesintisiz tekrarlanır — her ekran genişliğinde kalınlık sabit.

# Harbie — Amigurumi Dünyası Web Sitesi (v3) — Tasarım Spec'i

**Tarih:** 17 Temmuz 2026
**Durum:** Onay bekliyor
**Amaç:** Müşteri ile ilk toplantıya götürülecek, fikri satan çalışır site.

---

## 1. Bağlam

Harbie, Kadın Dostu Markalar Platformu'nun (KDM) Hatay'da doğan sosyal girişimi. %100 pamuk, el yapımı amigurumi bebekler; "İyiliğe Bir İlmek" atölyelerinde kadınlar tarafından üretiliyor. Manifesto: **"Mesleklerin cinsiyeti yoktur."** Lansman karakterleri: Mühendis, Futbolcu, Berber, İtfaiyeci.

Elimizde iki eski kuşak var (`index.html` + `styles.css` = v1; `index-v2.html` + `refresh.css` = v2). Bu spec üçüncü kuşağı (v3) tanımlıyor.

### Fikrin kaynağı

Müşterinin `HARBİE WEB İÇERİK.docx` dosyası, tasarım rehberi bölümünde şunu istiyor:

> "Harbie'lerin tıpkı lego city gibi bir iplik ve amigurumi cumhuriyetinde olduğu hissi alması önemli, Harbie Vinç Operatörü ve amigurumi vinç… mesela, veya Harbie mühendis ile amigurumi inşaat sahası, futbolcu, berber, itfaiyeci aynı şekilde."

Bu spec'in getirdiği özgün katkı: **müşterinin statik istediği bu dünyayı hareketlendirmek.** Her karakter kendi sahnesinde bir aksiyon yapar (itfaiyeci yangını söndürür, futbolcu gol atar), video biter, kare donar, hikâyesi yanında belirir.

Toplantıdaki konumlandırma: *"Siz iplik cumhuriyeti dediniz — biz onu yaşayan hâle getirdik."*

---

## 2. Kapsam

### Dahil

- Ana sayfa (hero dünya videosu + 4 karakter bölümü + lifestyle + SES + kurumsal şerit)
- Karakter sayfası × 4 (tek şablon, dört içerik)
- Hikâyemiz sayfası (Hakkımızda / Vizyon / Misyon / Değerlerimiz)
- Kurumsal sayfası (B2B metni + iş birliği talep formu)
- 5 adet AI video (1 hero + 4 karakter aksiyonu)
- 12 adet yeni AI görsel (5 klibin başlangıç/bitiş kareleri = 10, + 2 lifestyle)
- Sekme metinlerinin taslak yazımı (Hatay hikâyesi, gelişim katkısı)

### Hariç

- **E-ticaret.** Sepet, ödeme, varyant, Apple Pay, checkout — hiçbiri. Satış `shop.harbies.com` üzerinde Shopify'da. Sitedeki tüm satın alma yolları tek bir dış linke çıkar.
- Galeri sayfası (`Harbie Görseller.html`) — iç çalışma dosyası, siteye ait değil.
- CMS, backend, form gönderim altyapısı (form arayüzü var, bağlanacağı servis toplantı sonrası).
- Tweaks paneli (React/Babel/unpkg) — kaldırılıyor.
- Çoklu dil.

---

## 3. Alınan kararlar

| # | Karar | Gerekçe |
|---|---|---|
| K1 | **Hibrit akış:** hero'da geniş plan dünya videosu, altında her karakter kendi scroll bölümünde | Hem ilk saniyede "vay" etkisi, hem kullanıcıya kontrol |
| K2 | **Dünya = "ortada buluşma"** — dört ayrı sahne, ortak arka plan diliyle aynı kasabanın parçası olduğu ima edilir | Tek tutarlı kasaba haritası (Lego City) üretmek en riskli; bu, hissi %90 verir riskin %20'siyle. 5. karakter geldiğinde mahalle eklenebilir |
| K3 | **Hero düzeni B:** video tam ekran, kompozisyon sağa kaymış, solda metin | Tam ekran videonun etkisi + okunurluk; mobilde metin videonun altına iner, düzen korunur |
| K4 | **Görsel yön: Galeri + karakter rengi vurgusu** | Zemin temiz beyaz (docx: "temiz beyaz alanlar bol kullanılmalı"); dioramalar zaten çok renkli, zemini de boyamak birbirini yer. Karakter rengi bölüm numarası, düğme ve sahne kartı altındaki ince çizgide yaşar — renk değişir, sayfayı ele geçirmez |
| K5 | **Hikâye bizde, satış Shopify'da** | Shopify'ın ürün şablonu fiyat/varyant için tasarlanmış, "Hatay'da bu bebeği ören kadının hikâyesi" için değil. Hikâye markanın farkı; kiracı olunan platforma teslim edilmez. SEO'nun değerli kısmı kendi alan adında kalır |
| K6 | **Sıfırdan v3** | v1+v2 üst üste binmiş iki kuşak (41 KB CSS), seçilen yön ikisinden de farklı. Üçüncü katman atmak temizlemekten uzun sürer |
| K7 | **Videolar sessiz** | Tarayıcılar sesli otomatik oynatmayı engelliyor; sesli video ya sessiz başlar (ses boşa üretilmiş olur) ya kullanıcıyı tıklamaya zorlar |
| K8 | **Mevcut dioramalar korunur, yenileri üretilir** | Yeniler aksiyona göre komponize edilecek ve 16:9 olacak; eskiler yedek olarak durur, üretim aksarsa toplantıya elimiz boş gitmeyiz |

---

## 4. Site haritası

**Menü:** Koleksiyon · Hikâyemiz · Kurumsal · Sosyal Etki Sayacı · **Mağaza ↗**

`Mağaza` dış linktir (`shop.harbies.com`, yeni sekme), ok işaretiyle belirtilir — kullanıcı siteden çıktığını bilmeli.

| Sayfa | Dosya | İçerik kaynağı |
|---|---|---|
| Ana sayfa | `index.html` | docx §1, §3 (koleksiyon girişi), SES, B2B özeti |
| Karakter × 4 | `karakter-{slug}.html` | docx §3 ürün metinleri + yeni taslak sekme metinleri |
| Hikâyemiz | `hikayemiz.html` | docx §2 (Hakkımızda, Vizyon, Misyon, Değerlerimiz) |
| Kurumsal | `kurumsal.html` | docx §"Kurumsal İş Birlikleri ve B2B" + form |

Karakter slug'ları: `muhendis`, `futbolcu`, `berber`, `itfaiyeci`.

---

## 5. Ana sayfa akışı

1. **Hero** — kasaba meydanı videosu (4 Harbie bir arada). Solda: *"Mesleklerin cinsiyeti yoktur. / Harbie ile hikâyene başla…"* + üst etiket "HATAY'DAN, EL EMEĞİYLE" + iki düğme (Koleksiyonu keşfet / Hikâyemiz). Düzen K3.
2. **Giriş manifestosu** — docx'in *"Çocuklar dünyaya sınırsız bir potansiyelle gelir…"* paragrafı. Tek sütun, sakin, geniş nefes alanı.
   *Gerekçe:* hero videosundan doğrudan dört videoya girmek izleyiciyi yorar; bu blok o nefesi verir.
3. **"Geleceğin Eşitlik Elçileri ile Tanışın"** — bölüm başlığı + docx'in *"Ebeveynlerin %65'i…"* giriş metni. Ardından dört karakter bölümü, her biri tam ekran:
   - Sıra: **Mühendis → Futbolcu → Berber → İtfaiyeci**
   - *Gerekçe:* docx'teki listeleme sırası; mühendis "inşa etmek" metaforuyla markaya en yakın açılış, itfaiyeci en güçlü aksiyon olarak final
   - Kenarlar dönüşümlü (mühendis solda, futbolcu sağda, berber solda, itfaiyeci sağda) — ritim monotonlaşmasın
   - Her bölüm: video oynar → son karede donar → metin belirir (kicker + motto + açıklama + "Hikâyesini oku" → karakter sayfası)
4. **Oyun Arkadaşı** — lifestyle bölümü. Çocukların Harbie'yi kucakladığı / birlikte maç yaptığı fotoğraflar. docx bunu açıkça istiyor.
5. **Sosyal Etki Sayacı (SES)** — docx metni + canlı sayaç. Mevcut `app.js`'teki localStorage mantığı taşınır.
6. **Kurumsal şerit** — B2B metninin kısaltılmış hâli + "Kurumsal iş birliği" düğmesi → `kurumsal.html`.
7. **Footer** — logo, menü, Hatay/KDM künyesi, sosyal medya.

---

## 6. Karakter sayfası şablonu

Tek şablon, dört içerik. docx'in tarifi birebir uygulanır.

- **Üst:** o karakterin videosu (ana sayfadaki bölümün devamı hissi)
- **Orta, iki sütun:**
  - **Sol:** ürün fotoğrafı + küçük galeri
  - **Sağ:** üç sekme
    1. *Manifestosu* — motto + docx açıklaması
    2. *Hatay'daki Hikâyesi* — bu bebeği ören kadınlar, İyiliğe Bir İlmek atölyeleri **(taslak yazılacak)**
    3. *Çocuk Gelişimine Katkısı* — **(taslak yazılacak)**
- **Alt:** ürün künyesi (%100 pamuk, anti-alerjik, ölçü) + tek **"Satın Al ↗"** düğmesi → `shop.harbies.com`

Sekme metinleri taslak olarak yazılır ve dolu görünür; müşteri revize eder. Yer tutucu (lorem/TBD) bırakılmaz.

### Karakter verisi

| Karakter | Motto (docx) | Vurgu rengi |
|---|---|---|
| Mühendis | "Geleceği ve hayallerini inşa edecek güç senin içinde." | Hardal / kehribar |
| Futbolcu | "Saha da bizim, gelecek de bizim!" | Mavi |
| Berber | "Yaratıcılığın ve emeğin cinsiyeti olmaz." | Pudra pembe |
| İtfaiyeci | "Geleceği cesaretle ve eşitlikle inşa ediyoruz." | Kırmızı |

*Not:* Mühendis bebeğin kıyafeti mavi (futbolcu ile çakışıyor); vurgu rengi bu yüzden baretinden/alet çantasından gelen hardal/kehribar tonundan alınır.

---

## 7. Görsel dil

- **Zemin:** temiz beyaz / kırık beyaz. Bol boşluk.
- **Sahneler:** yuvarlatılmış köşeli kartlar, yumuşak gölge — "sergilenen eser" hissi.
- **Vurgu:** karakter rengi yalnızca kicker, düğme ve kart altı çizgisinde.
- **Tipografi:** serif başlık (manifesto ağırlığı) + sans gövde. Mevcut Newsreader + Nunito Sans eşleşmesi korunabilir.
- **Doku:** örgü/ilmek dokusu yalnızca ayırıcılarda ve footer'da, çok hafif. docx "arka planlarda hafif amigurumi örgü çizgileri" diyor — abartılırsa premium his gider.

---

## 8. Video üretim hattı

### Model

**Seedance 2.0** (Bytedance), `mode: std`, `resolution: 1080p`, `generate_audio: false`, `duration: 5`, `aspect_ratio: 16:9`.

Seçim gerekçesi: kimlik tutarlılığı için tasarlanmış, referans görsel alıyor, 1080p/4K veriyor ve **hem başlangıç hem bitiş karesi** (`start_image` + `end_image`) kabul ediyor.

### Çift kare tekniği (kurgunun teknik temeli)

Her klip için **iki kare** üretilir:

1. **Aksiyon başı** — itfaiyeci hortumu kaldırmış, alev büyük
2. **Aksiyon sonu** — alev sönmüş, itfaiyeci duruyor; yerleşim metne yer bırakacak şekilde (karakter bir tarafta, karşı taraf boş)

İkisi `start_image` / `end_image` olarak modele verilir, arası doldurulur.

**Sonuç:** videonun son karesi, bölümün donmuş karesiyle **birebir aynı** — çünkü onu biz belirledik. Video biter, sayfa donar, metin gelir; zıplama olmaz. Tahmine dayalı değil, deterministik. Aynı kare `poster` olarak da kullanılır.

### Karakter tutarlılığı

Gerçek ürün fotoğrafları (`assets/products/*.jpg`, `assets/clean/*.png`) higgsfield'a **karakter referansı** olarak verilir. Mevcut AI dioramaların gerçek ürüne sadakati (bkz. `itfaiyeci-diorama.png` ↔ `products/itfaiyeci.jpg`) bu yolun çalıştığının kanıtı.

Üçüncü parti storyboard/karakter-kilitleme skill'i **kullanılmıyor** — o pipeline'ların çözdüğü problem (karakterin nasıl göründüğüne dair referans yokluğu) bizde mevcut değil.

### Üretim listesi

**Görseller (12):** Her klip 2 kare gerektirir (§8 çift kare tekniği), yani 5 klip × 2 = **10 sahne karesi**, + **2 lifestyle** = 12.

- Hero: kasaba meydanı, başlangıç ve bitiş karesi (kamera süzülmesinin iki ucu). Ortak dünya dilini kuran kurulum planı.
- Karakter × 4: aksiyon başı + aksiyon sonu.
- Lifestyle × 2: çocuk + Harbie (kucakta, maçta). Bunlar video değil, tek kare.

Sahne kareleri 16:9 ve ortak arka plan dilinde (aynı örgü tepeler, aynı ağaçlar, aynı ışık yönü) — K2'yi görsel olarak bu ortaklık kurar.

**Videolar (5):**

| Klip | Aksiyon |
|---|---|
| Hero | Kasaba meydanı, kamera yavaş süzülür, dört Harbie kendi mahallelerinde |
| Mühendis | Vinç bir örgü kirişi yerine indirir, mühendis planı işaretler |
| Futbolcu | Topa vurur, örgü ağlar dalgalanır |
| Berber | Makas çalışır, bir tutam örgü saç düşer |
| İtfaiyeci | Hortumdan su yayı çıkar, keçe alev küçülür, duman tüter |

### Kalite güvencesi

Her klip için **en az 2-3 deneme**, en iyisi seçilir. Video üretimi **ilk iş olarak** başlar ve sayfa geliştirmesiyle paralel döner — en uzun bacak bu.

---

## 9. Teknik temel

- **Saf HTML/CSS/JS.** Framework yok, build adımı yok. Mevcut yaklaşımın devamı.
- **Tweaks paneli kaldırılır** (React + Babel + unpkg ≈ 300 KB). Müşteri toplantısında canlı sitede geliştirici paneli olmaz.
- **Dosya yapısı:**
  ```
  index.html, karakter-{slug}.html ×4, hikayemiz.html, kurumsal.html
  css/  → tokens.css, base.css, sahne.css, sayfa.css
  js/   → sahne.js (IntersectionObserver + video), ses.js (sayaç), menu.js
  assets/v3/ → yeni görseller ve videolar
  ```
- **Eski dosyalar silinmez**, referans olarak durur.
- Taşınan varlıklar: metin içeriği, SES sayacı mantığı, karakter verisi, mevcut ürün fotoğrafları.

### Performans ("premium = hızlı")

Beş adet 1080p video ciddi ağırlık. Kurallar:

- Hiçbir video **preload edilmez** (`preload="none"`).
- Her video ekrana girince başlar (IntersectionObserver), çıkınca durur.
- `poster` = o klibin son karesi (§8'deki aksiyon sonu görseli).
- **Mobilde otomatik oynatma kapalı** — poster görünür, dokununca oynar. docx: ziyaretçilerin %80'i mobil; 20 MB video indirtmeyiz.
  *Bu davranış tek bayrakla açılıp kapanabilecek şekilde kurulur; müşteri toplantısında canlı gösterilip karar verilecek.*
- `prefers-reduced-motion` açık kullanıcılara statik kareler.
- Videolar `muted playsinline` — sessiz oynatma politikası (K7).

---

## 10. İçerik eşlemesi (docx → site)

| docx bölümü | Nereye |
|---|---|
| §1 Ana slogan + destekleyici sloganlar | Hero |
| §1 Giriş paragrafı | Ana sayfa, manifesto bloğu (§5.2) |
| §2 Hakkımızda / Vizyon / Misyon | `hikayemiz.html` |
| §2 Değerlerimiz (4 madde) | `hikayemiz.html` + ana sayfada kısaltılmış |
| §3 "Geleceğin Eşitlik Elçileri ile Tanışın" + giriş | Ana sayfa, koleksiyon başlığı (§5.3) |
| §3 Ürün metinleri (motto + açıklama) | Karakter bölümleri + karakter sayfaları |
| B2B metni | `kurumsal.html` + ana sayfa şeridi |
| SES metni | Ana sayfa SES bölümü |
| Tasarım rehberi (renk, doku, foto stili) | §7 Görsel dil, §8 Video hattı |
| Mobil öncelikli tasarım | §9 Performans |
| Hikâye odaklı ürün sayfaları | §6 Karakter sayfası şablonu |

**Not:** docx'in e-ticaret/ödeme maddeleri (Apple Pay, tek tıkla ödeme, sepet akışı) kapsam dışıdır — Shopify karşılar (K5).

---

## 11. Riskler ve yedek planlar

| Risk | Yedek plan |
|---|---|
| Bir klip beklentiyi karşılamaz | O bölüm son kareyle (statik) yayına girer. Site tasarımı zaten o kareyle çalışacak şekilde kurulu — video bir *katman*, bağımlılık değil |
| Yeni görseller mevcut dioramalar kadar iyi çıkmaz | Mevcut dioramalar korunuyor; 16:9'a kırpılıp kullanılır |
| Kasaba meydanı sahnesi tutmaz | Hero, mevcut `hero.png` benzeri grup karesiyle kurulur; K2'nin ortak dil bağı zayıflar ama akış bozulmaz |
| Video üretimi toplantıya yetişmez | Sayfalar posterlerle tam çalışır durumda; videolar geldikçe eklenir |

---

## 12. Açık uçlar

- **Mobil otomatik oynatma:** varsayılan kapalı; müşteri toplantısında canlı değerlendirilecek (§9).
- **Form gönderim hedefi:** Kurumsal formun bağlanacağı servis toplantı sonrası belirlenecek; arayüz hazır olacak.
- **`shop.harbies.com` URL'i** varsayımdır; kesin alan adı müşteriden teyit edilecek.
- **Sekme metinleri** taslaktır; müşteri revize edecek.

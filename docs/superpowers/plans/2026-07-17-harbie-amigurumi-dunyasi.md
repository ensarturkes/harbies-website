# Harbie Amigurumi Dünyası (v3) — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Müşteri toplantısına götürülecek, amigurumi dünyasını hareketle sunan premium tanıtım sitesi (ana sayfa + 4 karakter sayfası + Hikâyemiz + Kurumsal) inşa etmek.

**Architecture:** Saf statik HTML/CSS/JS, build adımı yok. Paylaşılan kabuk (nav/footer) her sayfada tekrarlanır; tek bir tekrar kullanılabilir "sahne" bileşeni hem ana sayfa karakter bölümlerini hem karakter sayfası başlıklarını besler. Hareket katmanı GSAP + ScrollTrigger ile progressive enhancement olarak eklenir — içerik animasyonsuz da tam çalışır. AI görsel/video varlıkları ayrı bir üretim hattında paralel üretilir ve `assets/v3/` altına düşer.

**Tech Stack:** HTML5, CSS (custom properties, katmanlı: tokens/base/components/pages), vanilla JS (ES5 uyumlu, mevcut kod stiliyle), GSAP 3 + ScrollTrigger (CDN veya yerel), Seedance 2.0 (higgsfield MCP) video üretimi.

## Global Constraints

- **Framework yok, build adımı yok.** Doğrudan tarayıcıda açılan dosyalar (K6).
- **Tweaks paneli kaldırılır** — hiçbir sayfaya React/Babel/unpkg yüklenmez.
- **Videolar sessiz:** tüm `<video>` etiketleri `muted playsinline preload="none"` (K7).
- **Mobilde otomatik oynatma kapalı**, tek bir JS bayrağıyla açılabilir (`AUTOPLAY_MOBILE = false`).
- **`prefers-reduced-motion` mutlak saygı:** açıkken tüm GSAP hareketi ve video otomatik oynatması kapanır, statik poster kalır.
- **Scroll hijack yok** — hiçbir animasyon kullanıcının kaydırmasını bloke etmez veya yavaşlatmaz.
- **Metin animasyonsuz okunabilir** olmalı — animasyon opaklığı asla içeriği kalıcı gizlemez.
- **Tüm satın alma yolları** tek dış linke çıkar: `https://shop.harbies.com` (varsayım, teyit bekliyor), `target="_blank" rel="noopener"`.
- **Dil: Türkçe.** Tüm arayüz metni ve içerik docx'ten birebir.
- **Karakter slug'ları:** `muhendis`, `futbolcu`, `berber`, `itfaiyeci`.
- **Vurgu renkleri:** mühendis `--k-muhendis` (hardal/kehribar), futbolcu `--k-futbolcu` (mavi), berber `--k-berber` (pudra), itfaiyeci `--k-itfaiyeci` (kırmızı).
- **Karakter sırası (ana sayfa):** Mühendis → Futbolcu → Berber → İtfaiyeci.
- **Doğrulama tarayıcıda:** test koşucusu yok; her task sonunda ilgili sayfa mcp__Claude_Browser ile açılıp davranış gözlenir (render, scroll, video, responsive, konsol hatasız).
- **Eski dosyalar silinmez** (`index.html`, `index-v2.html`, `styles.css`, `refresh.css`, `app.js`, vb. referans kalır). Yeni site `index.html`'i **yeniden yazar** — eski ana sayfa `_legacy/` altına taşınır.

---

## Dosya yapısı

```
index.html                     # Yeni ana sayfa (eski → _legacy/index-v1.html)
karakter-muhendis.html         # 4 karakter sayfası, tek şablonun örnekleri
karakter-futbolcu.html
karakter-berber.html
karakter-itfaiyeci.html
hikayemiz.html
kurumsal.html
css/
  tokens.css                   # Renk, tipografi, boşluk, vurgu renkleri
  base.css                     # Reset, tipografi, buton, container, nav, footer
  components.css               # Sahne bileşeni, SES, form, kartlar, ayırıcılar
  pages.css                    # Sayfaya özel düzenler (hero, karakter sayfası ızgarası)
js/
  shell.js                     # Nav/mobil menü + yıl + paylaşılan davranış
  ses.js                       # Sosyal Etki Sayacı (mevcut app.js'ten taşınır)
  scenes.js                    # Video lazy-load + IntersectionObserver oynatma
  motion.js                    # GSAP + ScrollTrigger hareket katmanı (progressive)
  data.js                      # Karakter verisi (tek kaynak) — sayfalarca okunur
assets/v3/
  img/                         # Üretilen sahne kareleri + lifestyle
  video/                       # Üretilen 5 klip
partials/                      # (Referans; build yok, elle kopyalanan nav/footer HTML)
scripts/
  gen-assets.md                # Görsel/video üretim reçetesi (prompt'lar, kayıt)
_legacy/                       # Eski v1/v2 dosyaları
```

**Bileşen sınırları:**
- `scenes.js` yalnızca "video görününce oynat, çıkınca durdur, posteri koru" işini bilir. GSAP'ten habersiz.
- `motion.js` yalnızca GSAP zaman çizelgelerini bilir; yoksa (CDN düşerse) site statik ama tam çalışır.
- `data.js` karakter gerçeğinin tek kaynağı; hiçbir metin HTML'e ikinci kez elle yazılmaz (DRY).

---

## Faz 0 — Varlık üretim hattı (paralel başlar, en uzun bacak)

> Bu faz sayfa fazlarından **bağımsız** ilerler. İlk iş olarak başlatılır; sayfalar posterlerle çalışır, videolar geldikçe eklenir. Üretim MCP çağrıları uzun sürer — her task bir kararla biter, beklerken diğer fazlar ilerler.

### Task 0.1: Karakter referanslarını ve üretim reçetesini hazırla

**Files:**
- Create: `scripts/gen-assets.md`

**Interfaces:**
- Produces: Her varlık için nihai dosya adı ve prompt. Sonraki task'lar bu adlara yazar/okur.

- [ ] **Step 1: Referans görselleri doğrula**

Mevcut `assets/products/{muhendis,futbolcu,berber,itfaiyeci}.jpg` ve `assets/clean/*.png` karakter referansı olacak. Her birini Read ile aç, karakterin net göründüğünü onayla.

- [ ] **Step 2: Reçeteyi yaz**

`scripts/gen-assets.md` içine her varlığın kaydını yaz. Ortak dünya dili cümlesi (her prompt'a eklenir):

```
Shared world grammar (append to every scene prompt):
"handmade crochet amigurumi world, soft knitted rolling hills and yarn-ball
trees in the background, warm natural side light from the left, clean
off-white studio floor, premium toy photography, shallow depth of field,
no text, no human hands"
```

Varlık tablosu (12 görsel + 5 video):

| Dosya | Tür | İçerik |
|---|---|---|
| `img/hero-a.png` | kare | Kasaba meydanı, 4 Harbie kendi mahallelerinde, geniş plan, kamera yüksekte |
| `img/hero-b.png` | kare | Aynı meydan, kamera hafif alçalmış/yakınlaşmış (süzülmenin bitişi) |
| `img/muhendis-a.png` | kare | Mühendis vinç kolunda, örgü kiriş havada, inşaat sahası |
| `img/muhendis-b.png` | kare | Kiriş yerine oturmuş, mühendis planı işaretliyor, sağda dururken sol boş |
| `img/futbolcu-a.png` | kare | Futbolcu topa vurmaya hazır, örgü kale arkada |
| `img/futbolcu-b.png` | kare | Top ağda, ağ dalgalı, futbolcu solda dururken sağ boş |
| `img/berber-a.png` | kare | Berber makası açık, müşteri koltukta |
| `img/berber-b.png` | kare | Makas kapanmış, bir tutam örgü saç havada, sağda dururken sol boş |
| `img/itfaiyeci-a.png` | kare | İtfaiyeci hortumu kaldırmış, keçe alev büyük |
| `img/itfaiyeci-b.png` | kare | Alev sönmüş/küçük, duman tütüyor, itfaiyeci sağda dururken sol boş |
| `img/lifestyle-kucak.png` | kare | Çocuk Harbie'yi kucaklıyor (mevcut `assets/gen/lifestyle-kucak.png` yeniden veya iyileştirilerek) |
| `img/lifestyle-mac.png` | kare | Çocuklar Harbie'lerle maç yapıyor |
| `video/hero.mp4` | video | hero-a → hero-b, kamera süzülür |
| `video/muhendis.mp4` | video | muhendis-a → muhendis-b |
| `video/futbolcu.mp4` | video | futbolcu-a → futbolcu-b |
| `video/berber.mp4` | video | berber-a → berber-b |
| `video/itfaiyeci.mp4` | video | itfaiyeci-a → itfaiyeci-b |

**Kritik kural:** her `-b` karesinde karakter bir yana yaslanır, karşı taraf boş kalır (metin oraya gelecek). Ana sayfa kenar dönüşümüne uyacak: muhendis-b sağ dolu (metin solda değil — bkz. düzen), futbolcu-b sol dolu... **Kenar eşlemesi Task 2.4'te kesinleşir; şimdilik her -b için "karakter bir yanda, diğer yan boş" yeterli.**

- [ ] **Step 3: Kaydet ve karar**

Reçete tamamlandı. Sonraki task'lar bu tabloyu kaynak alır. Commit:
```bash
git add scripts/gen-assets.md && git commit -m "docs: varlık üretim reçetesi"
```

### Task 0.2: Sahne karelerini üret (12 görsel)

**Files:**
- Create: `assets/v3/img/*.png` (yukarıdaki tablo)

**Interfaces:**
- Consumes: `scripts/gen-assets.md` prompt'ları, `assets/products/*.jpg` referansları.
- Produces: 12 PNG, 16:9, sayfaların `poster` ve statik fallback'i.

- [ ] **Step 1: higgsfield bakiyesini ve modeli doğrula**

`mcp__higgsfield__balance` ile kredi kontrol. `models_explore get` ile `seedance_2_0`'ın görsel üretmediğini teyit et — görseller için `generate_image` kullanılır (referans destekli model). Uygun image modelini `models_explore recommend` ile seç (referans görsel + amigurumi ürün fotoğrafı bağlamı).

- [ ] **Step 2: Her karakter için A ve B karesini üret**

Her çağrıda: karakter referansı olarak `assets/products/<slug>.jpg`, prompt = aksiyon + ortak dünya dili, aspect 16:9. Önce 4 karakterin A karesi, onaylanınca B kareleri. Diorama tutarlılığı için A ve B aynı sahne kurulumunu paylaşmalı.

- [ ] **Step 3: Hero A/B ve lifestyle üret**

Hero: 4 karakteri birlikte referansla (grup). Lifestyle: mevcut `assets/gen/lifestyle-*.png` yeterince iyiyse yeniden üretme — Read ile bak, karar ver, gerekirse yeniden üret.

- [ ] **Step 4: İndir ve yerleştir**

Üretilenleri `creations_show`/`creations_get` ile al, `assets/v3/img/` altına doğru adlarla kaydet. Her birini Read ile aç, kaliteyi ve karakter tutarlılığını gözle onayla. Zayıf çıkanları yeniden üret (en az 2 deneme).

- [ ] **Step 5: Commit**
```bash
git add assets/v3/img && git commit -m "assets: v3 sahne kareleri ve lifestyle görselleri"
```

### Task 0.3: 5 videoyu üret

**Files:**
- Create: `assets/v3/video/*.mp4`

**Interfaces:**
- Consumes: Task 0.2'nin A/B kareleri (start_image / end_image).
- Produces: 5 MP4, poster'ı kendi `-b` karesi.

- [ ] **Step 1: Bir klip üret (pilot: itfaiyeci)**

`mcp__higgsfield__generate_video`, model `seedance_2_0`, `start_image=itfaiyeci-a`, `end_image=itfaiyeci-b`, `mode=std`, `resolution=1080p`, `generate_audio=false`, `duration=5`, `aspect_ratio=16:9`. En güçlü aksiyon olduğu için pilot bu — kalite çıtasını burada gör.

- [ ] **Step 2: İndir ve gözle doğrula**

Klibi al, `assets/v3/video/itfaiyeci.mp4` olarak kaydet. Tarayıcıda aç: son kare `-b` karesiyle örtüşüyor mu? Aksiyon inandırıcı mı? Değilse prompt/kare ayarla, tekrar üret.

- [ ] **Step 3: Kalan 4 klibi üret**

Pilot çıtayı geçince hero, muhendis, futbolcu, berber. Her biri için en az 2-3 deneme, en iyisi seçilir.

- [ ] **Step 4: Boyut kontrolü ve commit**

Her MP4 boyutunu kontrol et (`ls -la`). Toplam > 40 MB ise deploy fazında (Faz 6) git yerine harici barınak notu geçerli. Commit:
```bash
git add assets/v3/video && git commit -m "assets: v3 karakter aksiyon videoları"
```

---

## Faz 1 — Temel: tokenlar, kabuk, taşınan mantık

### Task 1.1: Eski ana sayfayı arşivle, dizin iskeletini kur

**Files:**
- Create: `_legacy/` (taşıma), `css/`, `js/`, `assets/v3/` dizinleri
- Modify: taşımalar

- [ ] **Step 1: Eski ana sayfayı taşı**
```bash
mkdir -p _legacy css js assets/v3/img assets/v3/video
git mv index.html _legacy/index-v1.html
git mv index-v2.html _legacy/index-v2.html
```
(Diğer eski dosyalar `styles.css`, `refresh.css`, `app.js`, `tweaks-*.jsx` yerinde kalır — referans; yeni site onları yüklemez.)

- [ ] **Step 2: Commit**
```bash
git add -A && git commit -m "chore: eski ana sayfaları _legacy'e taşı, v3 iskeleti"
```

### Task 1.2: Tasarım tokenları

**Files:**
- Create: `css/tokens.css`

**Interfaces:**
- Produces: CSS custom properties — sonraki tüm CSS bunları kullanır. İsimler: `--bg`, `--ink`, `--muted`, `--line`, `--k-muhendis`, `--k-futbolcu`, `--k-berber`, `--k-itfaiyeci`, `--font-serif`, `--font-sans`, `--step-0..6`, `--space-*`, `--radius`, `--shadow-card`.

- [ ] **Step 1: Yaz**

```css
:root{
  /* Zemin & mürekkep — premium beyaz alan (K4, docx) */
  --bg:#fffdfa; --bg-soft:#f7f1e8; --ink:#2e2822; --muted:#6f665c; --line:#e8ded1;
  /* Karakter vurgu renkleri */
  --k-muhendis:#d99a2b;  /* hardal/kehribar — kıyafeti maviyle çakışmasın */
  --k-futbolcu:#2f6bd0;  /* mavi */
  --k-berber:#e08aa6;    /* pudra */
  --k-itfaiyeci:#c94f3d; /* kırmızı */
  --accent:var(--k-itfaiyeci); /* varsayılan marka aksiyonu */
  /* Tipografi */
  --font-serif:"Newsreader",Georgia,serif;
  --font-sans:"Nunito Sans",-apple-system,system-ui,sans-serif;
  --step-0:.8125rem; --step-1:1rem; --step-2:1.25rem; --step-3:1.6rem;
  --step-4:2.1rem; --step-5:2.9rem; --step-6:clamp(2.6rem,6vw,4.4rem);
  /* Boşluk & şekil */
  --space-1:.5rem; --space-2:1rem; --space-3:1.5rem; --space-4:2.5rem;
  --space-5:4rem; --space-6:6.5rem;
  --radius:18px; --radius-sm:10px;
  --shadow-card:0 18px 48px rgba(60,44,28,.14);
  --maxw:1200px;
}
@media (prefers-reduced-motion: reduce){ :root{ --_rm:1; } }
```

- [ ] **Step 2: Doğrula**

Geçici bir `_probe.html` yaz, tokenları kullanan renk şeritleri bas, tarayıcıda aç, dört vurgu rengini gözle. Sonra `_probe.html`'i sil. (Bu adım commit edilmez.)

- [ ] **Step 3: Commit**
```bash
git add css/tokens.css && git commit -m "feat: tasarım tokenları"
```

### Task 1.3: Base — reset, tipografi, buton, container, nav, footer

**Files:**
- Create: `css/base.css`, `js/shell.js`

**Interfaces:**
- Consumes: `css/tokens.css`.
- Produces: `.container`, `.btn`/`.btn-primary`/`.btn-ghost`, `.site-nav`, `.site-footer` sınıfları; `shell.js` mobil menü ve `[data-year]` doldurma davranışı.
- Nav markup sözleşmesi: `<header class="site-nav">` içinde `[data-burger]` ve `[data-mobile-menu]` — `shell.js` bunları arar.

- [ ] **Step 1: `css/base.css` yaz**

Reset (`box-sizing`, margin sıfır), `body{background:var(--bg);color:var(--ink);font-family:var(--font-sans)}`, başlıklar serif, `.container{max-width:var(--maxw);margin-inline:auto;padding-inline:var(--space-3)}`, buton sınıfları (pill, `--accent` dolgulu primary, çizgili ghost), nav (yatay, sticky, blur zemin), mobil menü (tam ekran overlay), footer (koyu değil — kırık beyaz üstü, örgü doku ayırıcı). Nav'da "Mağaza ↗" linki dış link stili (`.nav-shop::after{content:"↗"}`).

- [ ] **Step 2: `js/shell.js` yaz**

Mevcut `app.js`'in mobil menü bloğunu (satır 7-18) temel al, ES5 stilini koru. Ek: `document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear())`. GSAP veya SES içermez.

- [ ] **Step 3: Kabuk demo sayfası ile doğrula**

Geçici `_probe.html`: tokens+base yükle, nav ve footer markup'ını koy, `shell.js` bağla. Tarayıcıda aç — mobil (375px) genişlikte burger menü açılıp kapanıyor mu, "Mağaza ↗" görünüyor mu, konsol temiz mi? `_probe.html` sil.

- [ ] **Step 4: Commit**
```bash
git add css/base.css js/shell.js && git commit -m "feat: base stiller, nav, footer, kabuk JS"
```

### Task 1.4: Karakter verisi tek kaynağı

**Files:**
- Create: `js/data.js`

**Interfaces:**
- Produces: `window.HARBIE_CHARS` — sıralı dizi. Her öğe: `{slug, ad, unvan, motto, aciklama, renk, bolumNo, kenar}`. `renk` = CSS değişken adı (`'--k-muhendis'`). `kenar` = `'sol'|'sag'` (karakterin ana sayfada hangi yanda durduğu). Metinler docx'ten birebir.

- [ ] **Step 1: Yaz**

```js
window.HARBIE_CHARS = [
  { slug:'muhendis', ad:'Harbie Mühendis', unvan:'İnşaat Sahası',
    motto:'Geleceği ve hayallerini inşa edecek güç senin içinde.',
    aciklama:'Beyaz bareti ve analitik dünyasıyla çocuklara problem çözme becerisini ve sınır tanımayan bir mühendislik vizyonunu fısıldar.',
    renk:'--k-muhendis', bolumNo:'01', kenar:'sag' },
  { slug:'futbolcu', ad:'Harbie Futbolcu', unvan:'Saha',
    motto:'Saha da bizim, gelecek de bizim!',
    aciklama:'18 numaralı forması ve takım ruhuyla çocuklara kuralları kalıpların değil, yeteneklerin yazdığını gösterir.',
    renk:'--k-futbolcu', bolumNo:'02', kenar:'sol' },
  { slug:'berber', ad:'Harbie Berber', unvan:'Berber Dükkânı',
    motto:'Yaratıcılığın ve emeğin cinsiyeti olmaz.',
    aciklama:'Mavi elbisesi, krem önlüğü ve el emeği aksesuarlarıyla estetiği ve el becerisini eşitlikle harmanlar.',
    renk:'--k-berber', bolumNo:'03', kenar:'sag' },
  { slug:'itfaiyeci', ad:'Harbie İtfaiyeci', unvan:'İtfaiye İstasyonu',
    motto:'Geleceği cesaretle ve eşitlikle inşa ediyoruz.',
    aciklama:'İtfaiyeci üniforması ve özgün aksesuarlarıyla sahadaki gücü ve kararlılığı temsil eder. Çocukların hayal dünyasındaki "kahraman" algısını toplumsal cinsiyet kalıplarından arındırarak, onlara her alanda var olabileceklerini hatırlatan ilham dolu bir yol arkadaşıdır.',
    renk:'--k-itfaiyeci', bolumNo:'04', kenar:'sol' }
];
```

**Not:** `kenar` dönüşümlü (sağ/sol/sağ/sol). Task 0.1'in `-b` karesi bu değere uymalı: `kenar:'sag'` → karakter sağda, metin solda → görselde karakter **sağda** dolu. Task 0.2 üretiminde bu eşleme uygulanır.

- [ ] **Step 2: Commit**
```bash
git add js/data.js && git commit -m "feat: karakter verisi tek kaynağı"
```

---

## Faz 2 — Ana sayfa

### Task 2.1: Sayfa iskeleti + hero (düzen B, statik)

**Files:**
- Create: `index.html`, `css/pages.css`

**Interfaces:**
- Consumes: tokens, base, shell.js.
- Produces: `.hero` bölümü; video yer tutucusu `<video class="hero-video" poster="assets/v3/img/hero-b.png">` (kaynak Faz 0'dan gelince eklenir; şimdilik poster).

- [ ] **Step 1: `index.html` iskelet**

`<head>`: Google Fonts (Newsreader + Nunito Sans), `css/tokens.css`, `css/base.css`, `css/components.css`, `css/pages.css`. `<body>`: nav (base'deki markup), sonra `<main>`, sonra footer, sonra `js/data.js`, `js/shell.js`, `js/ses.js`, `js/scenes.js`, `js/motion.js` (defer). Menü: Koleksiyon / Hikâyemiz / Kurumsal / Sosyal Etki Sayacı / Mağaza ↗.

- [ ] **Step 2: Hero markup (düzen B)**

```html
<section class="hero">
  <video class="hero-video" poster="assets/v3/img/hero-b.png"
         muted playsinline preload="none" loop
         data-scene data-src="assets/v3/video/hero.mp4"></video>
  <div class="hero-scrim"></div>
  <div class="container hero-inner">
    <p class="kicker">HATAY'DAN, EL EMEĞİYLE</p>
    <h1 class="hero-title">Mesleklerin<br>cinsiyeti yoktur.</h1>
    <p class="hero-sub">Harbie ile hikâyene başla…</p>
    <div class="hero-cta">
      <a class="btn btn-primary" href="#koleksiyon">Koleksiyonu keşfet</a>
      <a class="btn btn-ghost" href="hikayemiz.html">Hikâyemiz</a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: `css/pages.css` hero**

`.hero{position:relative;min-height:88vh;display:flex;align-items:center}`, video `position:absolute;inset:0;object-fit:cover`, scrim soldan sağa `linear-gradient(90deg,var(--bg) 28%,transparent 62%)`, `.hero-inner{position:relative;max-width:46%}`. **Mobil (`@media max-width:760px`):** scrim alttan yukarı, `.hero-inner{max-width:100%}`, metin videonun altına akar (düzen korunur, K3).

- [ ] **Step 4: Tarayıcıda doğrula**

`index.html`'i mcp__Claude_Browser ile aç. Beklenen: poster görseli tam ekran, solda okunur başlık, iki buton, sticky nav. 375px'e küçült — metin alta iniyor, taşma yok, yatay kaydırma yok. Konsol temiz.

- [ ] **Step 5: Commit**
```bash
git add index.html css/pages.css && git commit -m "feat: ana sayfa hero (düzen B)"
```

### Task 2.2: Manifesto bloğu + koleksiyon başlığı

**Files:**
- Modify: `index.html`, `css/pages.css`

- [ ] **Step 1: Manifesto markup** (hero'dan sonra)

docx giriş paragrafı, tek sütun, ortalanmış, geniş dikey boşluk (`--space-6`):
```html
<section class="manifesto container reveal">
  <p>Çocuklar dünyaya sınırsız bir potansiyelle gelir. Ancak büyürken onlara toplumsal kalıplarla sınırlar öğretilir; hangi mesleklerin kime uygun olduğu söylenir. Biz bu sınırlara inanmıyoruz. Harbie, çocuklarımızın potansiyelini özgürleştiren, onlara her zorluğu aşacak cesareti fısıldayan ve her işi başarabileceklerine sarsılmaz bir inanç aşılayan güçlü bir yol arkadaşıdır.</p>
</section>
```

- [ ] **Step 2: Koleksiyon başlığı** (`id="koleksiyon"`)
```html
<section id="koleksiyon" class="coll-head container reveal">
  <h2>Geleceğin Eşitlik Elçileri ile Tanışın</h2>
  <p>Ebeveynlerin %65'inin değer odaklı satın alma yaptığı günümüzde, siz de çocuğunuza sadece bir oyuncak değil, bir karakter gelişimi yatırımı hediye edin. İşte ezber bozan ilk "Harbie" yol arkadaşları:</p>
</section>
```

- [ ] **Step 3: Stil + doğrula + commit**

`.manifesto p{font-family:var(--font-serif);font-size:var(--step-3);line-height:1.5;max-width:62ch;margin-inline:auto;text-align:center}`. Tarayıcıda akışı gör. Commit: `feat: manifesto ve koleksiyon başlığı`.

### Task 2.3: Sahne bileşeni (components.css + scenes.js)

**Files:**
- Create: `css/components.css`, `js/scenes.js`

**Interfaces:**
- Produces: `.scene` bileşeni ve `renderScene(char)` sözleşmesi (markup şablonu). `scenes.js` API: `data-scene` taşıyan her `<video>` için IntersectionObserver ile lazy `data-src`→`src`, görününce `play()`, çıkınca `pause()`. Mobilde (`matchMedia('(max-width:760px)')` ve `AUTOPLAY_MOBILE=false`) oynatmaz — poster kalır, `data-tap-to-play` ile dokununca oynar. `prefers-reduced-motion` → hiç oynatmaz.

- [ ] **Step 1: `.scene` markup şablonunu tanımla**

Ana sayfa karakter bölümü ve karakter sayfası başlığı aynı şablonu kullanır:
```html
<section class="scene scene--sag" style="--k:var(--k-itfaiyeci)">
  <div class="scene-stage">
    <video class="scene-video" poster="assets/v3/img/itfaiyeci-b.png"
           muted playsinline preload="none"
           data-scene data-src="assets/v3/video/itfaiyeci.mp4"></video>
  </div>
  <div class="scene-copy">
    <p class="scene-kicker">04 — İtfaiye İstasyonu</p>
    <h3 class="scene-motto">Geleceği cesaretle ve eşitlikle inşa ediyoruz.</h3>
    <p class="scene-desc">…</p>
    <a class="btn scene-cta" href="karakter-itfaiyeci.html">Hikâyesini oku</a>
  </div>
</section>
```

- [ ] **Step 2: `css/components.css` — sahne**

`.scene{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);align-items:center;padding-block:var(--space-6)}`. `.scene--sag`: video sağda (`grid-column:2`), kopya solda. `.scene--sol` tersi. Stage: `border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-card);aspect-ratio:16/9`. Vurgu (K4): `.scene-kicker{color:var(--k)}`, `.scene-cta{background:var(--k);color:#fff}`, stage altında `.scene-stage::after` 3px `--k` çizgi. **Mobil:** tek sütun, video üstte, kopya altta; `--k` çizgisi ve kicker korunur.

- [ ] **Step 3: `js/scenes.js` yaz**

```js
(function(){
  'use strict';
  var AUTOPLAY_MOBILE = false;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width:760px)').matches;
  var vids = document.querySelectorAll('video[data-scene]');
  if(!vids.length) return;

  function load(v){ if(!v.src && v.dataset.src){ v.src = v.dataset.src; } }
  function canAutoplay(){ return !rm && (!isMobile || AUTOPLAY_MOBILE); }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        var v = e.target;
        if(e.isIntersecting){
          if(canAutoplay()){ load(v); var p=v.play(); if(p&&p.catch)p.catch(function(){}); }
        } else { if(!v.paused) v.pause(); }
      });
    }, { threshold:0.55 });
    vids.forEach(function(v){ io.observe(v); });
  }
  // Dokununca oynat (mobil / autoplay kapalı)
  vids.forEach(function(v){
    v.addEventListener('click', function(){
      load(v); if(v.paused){ v.play(); } else { v.pause(); }
    });
  });
})();
```

- [ ] **Step 4: Doğrula (tek sahne ile)**

Geçici olarak `index.html`'e bir `.scene` bloğu koy, `scenes.js` bağla. Masaüstünde: bölüm görününce video (varsa; yoksa poster) oynuyor. 375px: poster duruyor, dokununca oynuyor. Konsol temiz.

- [ ] **Step 5: Commit**
```bash
git add css/components.css js/scenes.js && git commit -m "feat: sahne bileşeni ve video lazy-load"
```

### Task 2.4: 4 karakter bölümünü verinden bas

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.HARBIE_CHARS`, `.scene` şablonu.

- [ ] **Step 1: Container + generatör**

Koleksiyon başlığından sonra `<div id="scenes"></div>`. `index.html` sonunda küçük inline script (veya `scenes.js` başına) `HARBIE_CHARS`'ı dolaşıp `.scene` markup'ını üretir. Kenar: `char.kenar==='sag'?'scene--sag':'scene--sol'`. Kicker: `char.bolumNo + ' — ' + char.unvan`. Video poster `img/<slug>-b.png`, src `video/<slug>.mp4`. **DRY:** metin sadece `data.js`'te.

Eşleme doğrulaması: muhendis `sag`, futbolcu `sol`, berber `sag`, itfaiyeci `sol` → dönüşümlü ritim. Task 0 `-b` kareleri bu yana uymalı (sag = karakter görselde sağda).

- [ ] **Step 2: Doğrula**

Tarayıcıda: dört bölüm sırayla (mühendis→futbolcu→berber→itfaiyeci), kenarlar dönüşümlü, her birinin vurgu rengi doğru (hardal/mavi/pudra/kırmızı), "Hikâyesini oku" linkleri doğru slug'a gidiyor. Mobilde tek sütun, taşma yok.

- [ ] **Step 3: Commit**
```bash
git add index.html && git commit -m "feat: veriden üretilen 4 karakter bölümü"
```

### Task 2.5: Oyun Arkadaşı (lifestyle) + Kurumsal şerit

**Files:**
- Modify: `index.html`, `css/pages.css`

- [ ] **Step 1: Lifestyle bölümü**

İki görsel (`lifestyle-kucak`, `lifestyle-mac`) + docx dokusuna uygun kısa başlık ("Oyun Arkadaşı"). Ebeveyn/çocuk sıcaklığı. `.reveal` ile.

- [ ] **Step 2: Kurumsal şerit**

B2B metninin kısaltılmış hâli + `<a class="btn btn-primary" href="kurumsal.html">Kurumsal iş birliği</a>`. Zemin `--bg-soft`, hafif örgü doku.

- [ ] **Step 3: Doğrula + commit**

Tarayıcıda akış. Commit: `feat: lifestyle ve kurumsal şerit`.

### Task 2.6: Sosyal Etki Sayacı

**Files:**
- Create: `js/ses.js`
- Modify: `index.html`, `css/components.css`

**Interfaces:**
- Consumes: mevcut `app.js` satır 48-171 SES mantığı (birebir taşınır).
- Produces: `[data-ses-count]`, `[data-ses-bar]`, `[data-ses-share]`, `[data-ses-meter]`, `[data-ses-toast]`, `[data-ses-mini]`, `[data-ses-toward]`, `[data-ses-goal]` markup sözleşmesi.

- [ ] **Step 1: `js/ses.js` — mantığı taşı**

`app.js`'in SES bloğunu (49-171) olduğu gibi al. Mantık kanıtlanmış; sadece dosyaya ayrılıyor. Değiştirme.

- [ ] **Step 2: SES bölümü markup + stil**

docx metni ("İnteraktif Sosyal Etki Sayacı…") + sayaç kartı: büyük `[data-ses-count]`, ilerleme çubuğu, "Paylaş ve destekle" düğmesi `[data-ses-share]`, toast. `[data-ses-meter]` sarmalayıcı (count-up tetikleyici). Stil `components.css`'e, `.ses-pop` ve `.toast` dahil.

- [ ] **Step 3: Doğrula**

Tarayıcıda: sayaç görününce sayıyor (count-up), "Paylaş" tıklayınca kalpler uçuyor, toast çıkıyor, sayı artıyor, localStorage kaydediyor (yenile → değer korunuyor). `prefers-reduced-motion`'da animasyon yok ama sayı doğru.

- [ ] **Step 4: Commit**
```bash
git add js/ses.js index.html css/components.css && git commit -m "feat: sosyal etki sayacı"
```

---

## Faz 3 — Karakter sayfası şablonu (×4)

### Task 3.1: Şablon (itfaiyeci ile) — üst sahne + sekmeli hikâye + künye

**Files:**
- Create: `karakter-itfaiyeci.html`, `js/tabs.js`
- Modify: `css/pages.css`

**Interfaces:**
- Produces: karakter sayfası düzeni + `tabs.js` (sekme değiştirme, ARIA). Diğer 3 sayfa bunun kopyası.

- [ ] **Step 1: Üst sahne**

Aynı `.scene` bileşeni (tam genişlik varyantı `.scene--hero`), itfaiyeci videosu/posteri, motto başlık.

- [ ] **Step 2: İki sütun — sol foto/galeri, sağ sekmeler**

Sol: `assets/products/itfaiyeci.jpg` + küçük galeri (diorama + clean). Sağ: üç sekme:
- **Manifestosu:** motto + docx açıklaması.
- **Hatay'daki Hikâyesi:** TASLAK metin (aşağıda).
- **Çocuk Gelişimine Katkısı:** TASLAK metin (aşağıda).

Sekme markup ARIA'lı: `role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`.

**İtfaiyeci taslak metinleri (dolu, yer tutucu değil — müşteri revize eder):**

> **Hatay'daki Hikâyesi:** "Bu itfaiyeci, Hatay'daki İyiliğe Bir İlmek Atölyeleri'nde, depremin ardından hayatını yeniden ören kadınların elinden çıktı. Her ilmek, bir kadının ekonomik bağımsızlığına atılan bir adım; her düğüm, dayanışmanın sessiz bir sözü. Onu üreten eller, cesaretin yalnızca sahada değil, bir tezgâhın başında da yeşerdiğini biliyor."

> **Çocuk Gelişimine Katkısı:** "İtfaiyeci Harbie, çocuğun 'kahraman' tanımını cinsiyetten arındırır. Rol yapma oyunlarında liderlik, cesaret ve başkasına yardım etme duygusunu besler; korkuyla baş etmeyi ve zor anlarda sakin kalmayı sembolik oyunla öğretir. %100 pamuklu, anti-alerjik dokusu duyusal gelişime güvenle eşlik eder."

- [ ] **Step 3: Künye + Satın Al**

`%100 pamuk · anti-alerjik · el yapımı · ~30 cm` + `<a class="btn btn-primary" href="https://shop.harbies.com" target="_blank" rel="noopener">Satın Al ↗</a>`.

- [ ] **Step 4: `js/tabs.js`**

Sekme tıklama → panel değiştir, `aria-selected` güncelle, klavye (ok tuşları) desteği.

- [ ] **Step 5: Doğrula + commit**

Tarayıcıda: üst video/poster, sekmeler çalışıyor (klavye dahil), Satın Al yeni sekmede Shopify'a gidiyor. Mobilde iki sütun tek sütuna iniyor. Commit: `feat: karakter sayfası şablonu (itfaiyeci)`.

### Task 3.2: Diğer üç karakter sayfası

**Files:**
- Create: `karakter-muhendis.html`, `karakter-futbolcu.html`, `karakter-berber.html`

- [ ] **Step 1: itfaiyeci'yi kopyala, içeriği değiştir**

Her biri için: slug, video/poster, motto, açıklama, vurgu rengi (`style="--k:var(--k-<slug>)"`), ürün fotoğrafı. Sekme taslak metinleri her karaktere özgü yazılır (dolu, müşteri revize eder):

**Mühendis** — Hatay hikâyesi: analitik + el emeği köprüsü; Gelişim: problem çözme, mekânsal düşünme, sebat.
**Futbolcu** — Hatay hikâyesi: takım/dayanışma teması; Gelişim: takım ruhu, motor beceri, öz-güven.
**Berber** — Hatay hikâyesi: el sanatı/estetik + kadın emeği; Gelişim: ince motor beceri, yaratıcılık, empati (başkasına bakım).

(Her metin tam cümlelerle yazılır — itfaiyeci örneğindeki uzunluk ve tonda.)

- [ ] **Step 2: Doğrula (dört sayfa)**

Her sayfayı tarayıcıda aç: doğru video, doğru vurgu rengi, sekmeler çalışıyor, Satın Al doğru. Ana sayfadaki "Hikâyesini oku" linkleri bu sayfalara doğru gidiyor.

- [ ] **Step 3: Commit**
```bash
git add karakter-*.html && git commit -m "feat: mühendis, futbolcu, berber karakter sayfaları"
```

---

## Faz 4 — Hikâyemiz ve Kurumsal

### Task 4.1: Hikâyemiz sayfası

**Files:**
- Create: `hikayemiz.html`

- [ ] **Step 1: İçerik (docx §2 birebir)**

Hakkımızda (iki paragraf), Vizyon (alıntı bloğu), Misyon (alıntı bloğu), Değerlerimiz (4 kart: Eşitlik / Sosyal Fayda & Dayanışma / Doğallık & Çocuk Sağlığı / Potansiyel ve İlham). Nav+footer aynı kabuk. `.reveal` bölümler.

- [ ] **Step 2: Doğrula + commit**

Tarayıcıda okunurluk, mobil. Commit: `feat: Hikâyemiz sayfası`.

### Task 4.2: Kurumsal sayfası + form

**Files:**
- Create: `kurumsal.html`
- Modify: `css/components.css` (form stilleri)

- [ ] **Step 1: İçerik + form**

docx B2B metni ("Ortak Değerimiz & Sürdürülebilir Gelecek"). İş Birliği Talep Formu: kurum adı, yetkili, e-posta, telefon, ilgi alanı (KSS / toplu satın alma / özel tasarım), mesaj. `<form>` — gönderim hedefi henüz yok, `action` boş bırakılır ve `onsubmit` ile "teşekkürler" mesajı gösterilir (JS, sahte gönderim). **Not: form verisi hiçbir yere gönderilmez** — hedef servis toplantı sonrası.

- [ ] **Step 2: Form stilleri + doğrula**

`components.css`'e form stilleri (label, input, select, textarea, focus halkası `--accent`). Tarayıcıda: form dolduruluyor, gönderince teşekkür mesajı, konsol temiz, hiçbir ağ isteği gitmiyor (Network sekmesi boş).

- [ ] **Step 3: Commit**
```bash
git add kurumsal.html css/components.css && git commit -m "feat: Kurumsal sayfası ve iş birliği formu"
```

---

## Faz 5 — Hareket katmanı (GSAP)

> Progressive enhancement. Bu fazdan **önce** site tamamen çalışır durumda olmalı. `motion.js` yoksa hiçbir şey bozulmaz.

### Task 5.1: GSAP kurulumu + hero hareketi

**Files:**
- Create: `js/motion.js`
- Modify: tüm HTML sayfaları (GSAP script + `motion.js`)

**Interfaces:**
- Consumes: GSAP 3 + ScrollTrigger. Yerel `js/vendor/gsap.min.js` + `ScrollTrigger.min.js` (CDN'e bağımlı kalmamak için indirilip commit edilir).
- Produces: `motion.js` — `prefers-reduced-motion` açıksa **hiçbir şey yapmaz** ve döner.

- [ ] **Step 1: GSAP'i yerelleştir**

`js/vendor/` altına GSAP 3 ve ScrollTrigger'ı indir (belirli sürüm, ör. 3.12.x). Sayfalara `<script src="js/vendor/gsap.min.js" defer>` vb. ekle.

- [ ] **Step 2: `motion.js` guard + hero**

```js
(function(){
  'use strict';
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  // Hero başlığı kelime kelime
  var title = document.querySelector('.hero-title');
  if(title){ /* split & stagger fade-up */ }
  // Hero paralaks (video hafif yukarı)
  // ...
})();
```

Hero başlığı kelime stagger (opaklık 0→1, y 20→0), scrim hafif paralaks.

- [ ] **Step 3: Doğrula**

Tarayıcıda: başlık kelimeleri sırayla beliriyor. `prefers-reduced-motion` aç (DevTools) → başlık anında tam görünür, hareket yok, içerik okunur.

- [ ] **Step 4: Commit**
```bash
git add js/vendor js/motion.js *.html && git commit -m "feat: GSAP kurulumu ve hero hareketi"
```

### Task 5.2: Sahne pin + metin girişi + renk geçişi

**Files:**
- Modify: `js/motion.js`

- [ ] **Step 1: Her `.scene` için ScrollTrigger**

Bölüm görünüm alanına girince: kopya stagger (kicker→motto→desc→cta, y+opaklık). Sahne kartı hafif ölçek/paralaks. **Pin YOK by default** (mobilde kırılgan) — sadece giriş animasyonu. `scenes.js` zaten videoyu oynatıyor; motion sadece metni sahneliyor.

- [ ] **Step 2: Vurgu rengi geçişi**

Aktif sahnenin `--k` rengini bir CSS değişkenine (`--active-accent`) yumuşak geçir; SES ve ayırıcılar bundan beslenir. `ScrollTrigger` `onEnter`/`onEnterBack`.

- [ ] **Step 3: Ayırıcı çizim animasyonu**

Örgü/ilmek SVG ayırıcıları `stroke-dashoffset` ile çizilerek belirir (v2'de tohumu vardı, refresh.js'e bak referans için).

- [ ] **Step 4: Doğrula**

Tarayıcıda yavaş scroll: her bölümde metin akıcı giriyor, renk geçişi yumuşak, scroll hiç bloklanmıyor (hızlı kaydır — takılma yok). Mobilde: giriş animasyonları çalışıyor ama pin yok, zıplama yok. reduced-motion: hepsi kapalı.

- [ ] **Step 5: Commit**
```bash
git add js/motion.js && git commit -m "feat: sahne giriş animasyonları ve renk geçişi"
```

---

## Faz 6 — Cila, performans, deploy

### Task 6.1: Videoları bağla + performans geçişi

**Files:**
- Modify: tüm sayfalar (video `data-src` zaten var; Faz 0 videoları geldiğinde dosyalar yerinde)

- [ ] **Step 1: Videolar yerinde mi**

`assets/v3/video/*.mp4` var (Faz 0.3). Her sahne/hero videosu tarayıcıda görününce oynuyor, son karesi posterle örtüşüyor (zıplama yok).

- [ ] **Step 2: Performans denetimi**

Her sayfada: `preload="none"` tüm videolarda mı, ilk ekranda video indirilmiyor mu (Network sekmesi: hero videosu ancak görününce yükleniyor). Görseller boyut olarak makul mü (gerekirse `assets/v3/img` optimize et). Fontlar `display=swap`.

- [ ] **Step 3: Responsive tam geçiş**

375 / 768 / 1280px'de dört sayfa + ana sayfa: taşma yok, dokunma hedefleri ≥44px, video posterleri dokununca oynuyor, nav mobil menü çalışıyor.

- [ ] **Step 4: Commit**
```bash
git add -A && git commit -m "perf: video bağlama ve performans geçişi"
```

### Task 6.2: Erişilebilirlik + son cila

- [ ] **Step 1: A11y**

Tüm görsellerde anlamlı `alt`, nav ARIA, sekmeler ARIA (Task 3.1), renk kontrastı (metin `--ink` beyaz üstünde ≥4.5:1), `:focus-visible` halkaları, video `aria-label`.

- [ ] **Step 2: Konsol/link denetimi**

Beş sayfada konsol temiz, kırık link yok, tüm iç linkler doğru, tüm Satın Al → Shopify.

- [ ] **Step 3: Commit**
```bash
git add -A && git commit -m "a11y: erişilebilirlik ve son cila"
```

### Task 6.3: Gizli önizleme deploy (K10)

**Files:**
- Create: deploy config (platforma göre)

- [ ] **Step 1: Platform seç**

Video toplam boyutuna göre: git'e sığıyorsa **GitHub Pages (private repo, ama Pages public olur — bu yüzden değil)** → **Netlify/Vercel private preview** tercih. Statik site, build yok → sürükle-bırak veya `netlify deploy`. Videolar > git limiti ise deploy servisinin asset barınağı.

**Karar noktası — kullanıcıya sor:** hangi platform, ve videolar repoda mı yoksa harici mi.

- [ ] **Step 2: Deploy + doğrula**

Gizli/parolalı önizleme URL'i al. Tarayıcıda aç, tüm sayfalar canlıda çalışıyor (video dahil). URL indekslenmez (`robots noindex` meta veya platform private preview).

- [ ] **Step 3: Commit + push**
```bash
git add -A && git commit -m "chore: deploy yapılandırması"
git push
```

---

## Öz-inceleme (spec kapsamı)

| Spec bölümü | Karşılayan task |
|---|---|
| §4 Site haritası (menü, 6 sayfa) | 1.3 (nav), 2.x, 3.x, 4.x |
| §5 Ana sayfa akışı (7 blok) | 2.1–2.6 |
| §6 Karakter sayfası şablonu (3 sekme) | 3.1, 3.2 |
| §7 Görsel dil (K4 galeri+renk) | 1.2, 2.3 |
| §8 Video hattı (Seedance, çift kare) | 0.1–0.3 |
| §9 Hareket (K9 GSAP) | 5.1, 5.2 |
| §9 Performans (lazy, mobil, reduced-motion) | 2.3, 6.1 |
| §10 İçerik eşlemesi (docx) | 1.4, 2.x, 3.x, 4.x |
| §11 Yedek planlar (poster fallback) | 2.3 (poster her zaman var) |
| K7 sessiz video | Global Constraints + tüm video markup |
| K5 Shopify dış link | 3.1 künye, Global Constraints |
| K10 private deploy | 6.3 |

**Açık uçlar (spec §12) plana taşındı:** mobil autoplay bayrağı (2.3), form hedefi (4.2 — gönderim yok), shop URL (varsayım, Global Constraints), deploy platformu (6.3 karar noktası).

**Bağımlılık notu:** Faz 0 (varlık) diğer fazlara paralel. Faz 1 → 2 → 3/4 sıralı. Faz 5 (hareket) Faz 2-4 bittikten sonra. Faz 6 en son. Videolar Faz 6'da bağlanır ama posterler Faz 2'den beri yerinde — site her an gösterilebilir.

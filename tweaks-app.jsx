/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect, TweakToggle */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "a",
  "accent": "#C9342B",
  "headingFont": "Newsreader",
  "knit": true
}/*EDITMODE-END*/;

const ACCENTS = {
  "#C9342B": "#A4271F", // Harbie kırmızı
  "#C2663F": "#9E4F2E", // Terracotta
  "#8E4A6E": "#6F3955", // Erik
  "#2E7D8A": "#225F69"  // Petrol
};

const FONTS = {
  "Newsreader":           { stack: '"Newsreader", Georgia, serif',           href: null },
  "DM Serif Display":     { stack: '"DM Serif Display", Georgia, serif',     href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" },
  "Bricolage Grotesque":  { stack: '"Bricolage Grotesque", system-ui, sans-serif', href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap" }
};

function ensureFont(href) {
  if (!href) return;
  if ([].slice.call(document.querySelectorAll('link[data-tweakfont]')).some(function (l) { return l.href === href; })) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = href; l.setAttribute('data-tweakfont', '1');
  document.head.appendChild(l);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(function () {
    var hero = document.querySelector('.hero');
    if (hero) {
      hero.dataset.hero = t.hero;
      var photo = hero.querySelector('[data-hero-photo]');
      if (photo) {
        photo.src = t.hero === 'c' ? 'assets/gen/berber-portre.png' : 'assets/gen/hero.png';
      }
    }
  }, [t.hero]);

  useEffect(function () {
    var root = document.documentElement;
    root.style.setProperty('--red', t.accent);
    root.style.setProperty('--red-deep', ACCENTS[t.accent] || t.accent);
  }, [t.accent]);

  useEffect(function () {
    var f = FONTS[t.headingFont] || FONTS["Newsreader"];
    ensureFont(f.href);
    document.documentElement.style.setProperty('--font-display', f.stack);
  }, [t.headingFont]);

  useEffect(function () {
    var fig = document.querySelector('.hero');
    if (fig) fig.classList.toggle('knit', !!t.knit);
  }, [t.knit]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Açılış (Hero)" />
      <TweakRadio
        label="Hero stili"
        value={t.hero}
        options={[
          { value: 'a', label: 'Stüdyo' },
          { value: 'b', label: 'Yaşam tarzı' },
          { value: 'c', label: 'Editoryal' }
        ]}
        onChange={function (v) { setTweak('hero', v); }}
      />
      <TweakToggle label="Örgü dokusu" value={t.knit} onChange={function (v) { setTweak('knit', v); }} />

      <TweakSection label="Marka" />
      <TweakColor
        label="Vurgu rengi"
        value={t.accent}
        options={Object.keys(ACCENTS)}
        onChange={function (v) { setTweak('accent', v); }}
      />
      <TweakSelect
        label="Başlık fontu"
        value={t.headingFont}
        options={Object.keys(FONTS)}
        onChange={function (v) { setTweak('headingFont', v); }}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);

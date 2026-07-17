/* global React, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakSelect, TweakToggle */
const { useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "collection": "scene",
  "atelier": true,
  "accent": "#C9342B",
  "headingFont": "Newsreader"
}/*EDITMODE-END*/;

const ACCENTS = {
  "#C9342B": "#A4271F", // Harbie kırmızı
  "#C2663F": "#9E4F2E", // Terracotta
  "#8E4A6E": "#6F3955", // Erik
  "#2E7D8A": "#225F69"  // Petrol
};

const FONTS = {
  "Newsreader":          { stack: '"Newsreader", Georgia, serif', href: null },
  "DM Serif Display":    { stack: '"DM Serif Display", Georgia, serif', href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" },
  "Fraunces":            { stack: '"Fraunces", Georgia, serif', href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400&display=swap" }
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
    document.body.setAttribute('data-collection', t.collection);
  }, [t.collection]);

  useEffect(function () {
    document.body.classList.toggle('atelier', !!t.atelier);
  }, [t.atelier]);

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

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Koleksiyon sunumu" />
      <TweakRadio
        label="Kart stili"
        value={t.collection}
        options={[
          { value: 'scene', label: 'Sahne' },
          { value: 'studio', label: 'Stüdyo' },
          { value: 'editorial', label: 'Editoryal' }
        ]}
        onChange={function (v) { setTweak('collection', v); }}
      />
      <TweakToggle label="Atölye dokusu (örgü zemini)" value={t.atelier} onChange={function (v) { setTweak('atelier', v); }} />

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

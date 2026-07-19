#!/usr/bin/env python3
"""
Örgü kordon döşemesi üretir — CSS maskesi olarak.

Renk SVG'ye gömülmez; iki ayrı maske katmanı üretilir ve rengi CSS'teki
var(--accent) verir. Böylece kordon bulunduğu bölümün rengini alır.

  gövde  : kordonun silueti          → açık ton
  detay  : V ilmekler + alt kenar    → koyu ton

Kullanım: python3 tools/knit-tile.py   (iki data-URI'yi stdout'a yazar)
"""
import math, urllib.parse

W, H = 240.0, 48.0      # tek periyot döşeme (repeat-x ile kesintisiz)
Y0, AMP = 24.0, 5.0     # dalga ekseni ve genliği
T = 11.0                # kordon yarı kalınlığı
N_STITCH = 18           # periyot başına ilmek

K = 2 * math.pi / W


def pt(x):
    return x, Y0 + AMP * math.sin(K * x)


def frame(x):
    """Yol üzerindeki birim teğet ve normal."""
    dy = AMP * K * math.cos(K * x)
    n = math.hypot(1.0, dy)
    tx, ty = 1.0 / n, dy / n
    return (tx, ty), (-ty, tx)


def f(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')


# Dalgayı düz parçalarla örnekle (Bézier yaklaşımı yerine gerçek sinüs)
WAVE = 'M' + ' L'.join('%s %s' % (f(a), f(b))
                       for a, b in (pt(i * 6.0) for i in range(int(W / 6) + 1)))


def chevron(x, row_off, phase):
    """Teğet çerçevesine oturan tek V ilmek."""
    cx, cy = pt(x + phase)
    (tx, ty), (nx, ny) = frame(x + phase)
    cx += nx * row_off
    cy += ny * row_off

    def P(a, b):                      # a: teğet, b: normal katsayısı
        return cx + tx * a + nx * b, cy + ty * a + ny * b

    apex = P(4.4, 0)
    a1, a2 = P(-3.8, 4.5), P(-3.8, -4.5)
    c1, c2 = P(1.6, 2.8), P(1.6, -2.8)
    return 'M%s %s Q%s %s %s %s Q%s %s %s %s' % tuple(
        f(v) for p in (a1, c1, apex, c2, a2) for v in p)


# iki örgü sırası, yarım adım kaydırmalı → saç örgüsü hissi
ROWS = [(-4.4, 0.0), (4.4, W / (N_STITCH * 2))]
STITCH = ' '.join(chevron(i * (W / N_STITCH), off, ph)
                  for off, ph in ROWS for i in range(N_STITCH))


def svg(paths):
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 48'>"
            "<g fill='none' stroke='#000' stroke-linecap='round' "
            "stroke-linejoin='round'>" + paths + "</g></svg>")


# Maske katmanlarının içinde saydamlık YOK (üst üste binen alfalar toplanır,
# tonlama bozulurdu). Tonlamayı CSS'teki opacity yapıyor.
MASK_BODY = svg("<path d='%s' stroke-width='%s'/>" % (WAVE, f(T * 2)))
MASK_DETAIL = svg(
    "<path d='%s' stroke-width='3.1'/>" % STITCH +
    "<path d='%s' stroke-width='2.2' transform='translate(0,9.4)'/>" % WAVE
)


def uri(s):
    s = s.replace('"', "'").replace('#', '%23')
    return urllib.parse.quote(s, safe="%'=/:;,.<>()-_ #").replace(' ', '%20')


if __name__ == '__main__':
    for name, s in (('GOVDE', MASK_BODY), ('DETAY', MASK_DETAIL)):
        print('/* %s (%d bayt) */' % (name, len(uri(s))))
        print('data:image/svg+xml,' + uri(s))
        print()

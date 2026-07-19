#!/usr/bin/env python3
"""Örgü kordon döşemesi üretir: dalga boyunca V ilmekler (referans birebir)."""
import math, urllib.parse, sys

W, H = 240.0, 48.0      # tek periyot döşeme
Y0, AMP = 24.0, 5.0     # dalga
T = 11.0                # kordon yarı kalınlığı
N_STITCH = 18           # periyot başına ilmek (240/20 = 12px)

K = 2 * math.pi / W

def pt(x):
    return x, Y0 + AMP * math.sin(K * x)

def frame(x):
    """Birim teğet ve normal."""
    dy = AMP * K * math.cos(K * x)
    n = math.hypot(1.0, dy)
    tx, ty = 1.0 / n, dy / n
    return (tx, ty), (-ty, tx)

def f(v):
    return ('%.2f' % v).rstrip('0').rstrip('.')

WAVE = 'M0 %s Q 60 %s 120 %s T 240 %s' % (f(Y0), f(Y0 + AMP * 1.31), f(Y0), f(Y0))
# (gövde için gerçek sinüsü örnekleyelim, Q yaklaşımı yerine)
pts = [pt(x) for x in [i * 6.0 for i in range(int(W / 6) + 1)]]
WAVE = 'M' + ' L'.join('%s %s' % (f(a), f(b)) for a, b in pts)


def chevron(x, row_off, phase):
    """Bir V ilmek. row_off: normal yönünde kayma, phase: x kayması."""
    cx, cy = pt(x + phase)
    (tx, ty), (nx, ny) = frame(x + phase)
    cx += nx * row_off
    cy += ny * row_off

    def P(a, b):  # a: teğet, b: normal katsayısı
        return cx + tx * a + nx * b, cy + ty * a + ny * b

    apex = P(4.4, 0)
    a1, a2 = P(-3.8, 4.5), P(-3.8, -4.5)
    c1, c2 = P(1.6, 2.8), P(1.6, -2.8)
    return 'M%s %s Q%s %s %s %s Q%s %s %s %s' % tuple(
        f(v) for p in (a1, c1, apex, c2, a2) for v in p)


rows = [(-4.4, 0.0), (4.4, 240.0/36)]          # iki örgü sırası, yarım adım kaydırmalı
stitches = [chevron(i * (W / N_STITCH), off, ph)
            for off, ph in rows for i in range(N_STITCH)]

D_STITCH = ' '.join(stitches)

svg = (
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 48'>"
  "<g fill='none' stroke-linecap='round' stroke-linejoin='round'>"
  # gövde gölgesi
  "<path d='%(w)s' stroke='%%23cf6f8b' stroke-width='%(t2)s' opacity='.45' transform='translate(0,1.6)'/>"
  # gövde
  "<path d='%(w)s' stroke='%%23ec93ab' stroke-width='%(t1)s'/>"
  # ilmeklerin koyu gölgesi
  "<g transform='translate(.6,1.2)'><path d='%(s)s' stroke='%%23c4637f' stroke-width='3.4' opacity='.38'/></g>"
  # ilmekler
  "<path d='%(s)s' stroke='%%23f7c2d1' stroke-width='3.1' opacity='.9'/>"
  # üst ışık
  "<path d='%(w)s' stroke='%%23fde3ea' stroke-width='2' opacity='.28' transform='translate(0,-6.4)'/>"
  "</g></svg>"
) % {'w': WAVE, 's': D_STITCH, 't1': f(T * 2), 't2': f(T * 2 + 1.6)}

# CSS data-URI için güvenli kaçış (%23 zaten hazır)
uri = svg.replace('"', "'").replace('#', '%23')
uri = urllib.parse.quote(uri, safe="%'=/:;,.<>()-_ #")
uri = uri.replace(' ', '%20')

open(sys.argv[1] if len(sys.argv) > 1 else '/dev/stdout', 'w').write(uri)
open('/private/tmp/claude-501/-Users-ensar-Desktop-Harbie/9f2aac16-5b10-4a74-a7eb-a8fcab0d10d5/scratchpad/knit.svg', 'w').write(svg.replace('%23', '#'))
print('\nbytes:', len(uri))

# Behavior Sweep

## Interaction model

The target home page is scroll-driven, not click-driven. It is a sticky viewport scene with a tall scroll runway. The center square stays centered while scaling down, and the surrounding content cards travel into a stable mosaic.

## Scroll states captured

| Scroll state | Center tile | Peripheral tiles |
| --- | --- | --- |
| 0px | 798×798 paper square; blue heading; down chevrons | large colored tiles mostly beyond the viewport |
| ~720px | 500×500 blue square; second white heading visible | colored tile edges enter the viewport |
| ~1440px | 390×390 blue square; copy fades away | tiles form a recognisable mosaic around the center |
| ~1872px / end | 90×90 blue mark | complete color-tile directory fills the viewport |

## Hover behavior

- On pointer-capable screens, source tiles switch to the dark base color and white foreground.
- Each tile’s illustration has a distinct transformation; the reimplementation keeps the common dark hover inversion while using original OVWS glyphs.

## Responsive behavior

- Source CSS sets a 64px final center square and 5px tile gap under 991px.
- The original browser session does not expose viewport emulation; source media rules were used to document the tablet/mobile switch points.

## Personalization boundary

The clone retains the extracted spatial, color, and scroll language, but swaps Dropbox trademarks, logo, copy, and icon artwork for OVWS identity and the user’s own public links.

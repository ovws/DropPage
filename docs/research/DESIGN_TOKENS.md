# Dropbox Brand Home — Extracted Design Tokens

Target: `https://brand.dropbox.com/` at a 1363×936 desktop viewport.

## Typography

- Body: `Atlasgrotesk Web, Arial, sans-serif`; 14px / 20px; weight 400.
- Headline: `Dbsharpgroteskvariable Vf`; 36px / 43.2px; weight 700; letter spacing -0.72px.
- Large quote: `Dbsharpgroteskvariable Vf`; 30px / 36px; weight 700; letter spacing -0.6px.
- This implementation uses Geist as the closest locally available neutral grotesk equivalent. The proprietary Dropbox typefaces are not reused.

## Core colors

| Token | Extracted value |
| --- | --- |
| Paper | `#ffffff` |
| Main blue | `#0061fe` |
| Grid / annotation line | `#c5dbff` / `#5f9dff66` |
| Ink | `#1e1919` |
| Navy | `#283750` |
| Cyan | `#3dd3ee` |
| Yellow | `#fad24b` |
| Orange | `#ff8c19` |
| Orange-red | `#fa551e` |
| Lime | `#b4dc19` |
| Plum | `#78286e` |
| Lilac | `#c8aff0` |

## Geometry

- Desktop field: 12-column underlying grid; source variables show 120px opening margins and 24px gutters.
- Settled tile grid: 10px outer/inner gaps at the inspected desktop state.
- Center tile: 798px square initially, 500px around 720px scroll, 390px around 1440px scroll, and 90px at the end.
- Desktop tile padding: 23px.
- Source tile transition: `0.35s cubic-bezier(.4,0,.2,1)` for color, padding, and corner state.

## Responsive variables seen in source CSS

- Under 991px: tile gap 5px, center button 64px, opening/body margin 60px, opening/body gutter 12px.
- Under 767px: opening/body margin 32px.

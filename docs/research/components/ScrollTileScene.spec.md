# ScrollTileScene Specification

## Overview

- Target file: `app/page.tsx`
- Interaction model: scroll-driven with a sticky 300vh runway.
- Target reference: `https://brand.dropbox.com/`

## Extracted source facts

- Base background: white.
- Grid hairline: `#c5dbff`; grid uses wide, regular columns and horizontal rows.
- Center tile starts at 798×798 on the 1363×936 inspected desktop viewport and ends at 90×90.
- Center content remains geometrically centered while it scales.
- Source title uses 36px / 43.2px blue heading copy; source desktop tile padding is 23px.
- Final desktop field contains eight colored tiles, with 10px spacing and only the outer tiles using 8px corner radii.

## Implementation adaptation

- Preserve motion topology, central scaling, color field, fixed grid, and hover inversion.
- Substitute the target’s proprietary logo, typography, labels, and card artwork with OVWS-specific text and CSS visuals.
- Use external links only for the user’s own public destinations.

## Responsive behavior

- Under 991px: final center mark is 64px; tiles use tighter spacing.
- Under 767px: use the same mosaic proportions but smaller typography and a full-width profile panel.

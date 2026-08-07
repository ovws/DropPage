# ProfilePanel Specification

## Overview

- Target file: `app/page.tsx`
- Interaction model: click-driven side drawer.

## Structure

- Fixed overlay scrim.
- Left-aligned white panel carrying the same blueprint grid language.
- Small monospace file label, large Chinese/Latin name lockup, short bio, public-link directory, and close action.

## Behavior

- Opens from the center tile or `PERSONAL INFO` trigger.
- Moves in from the left using a 550ms cubic-bezier transition.
- Closing the panel restores direct interaction with the scroll scene.

## Content

- Uses public material from qiwensong.com: 文山木公 / Qi Wensong, personal motto, cloud/open-source/self-hosting description, and existing service URLs.

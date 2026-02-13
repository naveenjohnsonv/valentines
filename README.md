# Valentine's NFC Tag Hunt

An interactive Valentine's game built with Next.js. Hide 6 NFC tags around your home — each reveals a letter. Your partner collects the letters, arranges them in order, and unlocks a surprise proposal.

## How It Works

1. **Collect Letters** — 6 NFC tags each link to a clue page that reveals a letter (L, O, V, E, M, E)
2. **Enter Letters** — Input the found letters on the main site
3. **Arrange** — Put them in the right order to unlock the next step
4. **Proposal** — A personal letter and "Will you be my Valentine?" with a runaway "No" button, fireworks on "Yes", and a heart-shaped photo grid

## Branches

- `anna` — Full game (collect, order, proposal)
- `clue-pages` — Stripped-down single clue + letter page template for NFC tag destinations

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

- **Photos** — Replace images in `public/game-photos/` (AVIF format, named `1.avif`, `2.avif`, etc.)
- **Clues** — Edit `CLUE` and `LETTER` constants in `src/app/page.tsx` (on `clue-pages` branch)
- **Proposal text** — Edit the personal letter in `src/components/ValentinesProposal.tsx`
- **Styling** — Tailwind CSS throughout; font is Segoe UI Variable with system fallbacks

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Fireworks.js](https://fireworks.js.org/)

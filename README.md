# Father's Day Scrollytelling

This is a Next.js (App Router) TypeScript project that creates a cinematic, scroll-controlled frame-by-frame animation driven by a 151-frame image sequence stored in `/public/15fpsframes/`.

Key features:
- HTML5 Canvas rendering
- requestAnimationFrame-driven playback
- Preloads all frames for smooth playback
- Sticky canvas with 450vh scroll height
- Responsive scaling and high-DPR support
- Framer Motion-driven text animations
- Tailwind CSS for design

How to run:

1. Install deps:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

Notes:
- Ensure the `/public/15fpsframes/` folder exists and contains files `000.png` through `150.png`.
- Images are preloaded on mount; loading progress is visible in the UI.

# Shambhavi Upadhyay: portfolio

A Next.js (App Router) + TypeScript + Tailwind CSS v4 site, with Framer Motion for animation and Lenis for smooth scrolling. It builds to a fully static site in `out/`.

**All text lives in [`src/content.ts`](src/content.ts).** Edit that file to change words, numbers, links, projects, or the case-study diagrams. You never need to touch a component to update content.

---

## 1. Run it on your computer

You need **Node.js 20 or newer** (check with `node -v`; install from https://nodejs.org).

```bash
# in this folder
npm install        # first time only
npm run dev        # starts http://localhost:3000 and reloads as you edit
```

To check the production build:

```bash
npm run build      # creates the static site in ./out
npm start          # serves ./out at http://localhost:3000
```

---

## 2. Deploy free on Vercel (recommended)

1. Create a GitHub repository (e.g. `portfolio`) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/ushambhavi14-coder/portfolio.git
   git push -u origin main
   ```
2. Go to https://vercel.com and sign in with GitHub.
3. Click **Add New → Project**, pick the `portfolio` repo, and click **Deploy**. Vercel detects Next.js automatically, so no settings need to change.
4. In about a minute you get a URL like `https://portfolio-xyz.vercel.app`.
5. Open `src/content.ts`, set `profile.siteUrl` to that URL (or your custom domain), then commit and push. Every push to `main` redeploys automatically.

### Connect a custom domain

1. Buy a domain from any registrar (Namecheap, Cloudflare, Google Domains/Squarespace, Porkbun, etc.).
2. In Vercel: **Project → Settings → Domains → Add**, then type your domain (e.g. `shambhaviupadhyay.com`).
3. Vercel shows you the DNS records to add. At your registrar's DNS settings, typically:
   - **Apex domain** (`shambhaviupadhyay.com`): an `A` record → `76.76.21.21`
   - **www** (`www.shambhaviupadhyay.com`): a `CNAME` record → `cname.vercel-dns.com`

   Use whatever values Vercel shows you; they are the source of truth.
4. Wait for DNS to update (minutes to a few hours). Vercel issues the HTTPS certificate automatically.
5. Update `profile.siteUrl` in `src/content.ts` to the new domain and push.

---

## 3. Alternative: GitHub Pages

Because the site is a static export, it can also run on GitHub Pages.

1. In `next.config.ts`, if your site will live at `https://ushambhavi14-coder.github.io/portfolio/` (a project page), add:
   ```ts
   basePath: "/portfolio",
   ```
   Skip this if you use a custom domain or a repo named `ushambhavi14-coder.github.io`.
   With `basePath` set, also prefix the image and resume paths in `content.ts` with `/portfolio`.
2. Run `npm run build`.
3. Add an empty file named `.nojekyll` inside `out/` (so GitHub serves the `_next` folder).
4. Publish the contents of `out/` to a `gh-pages` branch (for example with `npx gh-pages -d out --dotfiles`), then in the repo go to **Settings → Pages** and choose the `gh-pages` branch.
5. Custom domain: in **Settings → Pages → Custom domain**, enter the domain, then at your registrar add a `CNAME` for `www` → `ushambhavi14-coder.github.io` and `A` records for the apex → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.

---

## 4. Common edits

| I want to… | Do this |
|---|---|
| Change any text | Edit `src/content.ts` |
| Replace my photo | Put a 4:5 portrait in `public/images/` and update `profile.photo` in `content.ts` (keep a ~960px and ~560px version) |
| Update my resume | Replace `public/resume.pdf` (keep the phone number off: this file is public) |
| Add a demo / repo link to a project | Add `{ label: "Watch demo", href: "https://…" }` to that project's `links` array |
| Change a case-study diagram | Edit that project's `diagram` in `content.ts`. Nodes sit on a 720 × 380 canvas (`x`, `y` = top-left corner, `w` = width); edges connect node ids |
| Mark a project shipped | Change its `status` from `"in-progress"` to `"shipped"` and add real `results` |
| Change the accent colour | Edit `--accent` in `src/app/globals.css` (dark) and under `[data-theme="light"]` |
| Switch the form to Formspree | See below |

### Switch the form to Formspree (optional)

The contact form currently opens the visitor's email app with everything filled in (mailto), so no account is needed. To receive messages directly instead:

1. Create a free form at https://formspree.io and copy its endpoint (e.g. `https://formspree.io/f/abcdwxyz`).
2. In `src/components/Contact.tsx`, inside `send`, replace the line `window.location.href = href;` with:
   ```ts
   await fetch("https://formspree.io/f/abcdwxyz", {
     method: "POST",
     headers: { "Content-Type": "application/json", Accept: "application/json" },
     body: JSON.stringify({ name, email, intent: intentObj.label, message }),
   });
   ```
3. Change the "202 Accepted" status text in the same file to say the message was sent.

---

## 5. Project structure

```
public/
  images/            your portrait (webp + jpg)
  resume.pdf         public resume (phone number removed)
  favicon.svg, og.png
src/
  content.ts         ← all site content
  app/
    layout.tsx       fonts, metadata, theme bootstrapping
    page.tsx         section order
    globals.css      colour tokens (dark + light), base styles
  components/
    Providers.tsx    Lenis smooth scroll + Framer Motion settings
    Nav.tsx, ThemeToggle.tsx, ScrollProgress.tsx, BackToTop.tsx
    Hero.tsx, HeroBackground.tsx (dot grid + signal pulses)
    About.tsx, Counter.tsx, Impact.tsx
    Experience.tsx   self-drawing timeline
    Projects.tsx     pinned horizontal scroll (desktop) / grid (mobile)
    ProjectCard.tsx  tilt card with stack reveal
    WhitePaper.tsx   case-study modal
    Diagram.tsx      animated system figures
    Skills.tsx, Credentials.tsx, Contact.tsx, Footer.tsx
```

## 6. Accessibility and motion

- Visitors whose OS asks for reduced motion get native scrolling, no hero pulses, no packet animation, no tilt, and a simple grid instead of the pinned project scroller. Counters show their final numbers.
- All interactive elements work by keyboard, with visible focus. The case-study modal traps focus and closes with Esc.
- Theme choice is saved per visitor.

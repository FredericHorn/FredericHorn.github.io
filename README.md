# Mathematical Academic Website

A personal academic website built with Next.js, MDX, Tailwind CSS, and Framer Motion. Designed for presenting mathematical research with visual storytelling, interactive tools, and clean typography.

## Architecture

```
math-website/
├── content/
│   └── blog/                    # MDX blog posts (add .mdx files here)
├── public/
│   └── images/                  # Static images
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── layout.tsx           # Root layout (nav + footer)
│   │   ├── research/
│   │   │   ├── page.tsx         # Research overview
│   │   │   └── group-ctp/
│   │   │       └── page.tsx     # Scroll-based research story
│   │   ├── projects/
│   │   │   └── page.tsx         # Projects grouped by category
│   │   ├── tools/
│   │   │   ├── page.tsx         # Tools overview
│   │   │   └── pascal-triangle/
│   │   │       └── page.tsx     # Interactive Pascal's triangle
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Individual blog post
│   │   ├── about/
│   │   │   └── page.tsx         # About page
│   │   ├── legal/
│   │   │   └── page.tsx         # Impressum + Privacy
│   │   └── not-found.tsx        # 404 page
│   ├── components/
│   │   ├── layout/              # Navigation, Footer
│   │   ├── ui/                  # AnimatedSection, Card, PageHeader
│   │   ├── home/                # HeroGraph
│   │   ├── research/            # ScrollSection, PolytopeVisualization
│   │   ├── tools/               # PascalTriangle
│   │   └── blog/                # (ready for blog-specific components)
│   └── lib/
│       └── blog.ts              # MDX loading utilities
├── Dockerfile
├── docker-compose.yml
├── tailwind.config.ts
├── next.config.mjs
└── mdx-components.tsx           # Custom MDX components
```

## Quick Start

### Prerequisites
- Node.js 18+ (20 recommended)
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment on VPS

### Option A: Direct Node.js

```bash
# On your VPS:
git clone <your-repo> && cd math-website
npm ci
npm run build
npm start
```

Use a process manager like pm2:

```bash
npm install -g pm2
pm2 start npm --name "math-website" -- start
pm2 save
pm2 startup
```

### Option B: Docker

```bash
# Build and run
docker compose up -d

# Or manually:
docker build -t math-website .
docker run -d -p 3000:3000 --name math-website math-website
```

### Reverse Proxy (nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Add HTTPS with certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

## Writing Blog Posts

Create a `.mdx` file in `content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2024-12-01"
description: "A short description."
tags: ["math", "essay"]
---

Your content here. You can use **Markdown** and custom components:

<Theorem title="My Theorem">
The statement of your theorem.
</Theorem>

<Definition title="My Definition">
A precise definition.
</Definition>

<Aside>
A side note or remark.
</Aside>

LaTeX math works inline $e^{i\pi} + 1 = 0$ and in display mode:

$$
\sum_{k=0}^{n} \binom{n}{k} = 2^n
$$
```

## Adding New Tools

1. Create a component in `src/components/tools/YourTool.tsx`
2. Create a page at `src/app/tools/your-tool/page.tsx`
3. Add the tool to the list in `src/app/tools/page.tsx`

## Adding New Research Pages

1. Create a directory `src/app/research/your-topic/`
2. Add a `page.tsx` using `ScrollSection` and `AnimatedSection` components
3. Link from the research overview page

## Design System

**Colors:**
- `ink-*`: Warm neutral grays (text, borders)
- `accent`: Deep green (#1a5c3a) — primary accent
- `theorem`: Warm brown (#8b4513) — theorem environments
- `chalk`: Warm off-white background

**Typography:**
- Display: Cormorant Garamond (serif, elegant)
- Body: Source Sans 3 (clean sans-serif)
- Mono: JetBrains Mono (code, labels)

**Components:**
- `<AnimatedSection>`: Scroll-triggered fade-in
- `<ScrollSection>`: Parallax scroll effects
- `<StickyReveal>`: Side-by-side sticky visual + scrolling text
- `<Card>`: Content card with hover effect
- `<PageHeader>`: Consistent page title with ornament

## Customization

- **Colors**: Edit `tailwind.config.ts` → `theme.extend.colors`
- **Fonts**: Edit `tailwind.config.ts` → `theme.extend.fontFamily` and update the Google Fonts import in `globals.css`
- **Content**: All text is in page components — edit directly
- **Legal**: Update `src/app/legal/page.tsx` with your details
- **Metadata**: Update `src/app/layout.tsx` for site-wide meta

## No External Dependencies

This site intentionally avoids:
- ❌ Cookies
- ❌ Analytics / tracking
- ❌ Databases
- ❌ Authentication
- ❌ Forms
- ❌ Comments

The only external connection is Google Fonts. To self-host fonts, download them and update the CSS import.

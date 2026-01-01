# 🖼️ Image Optimization Guide for NeuroDev AI

## Current State
Your site currently uses:
- ✅ SVG icons (inline) - Already optimal
- ✅ CSS gradients for backgrounds - Already optimal  
- ✅ Text-based hero (LCP element) - Already optimal
- ✅ `/social-preview.jpg` - Only used in OG meta tags (not rendered)

**Result:** No image optimization needed currently! Your LCP is text-based which is perfect.

## Future Implementation: When Adding Images

When you add case study photos, team headshots, or product images, use this pattern:

### ❌ WRONG WAY (Current Standard HTML)
```astro
<img src="/images/case-study.jpg" alt="Case Study" />
```

**Problems:**
- No WebP conversion (files 30-50% larger)
- No explicit dimensions (causes CLS)
- No lazy loading
- No responsive sizes

### ✅ CORRECT WAY (Astro Native Image)

```astro
---
import { Image } from 'astro:assets';
import caseStudyImage from '../assets/images/case-study-hero.jpg';
---

<!-- For Above-the-Fold Images (LCP Priority) -->
<Image 
  src={caseStudyImage} 
  alt="Magento 2 Performance Optimization Case Study" 
  width={1920} 
  height={1080}
  format="webp"
  quality={85}
  loading="eager"
  fetchpriority="high"
  decoding="async"
  class="rounded-3xl"
/>

<!-- For Below-the-Fold Images (Lazy Load) -->
<Image 
  src={teamPhoto} 
  alt="NeuroDev AI Engineering Team" 
  width={800} 
  height={600}
  format="webp"
  quality={80}
  loading="lazy"
  decoding="async"
/>
```

### Key Attributes Explained

| Attribute | Value | Why |
|-----------|-------|-----|
| `format="webp"` | Always use WebP | 30-50% smaller than JPEG |
| `loading="eager"` | For LCP images | Prevents lazy loading delay |
| `loading="lazy"` | For other images | Defers loading until viewport |
| `fetchpriority="high"` | For hero/LCP | Browser prioritizes this download |
| `decoding="async"` | All images | Prevents blocking main thread |
| `quality={85}` | Hero images | Balance quality/size |
| `quality={75}` | Thumbnails | More aggressive compression |

### Responsive Images Example

```astro
<Image 
  src={heroImage}
  alt="Enterprise Magento Architecture"
  widths={[400, 800, 1200, 1920]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
  format="webp"
  quality={85}
/>
```

### Background Images (CSS)

If you need CSS background images, preload them:

```astro
---
import { getImage } from 'astro:assets';
import heroBg from '../assets/hero-background.jpg';

const optimizedBg = await getImage({ 
  src: heroBg, 
  format: 'webp',
  width: 1920 
});
---

<head>
  <!-- Preload critical background image -->
  <link rel="preload" as="image" href={optimizedBg.src} fetchpriority="high" />
</head>

<div style={`background-image: url(${optimizedBg.src})`}>
  <!-- Content -->
</div>
```

## Performance Impact

Without optimization:
- ❌ case-study.jpg: 850KB, no lazy load
- ❌ LCP: 3.2s
- ❌ CLS: 0.15 (layout shift)

With Astro Image optimization:
- ✅ case-study.webp: 245KB (-71% size)
- ✅ LCP: 1.1s (-65% faster)
- ✅ CLS: 0.01 (explicit dimensions)

**Lighthouse Performance:** +15-20 points when images are added

## Installation
Already installed! `sharp` package in your `package.json` handles the processing.

## Migration Checklist

When adding new images:
- [ ] Import image at top of `.astro` file
- [ ] Use `<Image />` component instead of `<img>`
- [ ] Add explicit width/height
- [ ] Set format="webp"
- [ ] Use loading="eager" for LCP, "lazy" for others
- [ ] Add descriptive alt text
- [ ] Test with Lighthouse after deployment

# OCX5 Landing Page - Execution Plan

## PHASE 1: PLANNING DOCUMENT ✅

**Status:** 🚀 PHASE 2 IN PROGRESS - Step 2 Complete  
**Target Route:** `/OCX5`  
**Theme:** Fantasy Wizard World (Original, No Copyrighted Characters)  
**Goal:** Magical 2D storytelling landing page with scroll-driven narrative

---

## 1. HIGH-LEVEL ARCHITECTURE

### Overall Page Structure

The page will follow a **single-page scroll narrative** with 5 major sections, each telling part of the story:

```
┌─────────────────────────────────────┐
│  1. HERO SECTION (Introduction)     │  ← Full viewport, magical entrance
├─────────────────────────────────────┤
│  2. EVENT INFORMATION               │  ← Story context & details
├─────────────────────────────────────┤
│  3. LINE-UP SECTION                 │  ← Magical performers reveal
├─────────────────────────────────────┤
│  4. TICKET PRICING                  │  ← Pricing tiers with magic
├─────────────────────────────────────┤
│  5. FINAL CTA (Buy Ticket)          │  ← Conversion-focused finale
└─────────────────────────────────────┘
```

### User Journey Flow

1. **Hero**: User lands → Magical portal/wizard scene appears → Call to explore
2. **Event Info**: Scroll reveals → Story context unfolds → Event details materialize
3. **Line-up**: Scroll continues → Performers appear with magical reveals → Each artist gets spotlight
4. **Pricing**: Scroll further → Pricing tiers appear → Clear value proposition
5. **CTA**: Final scroll → Strong conversion prompt → Buy Ticket button prominent

### Section Dimensions

- **Hero**: `100vh` (full viewport height)
- **Event Info**: `100vh` (full viewport height)
- **Line-up**: `100vh` (full viewport height, scrollable if many artists)
- **Pricing**: `80vh` (slightly shorter)
- **CTA**: `60vh` (compact, focused)

---

## 2. TECHNICAL STACK

### Framework & Core
- ✅ **Next.js 16** (App Router) - Already in project
- ✅ **React 19** - Already in project
- ✅ **TypeScript** - Already in project

### Animation Libraries
- ✅ **GSAP 3.13.0** - Already installed
  - **Usage**: ScrollTrigger for scroll-based animations, Timeline for complex sequences
  - **Justification**: Industry standard, powerful, performant, excellent scroll control
- ✅ **Lottie React 2.4.1** - Already installed
  - **Usage**: Magical particle effects, wizard animations, spell casting effects
  - **Justification**: Lightweight, scalable vector animations, perfect for fantasy theme

### Styling
- ✅ **Tailwind CSS v4** - Already configured
  - **Usage**: Utility-first styling, responsive design, custom animations
- **Custom CSS**: For complex animations and magical effects not covered by Tailwind

### Illustration & Assets
- **SVG**: For wizard characters, magical elements, icons (scalable, performant)
- **Lottie JSON**: For animated magical effects (particles, spells, portal effects)
- **Images**: Background textures, event photos (optimized WebP/AVIF)

### Scroll & Interaction Handling
- **GSAP ScrollTrigger**: Primary scroll animation controller
- **Intersection Observer API**: Fallback for performance monitoring
- **Smooth Scroll**: Native CSS `scroll-behavior: smooth` (already in globals.css)
- **Scroll Snap** (Optional): For section-by-section navigation on mobile

### Performance Optimizations
- **Next.js Image**: For optimized image loading
- **Lazy Loading**: Components load on scroll into viewport
- **Code Splitting**: Each section as separate component with dynamic imports
- **Animation Performance**: Use `transform` and `opacity` only (GPU-accelerated)
- **Debounced Scroll Events**: Prevent excessive calculations

---

## 3. COMPONENT BREAKDOWN

### Root Component: `OCX5Page`
**Location:** `src/app/OCX5/page.tsx`

**Responsibility:**
- Main page wrapper
- Scroll container setup
- Global animation context provider
- Section orchestration

**Animation Strategy:**
- Initialize GSAP ScrollTrigger on mount
- Coordinate section transitions
- Handle scroll progress tracking

**Dependencies:**
- GSAP ScrollTrigger
- All section components

---

### Section 1: `HeroSectionOCX5`
**Location:** `src/app/components/ocx5/HeroSectionOCX5.tsx`

**Responsibility:**
- Magical entrance animation
- Wizard/portal visual introduction
- Primary hero message
- Initial CTA (optional, soft)

**Animation Strategy:**
- **On Load**: Portal opens, wizard appears, text fades in sequentially
- **Scroll Down**: Elements fade out, hint to scroll appears
- **Timeline**: 2-3 seconds entrance animation

**Key Elements:**
- Wizard character illustration (SVG)
- Magical portal/background (Lottie or animated SVG)
- Event title with magical text reveal
- Subtitle/description
- Scroll indicator (optional)

**Dependencies:**
- GSAP (Timeline, ScrollTrigger)
- Lottie React (for portal effect)
- Custom wizard SVG assets

---

### Section 2: `EventInfoSectionOCX5`
**Location:** `src/app/components/ocx5/EventInfoSectionOCX5.tsx`

**Responsibility:**
- Event date, time, location
- Event description/story
- Key event highlights

**Animation Strategy:**
- **On Scroll In**: Elements slide in from sides (staggered)
- **Parallax**: Background moves slower than foreground
- **Reveal**: Text appears word-by-word or line-by-line

**Key Elements:**
- Date/time card (magical reveal)
- Location card (with map pin animation)
- Description text (typewriter or fade-in)
- Decorative magical elements (floating particles, stars)

**Dependencies:**
- GSAP ScrollTrigger
- Custom date/time formatting utility

---

### Section 3: `LineupSectionOCX5`
**Location:** `src/app/components/ocx5/LineupSectionOCX5.tsx`

**Responsibility:**
- Display lineup of performers
- Each artist gets spotlight reveal
- Artist cards with photos/bios

**Animation Strategy:**
- **On Scroll In**: Artist cards appear one by one (staggered)
- **Hover**: Cards lift/glow on hover
- **Scroll Progress**: Cards rotate/transform based on scroll position
- **Magic Effect**: Each artist appears with spell animation

**Key Elements:**
- Artist card grid/list
- Artist photos (circular or custom shape)
- Artist names with magical typography
- Artist descriptions/bios
- Decorative magical frames around cards

**Dependencies:**
- GSAP ScrollTrigger
- Lineup data (from props or API)
- Image optimization (Next.js Image)

---

### Section 4: `PricingSectionOCX5`
**Location:** `src/app/components/ocx5/PricingSectionOCX5.tsx`

**Responsibility:**
- Display ticket pricing tiers
- Clear value proposition
- Visual pricing cards

**Animation Strategy:**
- **On Scroll In**: Pricing cards flip in (3D transform)
- **Hover**: Cards scale up, glow effect
- **Recommended Badge**: Highlighted tier pulses gently
- **Price Numbers**: Count-up animation on reveal

**Key Elements:**
- Pricing tier cards (3-4 tiers)
- Price display (large, prominent)
- Feature list per tier
- "Recommended" badge (if applicable)
- Comparison table (optional)

**Dependencies:**
- GSAP ScrollTrigger
- Pricing data (from props or API)

---

### Section 5: `CTASectionOCX5`
**Location:** `src/app/components/ocx5/CTASectionOCX5.tsx`

**Responsibility:**
- Final conversion prompt
- Prominent "Buy Ticket" button
- Urgency elements (if applicable)
- Trust indicators

**Animation Strategy:**
- **On Scroll In**: CTA slides up from bottom
- **Button**: Pulsing glow, hover scale
- **Particles**: Magical particles around button
- **Continuous**: Subtle background animation

**Key Elements:**
- Main CTA button (large, prominent)
- Supporting text
- Trust badges/indicators
- Social proof (optional)
- Magical background effects

**Dependencies:**
- GSAP ScrollTrigger
- Router navigation (Next.js)
- Lottie React (for button effects)

---

### Shared Components

#### `MagicalParticles`
**Location:** `src/app/components/ocx5/MagicalParticles.tsx`

**Responsibility:**
- Reusable particle effect component
- Configurable density, speed, colors

**Animation Strategy:**
- Canvas-based or CSS-based particles
- Continuous floating animation
- React to scroll (optional)

---

#### `ScrollIndicator`
**Location:** `src/app/components/ocx5/ScrollIndicator.tsx`

**Responsibility:**
- Visual hint to scroll
- Animated arrow/chevron

**Animation Strategy:**
- Bounce animation
- Fades out after first scroll

---

#### `WizardCharacter`
**Location:** `src/app/components/ocx5/WizardCharacter.tsx`

**Responsibility:**
- Reusable wizard illustration
- Configurable poses/expressions

**Animation Strategy:**
- SVG path animations
- Idle animations (breathing, subtle movement)

---

## 4. ANIMATION & STORYTELLING STRATEGY

### Scroll-Based Storytelling Implementation

#### Approach: **Progressive Reveal with Scroll Progress**

1. **Scroll Progress Tracking**
   - Use GSAP ScrollTrigger to track scroll progress (0-1)
   - Map progress to animation states
   - Each section has its own ScrollTrigger instance

2. **Section Transitions**
   - **Entering Viewport**: Elements animate in (fade, slide, scale)
   - **In Viewport**: Elements remain visible, subtle animations
   - **Leaving Viewport**: Elements fade out or stay (depending on design)

3. **Parallax Effects**
   - Background layers move at different speeds
   - Creates depth and immersion
   - Use `transform: translateY()` for performance

4. **Staggered Animations**
   - Multiple elements animate in sequence
   - Creates rhythm and flow
   - Use GSAP's `stagger` property

### Global vs Section-Based Animations

#### Global Animations
- **Scroll Progress Bar**: Top of page, shows overall progress
- **Background Particles**: Continuous, subtle magical particles
- **Navigation** (if added): Fixed header with scroll-based visibility

#### Section-Based Animations
- Each section manages its own animations
- Triggered by ScrollTrigger when entering viewport
- Independent timeline per section
- Cleanup on unmount

### Performance Considerations

1. **GPU Acceleration**
   - Use `transform` and `opacity` only
   - Avoid `width`, `height`, `top`, `left` changes
   - Use `will-change` sparingly

2. **Lazy Loading**
   - Load heavy assets (images, Lottie) on scroll into viewport
   - Use Next.js `Image` component with `loading="lazy"`

3. **Animation Optimization**
   - Limit simultaneous animations
   - Use `requestAnimationFrame` for custom animations
   - Debounce scroll events

4. **Code Splitting**
   - Dynamic imports for section components
   - Load GSAP only when needed

5. **Reduced Motion**
   - Respect `prefers-reduced-motion` media query
   - Provide static fallbacks

---

## 5. EXECUTION TO-DO LIST

### Step 1: Project Setup & Dependencies ✅
**Status:** Already Complete
- [x] Next.js 16 configured
- [x] GSAP installed
- [x] Lottie React installed
- [x] Tailwind CSS configured
- [x] TypeScript configured

**Action Items:**
- [x] Verify GSAP ScrollTrigger plugin is available (may need to check import)
- [x] Create directory structure: `src/app/OCX5/` and `src/app/components/ocx5/`

---

### Step 2: Base Layout & Route Setup ✅
**Status:** COMPLETED
**Estimated Time:** 30 minutes

**Tasks:**
- [x] Create `src/app/OCX5/page.tsx` (main page component)
- [x] Create `src/app/OCX5/layout.tsx` (optional, for page-specific metadata)
- [x] Set up basic page structure with scroll container
- [x] Add page metadata (title, description, OG tags)
- [x] Test route accessibility at `/OCX5`

**Deliverable:** ✅ Working route with empty sections

---

### Step 3: Hero Animation
**Estimated Time:** 2-3 hours

**Tasks:**
- [ ] Create `HeroSectionOCX5.tsx` component
- [ ] Design/create wizard character SVG (or source placeholder)
- [ ] Create/import magical portal Lottie animation
- [ ] Implement entrance animation with GSAP Timeline
- [ ] Add scroll-out animation (fade on scroll down)
- [ ] Add scroll indicator component
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Test animation performance

**Deliverable:** Fully animated hero section

**Approval Checkpoint:** ⏸️ Wait for approval before proceeding

---

### Step 4: Event Info Section
**Estimated Time:** 2 hours

**Tasks:**
- [ ] Create `EventInfoSectionOCX5.tsx` component
- [ ] Design date/time card layout
- [ ] Design location card layout
- [ ] Implement scroll-triggered animations (staggered reveal)
- [ ] Add parallax background effect
- [ ] Add decorative magical elements (particles, stars)
- [ ] Responsive design
- [ ] Test scroll animations

**Deliverable:** Animated event information section

**Approval Checkpoint:** ⏸️ Wait for approval before proceeding

---

### Step 5: Line-up Section
**Estimated Time:** 3-4 hours

**Tasks:**
- [ ] Create `LineupSectionOCX5.tsx` component
- [ ] Design artist card layout
- [ ] Create artist data structure/interface
- [ ] Implement scroll-triggered card reveals (staggered)
- [ ] Add hover animations (lift, glow)
- [ ] Add magical reveal effect per artist
- [ ] Implement responsive grid (1 col mobile, 2-3 cols desktop)
- [ ] Optimize images (Next.js Image)
- [ ] Test performance with multiple artists

**Deliverable:** Animated lineup section with artist cards

**Approval Checkpoint:** ⏸️ Wait for approval before proceeding

---

### Step 6: Ticket Pricing Section
**Estimated Time:** 2-3 hours

**Tasks:**
- [ ] Create `PricingSectionOCX5.tsx` component
- [ ] Design pricing card layout
- [ ] Create pricing data structure
- [ ] Implement 3D flip-in animation on scroll
- [ ] Add hover effects (scale, glow)
- [ ] Implement price count-up animation
- [ ] Add "Recommended" badge animation
- [ ] Responsive design (stack on mobile)
- [ ] Test animations

**Deliverable:** Animated pricing section

**Approval Checkpoint:** ⏸️ Wait for approval before proceeding

---

### Step 7: CTA & Conversion Polish
**Estimated Time:** 1-2 hours

**Tasks:**
- [ ] Create `CTASectionOCX5.tsx` component
- [ ] Design prominent CTA button
- [ ] Implement scroll-triggered slide-up animation
- [ ] Add button hover effects (pulse, glow, scale)
- [ ] Add magical particles around button
- [ ] Connect button to ticket purchase flow (`/ticket` route)
- [ ] Add trust indicators (optional)
- [ ] Responsive design
- [ ] Test conversion flow

**Deliverable:** Conversion-optimized CTA section

**Approval Checkpoint:** ⏸️ Wait for approval before proceeding

---

### Step 8: Performance & Accessibility Pass
**Estimated Time:** 1-2 hours

**Tasks:**
- [ ] Add `prefers-reduced-motion` support
- [ ] Optimize images (WebP/AVIF, proper sizing)
- [ ] Lazy load heavy components
- [ ] Add loading states
- [ ] Test on slow networks (throttle in DevTools)
- [ ] Add ARIA labels for screen readers
- [ ] Test keyboard navigation
- [ ] Verify color contrast (WCAG AA)
- [ ] Test on multiple devices/browsers
- [ ] Performance audit (Lighthouse)
- [ ] Fix any console errors/warnings

**Deliverable:** Production-ready, accessible, performant page

**Final Approval Checkpoint:** ⏸️ Ready for production

---

## 6. DESIGN CONSTRAINTS & GUIDELINES

### Fantasy/Magical Vibe
- **Color Palette**: Deep purples, blues, golds, mystical greens
- **Typography**: Magical, elegant fonts (consider custom fonts)
- **Visual Elements**: Stars, particles, portals, spell effects, mystical symbols
- **Mood**: Enchanting, immersive, wonder-inspiring

### 2D Illustration Style
- **Flat Design**: No heavy 3D, focus on 2D illustrations
- **SVG First**: Use SVG for scalability and performance
- **Lottie for Motion**: Animated effects via Lottie JSON
- **Consistent Style**: All illustrations follow same artistic direction

### Scroll-Driven Narrative
- **Progressive Story**: Each scroll reveals next part of story
- **Smooth Transitions**: No jarring jumps, smooth flow
- **Visual Continuity**: Elements connect between sections

### Conversion-First
- **Clear CTAs**: Prominent, obvious call-to-action buttons
- **Value Proposition**: Clear pricing, clear benefits
- **Trust Signals**: Security badges, testimonials (if applicable)
- **Not Over-Animated**: Animations enhance, don't distract

### Mobile-Friendly
- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large tap targets, swipe gestures
- **Performance**: Fast loading on mobile networks
- **Readable**: Text sizes appropriate for mobile

### Accessibility
- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Reduced Motion**: Respect user preferences

---

## 7. ASSETS NEEDED

### Illustrations (SVG)
- [ ] Wizard character (multiple poses: idle, casting spell, pointing)
- [ ] Magical portal/background
- [ ] Decorative elements (stars, crystals, magical symbols)
- [ ] Event logo/branding (if different from main site)

### Animations (Lottie JSON)
- [ ] Portal opening animation
- [ ] Spell casting effect
- [ ] Particle effects (multiple variations)
- [ ] Magical sparkles/stars

### Images
- [ ] Event photos (optimized)
- [ ] Artist photos (circular/custom shape, optimized)
- [ ] Background textures (if needed)

### Fonts (Optional)
- [ ] Magical/fantasy font for headings (if not using existing)
- [ ] Body font (Inter already available)

---

## 8. DATA STRUCTURE

### Event Data Interface
```typescript
interface EventData {
  title: string;
  date: string;
  time: string;
  location: {
    name: string;
    address: string;
    mapUrl?: string;
  };
  description: string;
  highlights: string[];
}
```

### Lineup Data Interface
```typescript
interface Artist {
  id: string;
  name: string;
  photo: string;
  bio: string;
  genre?: string;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
  };
}

type Lineup = Artist[];
```

### Pricing Data Interface
```typescript
interface PricingTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  recommended?: boolean;
  available?: boolean;
}

type Pricing = PricingTier[];
```

---

## 9. RISK MITIGATION

### Potential Issues & Solutions

1. **Performance on Low-End Devices**
   - **Solution**: Use `will-change` sparingly, limit simultaneous animations, provide reduced motion option

2. **Large Asset Sizes**
   - **Solution**: Optimize images, lazy load, use Next.js Image component, compress Lottie files

3. **Scroll Jank**
   - **Solution**: Use `transform` only, debounce scroll events, use GSAP's optimized ScrollTrigger

4. **Browser Compatibility**
   - **Solution**: Test on major browsers, provide fallbacks for older browsers

5. **Accessibility Concerns**
   - **Solution**: Follow WCAG guidelines, test with screen readers, provide keyboard navigation

---

## 10. SUCCESS METRICS

### Technical Metrics
- [ ] Lighthouse Performance Score: > 90
- [ ] Lighthouse Accessibility Score: > 95
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3s
- [ ] No console errors

### User Experience Metrics
- [ ] Smooth scroll (60fps animations)
- [ ] Mobile-friendly (responsive, touch-friendly)
- [ ] Accessible (keyboard navigation, screen reader support)
- [ ] Clear conversion path (CTA visible, easy to find)

---

## NEXT STEPS

1. **Review this plan** with stakeholders
2. **Approve design direction** (fantasy theme, color palette, illustration style)
3. **Source/create assets** (wizard illustrations, Lottie animations)
4. **Gather data** (event details, lineup, pricing)
5. **Approve execution plan** → Proceed to Step 2

---

## APPROVAL CHECKPOINTS

After each major section completion, we will:
1. ✅ Show working demo
2. ⏸️ Wait for approval/feedback
3. 🔄 Make adjustments if needed
4. ✅ Proceed to next section

**Current Status:** 🚀 **PHASE 2 IN PROGRESS - Step 2 Complete, Ready for Step 3**

---

*This document will be updated as implementation progresses.*


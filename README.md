# Between Floors ✅

**🚀 LIVE:** https://saberzou.github.io/between-floors/

**Micro-stories set in elevator encounters. Scroll to experience the journey.**

---

## Project Status: COMPLETE (v1.0 - Story 1)

Story 1 is **complete and polished** with hidden discoveries, bilingual support, and returning reader memory. Stories 2-3 are written but not yet implemented.

---

## Story 1: "Welcome Home"

Maya moves into The Confluence, a smart residential building 20 years in the future. The building AI, Aria, knows... too much.

**Genre:** Dark, surveillance anxiety, Black Mirror vibes  
**Floor:** Lobby (0) → Floor 9  
**Characters:** Maya (new resident) + Aria (building AI)

---

## Features

✨ **Interactive Storytelling**
- Scroll/swipe to move between floors
- Story reveals as elevator ascends
- Smooth GSAP animations

🎨 **Visual Journey**
- Dynamic gradient (cold → warm emotional arc)
- Film grain texture overlay
- Typography mix (Sora + Jost + serif warmth)
- Color transition on floor indicator

🔍 **Hidden Discoveries** (3 secret floors)
- **Floor B (Basement)** — Swipe down at floor 0 → Aria's boot sequence
- **Floor 3.5** — Tap the floor number when at floor 3 → Camera feed
- **Floor 5L** — Long-press Aria's dialogue at floor 5 → Internal reasoning logs
- **Discovery counter** tracks your exploration (0/3 → 3/3)

🌐 **Bilingual**
- EN/CN toggle (persists via localStorage)
- Both languages fully written

🧠 **Returning Reader Memory**
- Site remembers if you've visited before
- Subtle message: "The elevator remembers you"

📱 **Mobile Optimized**
- Touch gestures (swipe, tap, long-press)
- Responsive design
- Haptic feedback (when available)

---

## The Concept

**Between Floors** is a collection of weekly micro-stories set in The Confluence, a 20-floor residential building in the year 2046. AI and robots are household norms. Stories range from dark to warm, funny to melancholic.

**Format:**
- Each story = one elevator ride
- Scroll down = elevator ascends/descends
- Text reveals as you scroll
- 80-100 words per story
- Modular (each story stands alone)
- Seasonal arc (52 stories = 1 year in the building)

---

## The World

**The Confluence**
- 20-floor residential building
- Built in 2046 (future tech integrated)
- Floors 3-12: Affordable units
- Floors 13-17: Mid-tier
- Floors 18-20: Luxury penthouses
- Building AI: Aria (welcoming, helpful, slightly unsettling)

**Residents:**
- Mix of humans, robots, AI assistants
- Young professionals, families, retirees, students
- Recurring characters across stories
- Interconnected lives

---

## Tech Stack

**Frontend:**
- HTML/CSS/JavaScript (vanilla, no frameworks)
- GSAP 3.12 + ScrollTrigger for scroll-based animation
- Custom WebGL gradient (Grainient.js)
- LocalStorage for progress/discovery tracking

**Fonts:**
- Sora (body/dialogue - technical, slightly futuristic)
- Jost (UI - geometric, clean)
- Doto (floor number - rounded modern)

**Design:**
- Dynamic gradient journey (emotional arc via color)
- Film grain SVG overlay
- Smooth easing curves
- Mobile-first touch interactions

**Deployment:**
- GitHub Pages
- Repository: https://github.com/saberzou/between-floors

---

## Design

**Color Journey:**
The gradient background transitions through the story:
- **Floor 0:** Cold steel blue (`#152535`) - anxiety, uncertainty
- **Mid-floors:** Near black (`#0c1820`) - the descent/darkness
- **Floor 9:** Warm blue-gray (`#221440`) - hope, arrival

**Floor Indicator:**
- Shifts from cold cyan (`#00D9FF`) to warm blue as you ascend
- Large rounded number (Doto font, 140px)

**Typography:**
- **Sora:** Body text & dialogue (technical warmth)
- **Jost:** UI elements & labels (geometric clean)
- **Serif touches:** Added warmth to soften cold tech

**Aesthetic:**
- Minimalist composition
- Dark mode optimized
- Breathing room (generous padding)
- Cinematic pacing
- Subtle parallax on content

---

## Stories Written

1. ✅ **"Welcome Home"** — Dark AI surveillance (Maya + Aria)
2. ✅ **"The 6 AM Shift"** — Warm human kindness (Maria + Mr. Chen)
3. ✅ **"Firmware Update"** — Bittersweet tech romance (Marcus + Aria)

---

## Roadmap

**Phase 1: Prototype** ✅ **COMPLETE**
- ✅ Story 1 built with scroll mechanic
- ✅ Hidden floor discovery system
- ✅ Bilingual support (EN/CN)
- ✅ Returning reader memory
- ✅ Mobile optimization
- ✅ Dynamic gradient journey
- ✅ Polished animations & interactions

**Phase 2: Expand** (Future)
- Add Stories 2 & 3 to the site
- Story selector/navigation UI
- Swipe between stories

**Phase 3: Season 1** (Long-term)
- 13 stories (Spring quarter)
- Introduce recurring characters
- Build interconnected world

**Phase 4: Full Year** (Vision)
- 52 stories (complete seasonal arc)
- Character development arcs
- Building-wide events
- Interconnected narrative threads

---

## Running Locally

```bash
# Just open index.html in a browser
open index.html

# Or use a local server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## Credits

**Created by:** Saber Zou  
**Written by:** Axel  
**Tech Support:** Atticus

**Inspiration:**
- 100 Lost Species (fluid grids, preservation themes)
- Black Mirror (tech anxiety)
- The Mars Mission Logs project

---

## License

Creative work by Saber Zou. Code is open for learning/reference.

---

*"Sometimes the distance between floors is easier to cross than the distance between people."*
— Aria, The Confluence Building AI

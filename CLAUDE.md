# Influencer AI Virtual Assistant

## Project Context
Building an AI-powered Virtual Assistant for a solo young female influencer.
- **Platforms:** Twitch (primary), Instagram, X (Twitter)
- **Niche:** Making friends, just chatting with different activities
- **Target audience:** Men
- **App type:** PWA (mobile + web) — React + Tailwind frontend, Node.js backend
- **AI engine:** Claude API only (no other paid tools)
- **Database:** SQLite
- **Deployment:** Self-hosted, single-user for now
- **Estimated API cost:** ~$4-8/month with smart model routing

## Key Files
- `VA-PLAN.md` — Full feature set, cost breakdown, architecture, and phased build plan

## Build Phases
1. Foundation + Content AI (React PWA + Node backend + Claude API)
2. Platform Integrations (Twitch, X, Instagram APIs)
3. Automation & Scheduling (auto-posting, go-live cross-posting, content calendar)
4. Engagement & Analytics (reply drafting, unified dashboard, daily briefing)
5. Advanced (brand deals, clip-to-reel pipeline, trend detection)

## Guidelines
- Use Haiku for simple tasks (captions, tweets), Sonnet for creative work, Opus sparingly
- All social platform APIs use free tiers
- Keep UI mobile-friendly — PWA installable on phone
- Single-user auth only (no multi-tenant complexity)
- Build on top of existing Influencer Planner HTML/CSS/JS codebase

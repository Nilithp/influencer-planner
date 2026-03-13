# Influencer AI Virtual Assistant — Master Plan

## Creator Profile
- **Platform focus:** Twitch (primary), Instagram, X (Twitter)
- **Niche:** Making friends, just chatting with different activities
- **Creator:** Solo young female influencer
- **Target audience:** Men
- **Deployment:** Self-hosted, single-user (potential SaaS later)
- **App type:** PWA (mobile + web)
- **AI engine:** Claude API (no other paid tools)
- **Estimated API cost:** ~$4-8/month

---

## Feature Set

### Twitch
| Task | What the VA Does |
|------|-----------------|
| Stream titles & tags | AI generates catchy titles based on activity + trending tags |
| Go-live notifications | Auto-posts "Going live!" to IG Stories + X with custom text |
| Clip detection | Flags high-engagement moments from chat for clipping |
| Chat analysis | Summarizes chat sentiment, top topics, viewer highlights post-stream |
| Raid suggestions | Suggests who to raid based on similar streamers online |
| Schedule management | Manages stream schedule, auto-updates on all platforms |
| Mod commands | AI-suggested custom chat commands based on community vibe |

### Instagram
| Task | What the VA Does |
|------|-----------------|
| Post generation | Captions, hashtags, carousel ideas for lifestyle/selfie/behind-scenes posts |
| Story ideas | Daily story prompts ("Q&A Monday", "Get Ready With Me", polls) |
| Reel scripts | Short scripts from stream highlights or trending audio |
| DM management | Draft replies to fan DMs, flag brand inquiries |
| Comment replies | AI-drafted replies to top comments (creator approves before posting) |
| Best time to post | Learns from engagement data |

### X (Twitter)
| Task | What the VA Does |
|------|-----------------|
| Tweet generation | Witty/flirty tweets, stream announcements, engagement bait |
| Thread creation | Turn stream topics into tweet threads |
| Reply suggestions | Draft replies to mentions and quote tweets |
| Trend hopping | Alert when a trending topic fits the niche |
| Community engagement | Suggest tweets to reply to for visibility |

### Cross-Platform
| Task | What the VA Does |
|------|-----------------|
| Content repurposing | Stream clip → Reel + Tweet + Story automatically |
| Unified analytics | All platform stats in one dashboard |
| Daily briefing | Morning summary of yesterday's performance + today's suggestions |
| Brand deal assistant | Draft outreach, rate cards, contract summaries |
| Content calendar | AI-planned weekly calendar across all 3 platforms |

---

## API Access (Free Tiers)

| Platform | API | What We Can Do | Limitations |
|----------|-----|----------------|-------------|
| **Twitch** | Helix API (free) | Stream data, clips, chat logs, followers, schedule | Can't auto-start streams |
| **Instagram** | Meta Graph API (free) | Post photos, reels, stories, get insights | Requires Business/Creator account + Meta app review (1-2 weeks) |
| **X / Twitter** | Free tier | Post tweets, read timeline, get mentions | 1,500 tweets/month write, 10K reads/month |

---

## Cost Estimate

### Claude API Pricing Reference
| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| Haiku 4.5 | $0.80 | $4.00 |
| Sonnet 4.6 | $3.00 | $15.00 |
| Opus 4.6 | $15.00 | $75.00 |

### Monthly Usage Breakdown
| Task | Frequency | Tokens/call | Model | $/month |
|------|-----------|-------------|-------|---------|
| Stream titles + tags | 5x/week | ~2K | Haiku | $0.15 |
| Go-live posts (IG+X) | 5x/week | ~1.5K | Haiku | $0.10 |
| Post-stream chat summary | 5x/week | ~8K | Sonnet | $1.50 |
| IG captions | 30x/month | ~2K | Haiku | $0.30 |
| IG story ideas | 30x/month | ~1.5K | Haiku | $0.20 |
| Reel scripts | 12x/month | ~3K | Sonnet | $0.70 |
| Tweets | 90x/month | ~1K | Haiku | $0.50 |
| DM/comment replies | 600x/month | ~1.5K | Haiku | $1.20 |
| Daily briefing | 30x/month | ~3K | Haiku | $0.30 |
| Analytics report | 4x/month | ~5K | Sonnet | $0.40 |
| Content calendar | 4x/month | ~4K | Sonnet | $0.35 |
| Brand email drafts | 10x/month | ~2K | Haiku | $0.10 |
| **TOTAL** | | | | **~$5.80** |

With prompt caching and batching: **~$4-8/month**

### Cost Optimization Strategies
- **Model routing:** Haiku for 70% of tasks, Sonnet for 25%, Opus for 5%
- **Prompt caching:** Reuse system prompts (saves 90% on cached tokens)
- **Batch API:** 50% discount for non-urgent tasks (analytics, weekly reports)
- **Local caching:** Cache repeated queries (hashtag suggestions, common replies)

---

## Architecture

```
┌─────────────────────────────────────┐
│          Frontend (PWA)             │
│  React + Tailwind (works on mobile) │
│  Install as app on phone + desktop  │
├─────────────────────────────────────┤
│          Backend (Node.js)          │
│  Express/Fastify API server         │
│  - Claude AI integration            │
│  - Social media API connectors      │
│  - Cron scheduler for auto-posting  │
│  - WebSocket for live notifications │
├─────────────────────────────────────┤
│         Database (SQLite)           │
│  - Content drafts & schedule        │
│  - Analytics cache                  │
│  - Chat logs & summaries            │
│  - Brand deal tracking              │
├─────────────────────────────────────┤
│       Platform APIs (Free)          │
│  Twitch Helix │ Meta Graph │ X API  │
└─────────────────────────────────────┘
```

---

## Build Phases

### Phase 1 — Foundation + Content AI
- Project structure (React PWA + Node backend)
- Claude API integration
- Content generation engine (captions, tweets, stream titles)
- Basic dashboard UI

### Phase 2 — Platform Integrations
- Twitch API (stream data, clips, schedule)
- X API (post tweets, read mentions)
- Instagram API (post, stories, insights)

### Phase 3 — Automation & Scheduling
- Auto-posting scheduler
- Go-live cross-posting workflow
- Content calendar with AI suggestions

### Phase 4 — Engagement & Analytics
- Comment/DM reply drafting
- Unified analytics dashboard
- Daily briefing generator

### Phase 5 — Advanced Features
- Brand deal tools
- Clip-to-Reel pipeline
- Trend detection
- Chat sentiment analysis

---

## Prerequisites
- [ ] Claude API key (console.anthropic.com)
- [ ] Twitch Developer App (dev.twitch.tv)
- [ ] X/Twitter Developer App (developer.twitter.com)
- [ ] Instagram Business/Creator account + Meta Developer App (developers.facebook.com)

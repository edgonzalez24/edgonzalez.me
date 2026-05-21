---
title: "AI Dev Workflow: What Actually Works vs. the Hype"
date: 2026-05-20
description: "Which AI tasks hold up in real Nuxt/TypeScript projects? A task-by-task reliability map with concrete before/after examples — no marketing claims."
tags: [ai, workflow, nuxt, vue, developer-tools]
author: Edwin Gonzalez
thumbnail: THUMBNAIL_PLACEHOLDER
---

I spent 40 minutes last month debugging a page that wouldn't render. The culprit was `queryContent('articles').find()` — perfectly valid syntax, zero red squiggles, thrown confidently by Claude because that's the `@nuxt/content` v2 API. The v3 way is `queryCollection('en_articles').all()`. Different function name, different argument shape, different mental model entirely. The AI wasn't wrong because it reasoned badly. It was wrong because its training data predates the API that actually ships in my project.

That distinction matters more than most AI workflow articles let on.

## The Training Data Problem Is Concrete, Not Abstract

Every popular AI assistant — Claude, Copilot, ChatGPT — was trained on a corpus that is, at minimum, months behind the current state of actively developed frameworks. For stable APIs, this is a non-issue. For Nuxt 4, `@nuxt/content` v3, and `@nuxt/ui` v4, it's a daily tax.

Here's the actual diff that trips people up:

```typescript
// What AI confidently generates — @nuxt/content v2 API
const { data } = await useAsyncData('articles', () =>
  queryContent('articles').find()
)

// What actually works in @nuxt/content v3
const { data: enArticles } = await useAsyncData('en-articles', () =>
  queryCollection('en_articles').all()
)
```

It compiles. It type-checks. It silently returns nothing at runtime, or throws a hydration error that sends you hunting through the wrong layer of the stack. I've seen this exact mistake in three different Nuxt projects from developers who aren't beginners. Same pattern with `@nuxt/ui` v4 — the old `:ui="{ body: { padding: 'p-0' } }"` prop syntax doesn't exist anymore. All slot overrides live in `app.config.ts` now.

The AI isn't hallucinating. It learned from real code that used to be correct.

## Where AI Actually Earns Its Keep

Here's the thing about the training lag problem: it's task-specific. There are tasks where AI is genuinely fast and the output is reliable, and tasks where it wastes more time than it saves.

After several months of paying attention to this — across my own projects and watching how other Vue/Nuxt developers talk about it — I've landed on a rough reliability map:

**High reliability (trust the output, quick-scan is enough):**
- Zod schemas from TypeScript interfaces
- Vitest unit tests for pure composables (specify "Vitest not Jest" — it defaults to `jest.fn()`)
- TypeScript interfaces and utility types
- Nuxt server route scaffolding with h3 (verify the `event` arg if you're calling `queryCollection` server-side — it's required there, optional client-side)
- Drafting ADRs and comparing libraries — research-mode tasks where hallucination risk is low

**Medium reliability (review carefully):**
- CSS with Tailwind v4 — it often adds a `tailwind.config.js` that Tailwind v4 doesn't use
- Generic Vue component structure — usually fine but watch for Options API contamination

**Low reliability (treat as a starting point only):**
- `@nuxt/content` v3 queries — training data is almost always v2
- `@nuxt/ui` v4 theming and slots
- Nuxt 4 `app/` directory file placement — AI puts files at the project root, which Nuxt 4 silently ignores

**Hard stop (never accept without a dedicated security review):**
- Authentication logic
- Input validation and sanitization
- Any code that touches permissions or external APIs with credentials

That last category isn't opinion — Apiiro found 322% more privilege-escalation paths and 153% more architectural design flaws in AI-generated security code. That number isn't a reason to be nervous. It's a reason to have a rule.

## Fixing the Training Lag: Three Approaches That Work

The reliability problem is real, but it's not a fixed ceiling. You can close the gap.

### 1. Feed it the real docs with `llms.txt`

Nuxt, Nuxt UI, and `@nuxt/content` all expose their documentation in a format designed for AI consumption at `/llms.txt` and `/llms-full.txt`. When you paste the relevant section into your context before asking a question, the AI stops reaching into its training data and uses what you gave it. Slower workflow, but drastically fewer v2-API mistakes.

### 2. Context7 MCP

This is the one I've actually integrated. Context7 is an open-source MCP server by Upstash — free, no registration. Two tools: `resolve-library-id` to find the library, `query-docs` to pull version-matched documentation for your specific question. When Claude Code has this available, asking about `queryCollection` returns v3 docs, not v2. The difference in output quality is noticeable.

### 3. A lean `CLAUDE.md` with project-specific gotchas

This one surprised me. I initially wrote a long CLAUDE.md covering everything. Anthropic's own guidance says that bloated instruction files cause Claude to start ignoring them. Now I keep mine short and specific:

```markdown
## Stack
- Nuxt 4 (app/ directory), @nuxt/ui v4, @nuxt/content v3
- Tailwind CSS v4 (no tailwind.config.js)

## Non-obvious gotchas
- queryCollection needs event as first arg in server/ routes
- Content queries: use queryCollection('en_articles'), NOT queryContent()
- All slot overrides go in app/app.config.ts under ui.componentName.slots
```

Three bullets. That's it. Each one prevents a class of mistakes that would otherwise take 20-30 minutes to diagnose.

::callout
The `nuxt-skills` project (github.com/onmax/nuxt-skills) takes a different approach — machine-readable markdown skill files that agents load on demand, regenerated weekly from the actual source docs. Worth bookmarking if you're working with Claude Code or Cursor heavily.
::

## The Technical Debt Nobody Talks About

GitClear analyzed 211 million lines of code and found something that should give every team pause: code duplication has risen from 8.3% in 2021 to 12.3% in 2024, and refactoring activity collapsed from 25% to under 10% of changed lines. AI-generated code is also being rewritten faster than human-written code — 7.9% of it gets revised within two weeks versus 5.5% historically.

There's also the phantom bug problem. OX Security found that 20-30% of AI codebases contain over-engineered logic for edge cases that are either improbable or impossible in the actual application context. This code passes all tests. It looks thoughtful. It silently makes the codebase harder to reason about, and nobody catches it until someone has to extend it.

The DORA 2025 report framed it well: AI amplifies the engineering system it operates in. Good practices, clear architecture, strong review culture — AI makes those better. Weak fundamentals, vague requirements, low test coverage — AI makes those worse, faster.

::card
DORA 2025: AI amplifies the engineering system it operates in. Mature teams see gains; teams with weak foundations see AI magnify existing dysfunction.
::

## What "Vibe Coding" Actually Costs

Andrej Karpathy coined the term in February 2025: describe intent, accept the implementation, don't review. Analysis of 470 GitHub PRs puts a number on what that costs — AI-generated code is 1.7x more likely to have major logic errors and 2.74x more prone to security vulnerabilities when it's accepted without review.

At first I thought this was mostly a junior developer problem. It turned out to be universal. Senior developers are also susceptible, especially when the code looks sophisticated and they're in a hurry. Sophisticated-looking code that's wrong is worse than obviously wrong code, because it buys more time before someone catches it.

The mitigation isn't complicated: read the diff. All of it. Same as you would for a PR from someone you don't know well.

## Zod Schemas Are the Sweet Spot

Here's where I keep coming back when I want to use AI for actual acceleration. Give it a TypeScript interface and ask for the Zod schema:

```typescript
// content.config.ts — @nuxt/content v3
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.date(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  thumbnail: z.string(),
})

export default defineContentConfig({
  collections: {
    en_articles: defineCollection({
      type: 'page',
      source: 'articles/en/**/*.md',
      schema: articleSchema,
    }),
  },
})
```

The output is almost always correct. The API is stable, the mapping is mechanical, and there's no framework-specific version drift to worry about. Same story for Vitest unit tests on pure composables — specify "Vitest not Jest" in your prompt, and the output is usable with minimal review. These aren't glamorous use cases, but they're the ones that actually save time without creating a cleanup bill.

## The Honest Picture

90% of developers use AI daily. Roughly 30% don't trust the output. Both numbers can be true at the same time, because "using AI" covers everything from rubber-duck prompting to fully accepting generated PRs.

The developers I know who get consistent value from AI tools share one habit: they know which tasks to hand off and which tasks to keep. They don't treat the tool as a productivity booster across the board. They treat it as a specialized junior that's exceptionally good at certain things, dangerously overconfident on others, and doesn't know which is which.

If you're working in a Nuxt/Vue/TypeScript stack right now, start by reading the reliability map above, picking one high-reliability task to automate, and tracking whether it actually saves you time. That's a more useful experiment than trying to AI-assist your entire workflow at once.

The training lag problem isn't going away. But it's also not an excuse to avoid the tools entirely — it's just the real shape of what you're working with.

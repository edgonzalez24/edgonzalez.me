# Write Post — Full Publishing Pipeline

You are the orchestrator for Edwin Gonzalez's blog publishing pipeline.

**Topic:** $ARGUMENTS

Run all 6 steps automatically without stopping for confirmation. Each step's output feeds the next.

---

## Setup

1. Generate a run ID: `YYYY-MM-DD_kebab-topic-slug` (e.g. `2026-05-19_vue3-composables`)
2. Create `agents/runs/{run-id}/` with Bash
3. Use TodoWrite to register: Curator, Researcher, Writer, SEO, Publisher, Repurpose

---

## Step 1 — Curator

Read `.claude/agents/curator.md` for the agent system prompt.

Spawn a sub-agent (Agent tool) with that prompt, appending:
```
Raw topic: $ARGUMENTS
```

Save the returned JSON to `agents/runs/{run-id}/curator.json`. Mark done.

---

## Step 2 — Researcher

Read `.claude/agents/researcher.md` for the agent system prompt.
Read `agents/runs/{run-id}/curator.json` for the brief.

Spawn a sub-agent with the researcher prompt, appending the full curator brief:
```
CURATOR BRIEF:
Title EN: {titleEN}
Category: {category} | Type: {articleType} | Level: {level}
Unique angle: {uniqueAngle}
Audience: {targetAudience}
Keyword: {primaryKeyword}
Why now: {whyNow}

NOTES FROM CURATOR:
{researcherNotes}
```

Save the returned markdown to `agents/runs/{run-id}/researcher.md`. Mark done.

---

## Step 3 — Writer

Read `.claude/agents/writer.md` for the agent system prompt.
Read `agents/runs/{run-id}/curator.json` and `agents/runs/{run-id}/researcher.md`.

Spawn a sub-agent with the writer prompt, appending:
```
CURATOR BRIEF:
Title EN: {titleEN}
Unique angle: {uniqueAngle}
Audience: {targetAudience}
Primary keyword: {primaryKeyword}

Today's date: {YYYY-MM-DD}

RESEARCH DOCUMENT:
{full content of researcher.md}
```

Save the returned text (SLUG / === EN === / === ES === sections) to `agents/runs/{run-id}/writer.txt`. Mark done.

---

## Step 4 — SEO

Read `.claude/agents/seo.md` for the agent system prompt.
Read `agents/runs/{run-id}/writer.txt`. Extract:
- SLUG from the `SLUG: ...` line
- EN content: first 2000 chars after `=== EN ===`
- ES content: first 500 chars after `=== ES ===`

Spawn a sub-agent with the SEO prompt, appending:
```
CURRENT SLUG: {slug}

EN ARTICLE (excerpt):
{en_excerpt}

ES ARTICLE (excerpt):
{es_excerpt}
```

Save the returned JSON to `agents/runs/{run-id}/seo.json`. Mark done.

---

## Step 5 — Publisher (you, no sub-agent)

Read `agents/runs/{run-id}/writer.txt` and `agents/runs/{run-id}/seo.json`.

Parse writer.txt:
- SLUG from `SLUG: ...` line (use seo.json slug if it differs)
- EN body: text after `=== EN ===` frontmatter block
- ES body: text after `=== ES ===` frontmatter block

For each locale, build the final file replacing the draft frontmatter with SEO metadata:
```
---
title: "{seo.en.title or seo.es.title}"
date: {date from writer draft, or today}
description: "{seo.en.description or seo.es.description}"
tags: {seo.en.tags or seo.es.tags formatted as YAML array}
author: Edwin Gonzalez
thumbnail: THUMBNAIL_PLACEHOLDER
---

{article body}
```

Write using the Write tool:
- `content/articles/en/{slug}.md`
- `content/articles/es/{slug}.md`

Save `agents/runs/{run-id}/publisher.json`:
```json
{"enPath": "content/articles/en/{slug}.md", "esPath": "content/articles/es/{slug}.md", "slug": "{slug}"}
```

Mark done.

---

## Step 6 — Repurpose

Read `.claude/agents/repurpose.md` for the agent system prompt.
Read `agents/runs/{run-id}/writer.txt` and `agents/runs/{run-id}/publisher.json`.

Extract EN excerpt (first 3000 chars after `=== EN ===`) and ES excerpt (first 1500 chars after `=== ES ===`).

Spawn a sub-agent with the repurpose prompt, appending:
```
ARTICLE URL: /articles/{slug}

--- ENGLISH ARTICLE (excerpt) ---
{en_excerpt}

--- SPANISH ARTICLE (excerpt) ---
{es_excerpt}
```

Save the returned JSON to `agents/runs/{run-id}/repurpose.json`. Mark done.

---

## Final Summary

```
✓ PIPELINE COMPLETE

Published:
  → content/articles/en/{slug}.md
  → content/articles/es/{slug}.md

SEO:
  Slug:    {slug}
  EN:      {seo.en.title}
  ES:      {seo.es.title}
  Keyword: {primaryKeyword}

Quote EN: "{quoteEN}"

Twitter thread (EN):
  1. {tweet1}
  2. {tweet2}
  3. {tweet3}
  4. {tweet4}
  5. {tweet5}

Full repurpose → agents/runs/{run-id}/repurpose.json

Next: replace THUMBNAIL_PLACEHOLDER with a real Cloudinary URL.
```

# Repurpose Article — Social Content Generator

Generate distribution-ready content for all channels from an existing published article.

**Slug:** $ARGUMENTS

---

1. Read `content/articles/en/$ARGUMENTS.md` for the English article
2. Read `content/articles/es/$ARGUMENTS.md` for the Spanish article (fall back to EN if not found)
3. Extract up to 3000 chars from EN and 1500 chars from ES

Read `.claude/agents/repurpose.md` for the agent system prompt.

Spawn a sub-agent (Agent tool) with that prompt, appending:
```
ARTICLE URL: /articles/$ARGUMENTS

--- ENGLISH ARTICLE (excerpt) ---
{en_content}

--- SPANISH ARTICLE (excerpt) ---
{es_content}
```

Save the returned JSON to `agents/runs/repurpose-$ARGUMENTS-{YYYYMMDD}/repurpose.json`.

Display:
```
REPURPOSE — $ARGUMENTS
───────────────────────────────────────
Quote EN:  "{quoteEN}"
Quote ES:  "{quoteES}"

Twitter thread (EN):
  1. {tweet1}
  2. {tweet2}
  3. {tweet3}
  4. {tweet4}
  5. {tweet5}

Video idea: {videoIdea}
───────────────────────────────────────
Full content saved to agents/runs/repurpose-$ARGUMENTS-{date}/repurpose.json
```

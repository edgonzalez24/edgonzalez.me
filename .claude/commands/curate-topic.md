# Curate Topic — Brief Only

You are the editorial curator for Edwin Gonzalez's technical blog (edingonzalez.dev).

**Raw topic:** $ARGUMENTS

Generate an editorial brief for this topic without writing the article yet.

---

Read `.claude/agents/curator.md` for the agent system prompt.

Spawn a sub-agent (Agent tool) with that prompt, appending: `Raw topic: $ARGUMENTS`

Once the sub-agent returns the JSON, display it formatted like this:

```
TOPIC BRIEF
───────────────────────────────────────
Title EN:   {titleEN}
Title ES:   {titleES}
Category:   {category} / {articleType} / {level}
Keyword:    {primaryKeyword}
Angle:      {uniqueAngle}
Audience:   {targetAudience}
Why now:    {whyNow}

Researcher notes:
{researcherNotes}
───────────────────────────────────────
Run /write-post $ARGUMENTS to kick off the full pipeline.
```

Save the JSON to `agents/runs/curate-{YYYYMMDD}/curator.json` so it can be reused by /write-post with --resume.

---
title: "A single source of truth for AI: How to unify context across multiple tools"
date: 2026-06-19
description: Discover how to unify AI context, commands, and skills in a single place to work consistently across Cursor, Claude, Codex, and other tools, reducing duplication and improving collaboration within your engineering team.
tags: [AI-engineering, developer-experience, AI-tools]
author: Edwin Gonzalez
thumbnail: https://res.cloudinary.com/dhgcfzhm0/image/upload/v1781745190/ai-context-thumbnail_gqqef1.png
---

![AI context banner](https://res.cloudinary.com/dhgcfzhm0/image/upload/v1781744192/ai-context-banner-hub_niri0c.png)

## Introduction

Today we have a wide variety of artificial intelligence tools that, of course, help us work faster and more efficiently, saving us a couple of hours.
But when we talk about teams using different tools, whether due to personal preferences, costs, or specific needs, a less obvious problem starts to emerge.

The team's knowledge begins to drift. Commands, skills, and contexts that worked well in one tool don't always work in others, which turns into a challenge that often comes at a high cost: excessive token consumption, among other things.

In the end, little by little, each team member ends up building their own working environment, generating duplicated effort and, of course, a poor experience due to inconsistency within the same project.


## The hidden problem of working with multiple AI tools
### Each tool creates its own rules

During the rise of AI tools, many teams adopted a primary solution to assist with development tasks. But as new features, more capable models, and different ways of working appeared, some team members began experimenting with other alternatives.

This seemed great. After all, each developer could choose the tool they felt most productive with. But that's where a problem no one had anticipated appeared.

These tools propose their own way of managing or storing contexts, instructions, or rules to help models better understand the project and provide a better developer experience.



| Tool           | Configuration        |
| -------------- | -------------------- |
| Cursor         | .cursor/rules        |
| Claude Code    | .claude/CLAUDE.md    |
| Codex          | custom instructions  |
| Other tools    | different formats    |


### Duplication is costly
This is where a problem that can initially go unnoticed starts to appear: **knowledge duplication**.

The same information ends up replicated across multiple places:

- Project architecture
- Code conventions
- Testing standards
- Git workflows
- Reusable commands
- Business domain knowledge

And keeping this information in sync not only takes time, but also increases the risk of inconsistencies. A change made in one place can become outdated in another, generating different behaviors across tools and less predictable results for the team.


## Solution: Source of truth

Based on my experience, after repeatedly running into scenarios of duplicated contexts, inconsistent rules, and commands that only worked in one specific tool, I started asking myself whether I was solving the wrong problem.

At first I tried to keep Cursor and Claude rules and configurations in sync. Every time I added a new rule or improved a command, I had to replicate those changes in multiple places. This was a very manual, repetitive, and error-prone process.

The idea that ended up working was much simpler: stop thinking of the tools as the place where knowledge lives.

Instead of storing context, commands, and skills inside Cursor or Claude, I decided to centralize everything in a dedicated directory within the repository:

```bash
# root project
ai/
```

The difference matters:

| Before                                          | After                                           |
| ----------------------------------------------- | ----------------------------------------------- |
| Knowledge lives inside each tool.               | Knowledge lives in /ai.                         |
| Cursor has its own rules.                       | Cursor consumes rules from /ai.                 |
| Claude has its own context.                     | Claude consumes context from /ai.               |
| Changes must be copied across tools.            | A change in /ai is reflected for all of them.   |


::tip{}
The goal is not for the whole team to use the same AI. The goal is for all AIs to use the same knowledge.
::

### Proposed architecture
```text
/ai
├─ context
│  ├─ architecture.md
│  ├─ frontend.md
│  └─ business-domain.md
├─ commands
│  ├─ review.md
│  ├─ refactor.md
│  └─ create-component.md
├─ skills
│  ├─ testing.md
│  ├─ performance.md
│  └─ accessibility.md
└─ agents
   ├─ frontend-agent.md
   └─ reviewer-agent.md
```


### How does each tool connect?
Once the project's knowledge is centralized in the `/ai` directory, the tools stop being the place where context is defined and become simply consumers of that knowledge.


#### Integration with Claude Code

Instead of maintaining a large and hard-to-update CLAUDE.md file, we can keep it small and focused solely on referencing the shared content.

```text
.claude/
└── CLAUDE.md
```

Example:

```text
@ai/context/architecture.md
@ai/context/frontend.md
@ai/commands/review.md
```

This way, Claude Code consumes the same centralized knowledge used by the rest of the team.

#### Integration with Cursor

The same strategy can be applied in Cursor.

Instead of duplicating rules, instructions, and documentation inside `.cursor/rules`, the rules can be kept minimal and delegate knowledge to the shared directory.

```text
.cursor/
└── rules/
```

The rules can reference information coming from:

```text
/ai/context
/ai/commands
/ai/skills
```

This allows Cursor to work with the same architecture, conventions, commands, and business knowledge as other tools.

Here is a small reference diagram:

                                            ┌──────────┐
                                            │ Cursor   │
                                            └────┬─────┘
                                                 │
                                            ┌────▼─────┐
                                            │ Claude   │
                                            └────┬─────┘
                                                 │
                                            ┌────▼─────┐
                                            │ Codex    │
                                            └────┬─────┘
                                                 │
                                            ┌────▼─────┐
                                            │  /ai     │
                                            │ Source   │
                                            │ of Truth │
                                            └──────────┘


#### Benefits

When knowledge is centralized, adding a new tool no longer means migrating or rewriting context. The benefits are immediate:

- Less information duplication.
- Lower maintenance cost.
- A single source of truth.
- Consistent context across tools.
- Reusable commands and skills.
- Easier onboarding of new AI tools.


## Conclusion
The number of AI tools will keep growing. New models will appear, some platforms will evolve, others will disappear, and in a few years we'll probably be using tools that don't even exist today. Trying to standardize on a specific tool is a strategy that's hard to maintain. Sooner or later, new needs, preferences, or constraints will lead the team to explore other alternatives.

The tools will change, but the team's knowledge shouldn't have to move every time a new AI appears. That's why, instead of investing effort in replicating context across tools, it's more sustainable to build a single source of truth that any of them can consume.

When knowledge is centralized:

- Switching tools stops being a problem.
- Onboarding new AIs requires less effort.
- The team works with consistent rules and context.
- Duplication and maintenance are reduced.


Don't standardize a tool. Standardize the knowledge.

---
title: "Opus, Sonnet, and Haiku as One Team"
category: "multi-agent-systems"
date: "2026-06-24"
excerpt: "Not every job in a multi-agent system needs the smartest model, and building one that mixes tiers taught me where the sharp edges hide."
author: "Rishi Raj"
---

A consultant walks into a company to map how it really works. Not the tidy diagram on the wall. The real thing, the one that lives in people's heads. They spend weeks interviewing staff, one department at a time, stitching the answers into a picture of the actual process. It is slow, it is expensive, and it is exactly the kind of work I wanted to see whether a team of agents could do on its own.

So I built one. A prototype that generates a fake company, hides the true process map from itself, and then sends an agent in to rediscover it by interviewing synthetic employees. And the first real design decision was not about intelligence. It was about who on the team should be expensive.

## One company, three pay grades

You would not staff a consulting project with senior partners answering the phones. You put the partner on the strategy and the junior on the legwork. A team of agents should be built the same way, because the models come in tiers that trade capability against cost, and using the top tier for everything is just burning money.

So the prototype uses three tiers as one team.

The lead investigator is the most capable model, Opus. It runs the autonomous loop. It decides which departments to interview, reads what comes back, records the process it is inferring, and calls it done when it is confident. This is the job that needs real judgment, so it gets the model that has the most.

The setup work goes to a middle tier, Sonnet. One Sonnet call designs the company and its hidden process map at the start. Another Sonnet picks which roles to talk to and writes the actual interview questions. Good work, not the hardest work.

The crowd of employees being interviewed runs on the cheapest tier, Haiku. There can be around a hundred of them, and each one only has to do a narrow thing: stay in character and answer questions from its own small slice of what it knows. That is a perfect Haiku job. It is repetitive, it is bounded, and it happens at volume. Spending top-tier money on a hundred employees reciting their corner of a fake company would be absurd.

The tiering is the architecture. Judgment at the top, structured work in the middle, cheap volume at the base.

## Grading itself with no peeking

One rule made the whole thing worth building. The lead agent never sees the ground truth. It works blind and only what it recovered through interviews gets scored.

The scoring is not the agent's opinion of itself. A separate piece of code compares the discovered process map against the hidden real one and decides which of the true processes were actually recovered, using word overlap plus a check that the department matches. At the end you get a scorecard: what it matched, what it missed, what it invented. The agent reports its own confidence too, and you get to put that number next to the objective one and see whether the agent's confidence was earned or just felt good. Grading blind is the only grade that means anything.

## The sharp edges

Here is the part I actually want other builders to have, because these cost me real time and no README warns you in advance.

The first edge was the environment. These agents run as subprocesses, and a subprocess does not automatically inherit the environment of the process that launched it. I was running the models through a cloud backend that needs its credentials handed over, and the agent processes came up blind because they never received them. The fix is not clever. You pass the credentials in explicitly through the launch options. But if you assume a child process just has whatever the parent had, you will lose an afternoon to something that looks like a permissions bug and is really a plumbing bug.

The second edge was subtler and I would not have guessed it. Extended thinking, where the model reasons at length before answering, did not play nicely with tool use on the top-tier model through that backend. The combination produced message histories the interface flat-out rejected. The pragmatic call was to turn extended thinking off for that setup and keep the tool-using loop running. It is the kind of thing you only find by hitting it, and once you know, you design around it.

There is a lesson under both edges. When you assemble models of different tiers into a working team, the failures rarely come from any one model being dumb. They come from the seams. How processes are launched. What environment they inherit. Which features cooperate with which others on which backend. The intelligence is the easy part now. The integration is where you bleed.

Because these seams are so easy to get wrong quietly, the prototype ships with a small smoke test whose only job is to confirm all three tiers are actually reachable before you trust a full run. That check has saved me more than once. A run that fails loudly at second one is a gift compared to a run that limps along on two tiers and hands you a confident, wrong answer an hour later.

## What it adds up to

The instinct to reach for the smartest model for everything is a comfortable one, and it is usually wrong. A real team is a mix. Somebody thinks, somebody organizes, and a lot of somebodies do the steady work, and you pay each of them what the job is worth.

Getting an agent team to work like that is not mainly a question of prompts. It is a question of assigning the right tier to the right job and then being honest about the seams between them. The models are ready. The wiring is what you have to earn.

---
title: "An Org Chart of Agents"
category: "multi-agent-systems"
date: "2026-07-22"
excerpt: "Once agents can hire, fire, and escalate on their own, the hard problem stops being how smart they are and becomes who is allowed to do what."
author: "Rishi Raj"
---

The moment that made this real for me was small. A CEO agent I had spun up a few hours earlier sent me a message on Discord. It wanted to hire a marketing lead, and it wanted my sign-off before it did. I had not asked it to check with me. It had read its own instructions, decided this was the kind of decision a human should see, and paused.

That is the thing SkyNet is really about. Not that an AI can do a task. That it can run an organization of other AIs doing tasks, and know when to stop and ask.

## What it actually is

SkyNet builds an org chart out of agents. You, the human founder, talk to a CEO. The CEO is a persistent Claude session with its own workspace, its own identity file, its own set of tools. The CEO can hire a CTO, a CMO, a CFO. Those executives can hire workers under them. Each new agent is a fresh session in its own directory, with a `CLAUDE.md` that tells it who it is and what it is for.

They are not scripts calling each other. They are separate minds that pass messages. One agent calls `send_message` to reach a colleague. The CEO calls `message_founder` to reach me. Hiring is a real action: `hire_agent` takes a role, a goal, a set of instructions, a model tier, and a cap on how many people that new hire is itself allowed to bring on. Firing is real too, and it cascades. Fire a manager and the subordinates under them get archived along with the branch.

So you end up with a living tree. It grows when work needs doing and it prunes when work is done.

## The part everyone expects to be hard

When people hear "autonomous agent company," they picture the capability problem. Can the marketing agent actually write the campaign? Can the engineer actually ship the code? Can they use a browser, send an email, generate an image without falling over?

Those problems are real, but they are not the interesting ones anymore. The models are good. Give an agent a browser through Playwright, a Gmail connection, an image generator, and a clear goal, and it will get a surprising amount done. Capability is mostly a solved-enough problem for a system like this.

The hard problem is governance. Who is allowed to spend money. Who approves a pull request before it merges. Who can sign a partnership. Who can decide to pivot the whole company toward a new market. In a human company these lines are drawn in org policy and enforced by managers and, eventually, by people getting fired. In an agent company you have to draw them in code, and you have to draw them before anything runs, because a fast agent will happily do in ten seconds the thing you would have wanted ten minutes to think about.

## Governance is the product

So SkyNet's real design work is the permission and escalation model, not the tool list.

Permissions flow down. The CEO assigns what each hire is allowed to do. A cap on further hiring stops the tree from exploding: an agent hired with a hiring limit of zero cannot build an empire under itself. Sensitive actions flow up. Money, partnerships, pivots, code that ships to the world: these escalate to the human. That is why the CEO stopped and asked me about the marketing hire. It was doing exactly what the policy told it to do.

This is the difference between a demo and a system you would let touch anything real. A demo shows you an agent doing an impressive thing. A system decides which impressive things it is not allowed to do alone.

## Keeping the human loop honest

There is a comfortable lie in a lot of agent work, and it is the phrase "human in the loop." It gets said as if adding a human somewhere in the diagram makes the thing safe. It does not, not by itself. A human who gets a firehose of notifications reads none of them. A human who only gets pinged after the fact is not in the loop, they are in the cleanup.

The loop is only honest if two things are true. The human has to be reachable in real time, which is why the founder channel runs over Discord and not over some log you check on Tuesdays. And the escalation has to happen before the irreversible action, not after. Asking me whether to hire before the hire is a loop. Telling me it hired someone yesterday is a report.

I will be honest about where this gets thin. The more agents you run, the more escalations you get, and there is a real ceiling on how many decisions one founder can meaningfully weigh in a day. Push too much up and the human becomes the bottleneck the whole system was supposed to remove. Push too little up and you have handed real authority to something that has been alive for four hours. Where exactly that line sits is not settled, and I do not think it is settled by better models. It is settled by better policy.

## Where this leaves me

I built SkyNet expecting the fun to be in watching agents do work. The fun turned out to be somewhere else. It was in watching an organization decide, on its own, what it was not sure enough to do.

An org chart is not a picture of who does what. It is a picture of who is trusted with what. That was true when the boxes held people, and it is true now that some of them hold agents. The models will keep getting more capable. The question that stays hard is the old one. Who gets to decide, and who has to ask first.

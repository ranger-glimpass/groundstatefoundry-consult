---
title: "One Tool Per Server"
category: "applied-ai"
date: "2026-07-14"
excerpt: "Building an agent's toolbelt from small single-purpose servers instead of one big one, and why the small pieces are the ones you can actually trust."
author: "Rishi Raj"
---

The first time I gave an agent the ability to send email, the whole thing was about forty lines. A tiny server, one job: take a recipient, a subject, a body, and put it through SMTP. That was it. It did not know how to find prospects, did not know how to read replies, did not know anything about a campaign. It sent one email when asked.

I could hold the entire thing in my head. I could read it in a minute and be sure of what it would and would not do. That feeling, of being able to fully trust a small piece, is the thing this whole essay is about.

## The pull toward the monolith

There is a natural temptation, once you have a few of these, to fold them into one. One big outreach server that finds businesses, scrapes their emails, sends the message, reads the reply, tracks who you already contacted. It feels tidy. One thing to deploy, one thing to configure, one place to look.

I went the other way, and on purpose. The toolbelt under our outreach work is a set of small, single-purpose servers. Each one speaks the same protocol, the Model Context Protocol, which is just a shared way for an agent to discover and call tools. One server sends email over SMTP. A companion reads replies over IMAP, which is the protocol email clients use to pull messages from an inbox. Another searches businesses on Google Maps. Another scrapes emails from a website. A dedup layer, keyed on who you have already contacted, keeps you from hitting the same address twice across campaigns. Each is its own process, each does one thing.

Then you hand the agent exactly the tools a task needs, and nothing else.

## Why small is easier to trust

Think about a kitchen. You can buy one of those all-in-one machines that chops, blends, and cooks, and when it breaks you have no idea which part failed and you cannot use any of it while you find out. Or you can have a knife, a pan, and a blender. When the blender dies, you still have the knife. And you know exactly what the knife does, because a knife does one thing.

A single-purpose server is the knife. When the email sender misbehaves, I know the bug is somewhere in the code that sends email, because that is all it contains. Its failure cannot corrupt the thing that reads replies, because they do not share a process, a memory space, or a code path. One of our email servers even runs in subprocess isolation, a separate process boundary, specifically so that a messy dependency in one place cannot break imports somewhere else. That is not caution for its own sake. It is the same principle drawn one level deeper: keep the failure inside the smallest possible box.

Hardening works the same way. To harden a small server, you read all of it. There is no all of it in a monolith. In a big server, the send path and the scrape path and the dedup path are tangled together, and a change to one can quietly reach into another. In a small server the surface is the whole thing. You can reason about every input it accepts and every action it can take, because there are so few of them.

## Composition is where the power lives

The worry with small pieces is that you have just moved the complexity somewhere else. Now you have to wire them together, and does that not put the mess back?

It does not, because the wiring is the agent's job, not yours. The agent gets a toolbelt, the union of whatever servers you allow-listed for that task, and it composes them at runtime. Find businesses, then scrape their emails, then check dedup, then send, then later read the replies. The agent picks the order. You did not build a pipeline. You built a set of verbs and let the agent form the sentences.

That is also how you control blast radius. A task that only needs to read replies gets the reply reader and nothing else. It has no send tool, so it cannot send, no matter what it decides. You are not asking it to refrain. You simply did not hand it the knife. The set of things an agent can do is the set of tools in front of it, and that set is a decision you make per task, in one config file, not a property you hope the agent respects.

## What survives to production

None of this was theory. These small servers ran real outreach, seeding prospects, sending mail, reading what came back. And when that work grew into a productized platform, the shape came with it. The productized version exposes around forty typed tools, but the instinct underneath is the same one that started with a forty-line email sender: one clear job per surface, a boundary you can see all the way around, a failure that stays in its box.

The monolith would have been tidier to deploy. It would have been much harder to trust. I will take the drawer full of small sharp tools every time, because when something goes wrong at 2am, I want to open exactly one file and know that the answer is entirely inside it.

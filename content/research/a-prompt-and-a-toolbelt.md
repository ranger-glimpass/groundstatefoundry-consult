---
title: "A Prompt and a Toolbelt Is the Product"
category: "applied-ai"
date: "2026-08-26"
excerpt: "I ran real outbound sales with a general coding agent, a big set of tools, and one instructions file, and it changed what I think a product is."
author: "Rishi Raj"
---

I wanted to sell something, and I did not want to build a sales tool to do it.

So I did the lazy thing on purpose. I took a general coding agent, the same kind of assistant you point at a bug in your codebase, and I pointed it at the open web instead. I handed it a pile of tools and a single file of instructions, and I told it to go find businesses, find the right person, write to them, and book me meetings. Then I let it run. Not for an hour. Day and night, one prospect after another, following up on its own schedule, reading the replies that came back and answering them.

It worked. And the part that stuck with me is not that it worked. It is how little there was to it.

## There was no app

When people picture a sales-outreach product, they picture software. Screens, a database of leads, a rules engine that decides who to email and when, a template system, a scheduler. Someone sat down and designed all of that, feature by feature, and every decision the product makes was decided in advance by a person writing code.

I did not build that. What I built was two things.

The first is a toolbelt. A tool, here, is just a small capability the agent can reach for, the way you reach for a specific app on your phone. Search a map for plumbers in a city. Pull a company's website and read it. Find a decision-maker's email address. Send an email as me. Check whether a reply came back. I gave the agent more than fifty of these. Each one does exactly one thing and does not think.

The second is the instructions file. One document, written in plain language, that tells the agent who we are, what a good prospect looks like, what a good email sounds like, when to follow up, when to stop, and what it must never do. No templates. No decision tree. Just the kind of briefing you would give a sharp new hire on their first morning.

That is the whole product. A belt of dumb tools and a paragraph of judgment. The reasoning that used to live in code now lives in the agent, and the agent supplies it fresh, per prospect, every time.

## What the agent actually does with that

Give a person a phone and a briefing and they know what to do. The agent is the same. It reads the instructions, looks at the target market, and starts working through it.

It finds a business. It reads the site to understand what they do. It hunts down the right person rather than firing into a generic inbox nobody reads. It checks that the email address is real before spending a send on it. It writes something short and human, grounded in something specific about that company, not a mail-merge with a name slotted in. It sends. It waits. When nothing happens, it follows up later, and later still, backing off the way a patient human would instead of nagging every day. When someone replies, it reads the reply, works out whether they are actually interested, and writes back in context. The ones who lean in, it moves toward a booked meeting.

Nobody wrote a function called `handle_reply`. The agent just handles the reply, because handling replies is what the instructions ask of it and the tools let it. The judgment is not compiled. It is thought through, live, each time.

## Why this is not a trick

The easy reaction is that this is a neat hack and a real product would still be the app. I used to think that too. I do not anymore.

Look at where the value sat. Almost none of it was in the tools. Anyone can call a maps search or send an email. The value was in the reasoning: which business is worth the effort, what to say to this person, whether that lukewarm reply is worth chasing. For decades we could not buy that reasoning, so we approximated it in code and called the code the product. The code stood in for a thinking worker we could not hire at scale.

Now we can. So the code that stood in for thinking gets thinner, and the thinking moves to the agent, and what is left of the product is the two things that were always the actual point: the tools that let it act on the world, and the instructions that say what good looks like.

I am not claiming numbers here. I know it ran continuously and generated real conversations, because the logs are full of them, but I did not run a controlled study and I will not pretend I did. What I am sure of is the shape.

## Where this points

I think a lot of software is about to get lighter in the middle.

Not the edges. You will still need real tools, the boring plumbing that touches the world, because an agent that can reason but cannot send an email is a philosopher in a locked room. And you will still need taste, packed into instructions, because an agent with no sense of what good looks like will do a great deal of confident, useless work. Those two ends matter more than ever.

It is the thick layer between them, the hand-coded logic that mimicked a person's judgment one branch at a time, that starts to melt. That was always the expensive part to build and the brittle part to maintain, and it was only ever there because we could not put a thinking thing in its place.

I later hardened this outreach agent into a real service with paying clients, called MechMagnet, and the lesson survived the productizing. The service is better tools, sharper instructions, and human supervision on top. It is not a rediscovered decision tree.

The uncomfortable version of this: if your product is mostly the logic in the middle, you did not build a moat. You built a placeholder for a worker who just showed up. The question worth sitting with is which end of your own product you have been neglecting, the tools or the taste, because those are the parts that were the point all along.

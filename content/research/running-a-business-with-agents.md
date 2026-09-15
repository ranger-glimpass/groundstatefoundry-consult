---
title: "Running a Business With an Agent Fleet"
category: "applied-ai"
date: "2026-08-16"
excerpt: "The agents do the daily work of the business, and the hard part turned out to be governing them, not building them."
author: "Rishi Raj"
---

The day-to-day work of MechMagnet is done by agents.

Not assisted by agents. Done by them. MechMagnet is a service that finds businesses drowning in missed calls, reaches out to them, screens the ones worth talking to, and books meetings. There is a set of AI agents that handle the pieces of that: one that researches who to go after, one that thinks about the economics and the go-to-market, one that does the outreach, one that works the conversations toward a close, one that handles delivery, one that runs the phone calls. A human owner sits above them and supervises. That human is me.

When I describe it this way, people ask how I built the agents. That is the wrong question. Building an agent that can send a good email is a solved afternoon. The thing that actually took the work, the thing that is hard and stays hard, is governing them.

## Capable is not the same as trustworthy

Here is the trap. An agent that is smart enough to do the job is also smart enough to do the wrong job with total confidence.

A human junior hire has a thousand quiet brakes on them. They feel awkward emailing a stranger something off. They hesitate before doing something that might be a mistake. They ask. An agent has none of that. Point it at a task and it will pursue the task to the edge of what its tools allow, cheerfully, at the speed of a machine, and it will not feel the moment where a reasonable person would stop and check.

So the problem of running a business on agents is not capability. It is the missing brakes. My whole job as the supervisor is to install the brakes that biology gives a human employee for free.

## Roles, so nobody owns everything

The first brake is boring and it is just structure. Each agent has a role, and the role has an edge.

The agent that does outreach is not the same agent that decides pricing. The one that sources prospects does not also close them. This is not because one agent could not physically do all of it. It is the same reason a company does not let the person who writes the checks also approve them. When one worker owns a whole loop end to end, there is nobody in the room to notice when the loop goes wrong. Splitting the work means the output of one agent becomes the input another one has to accept, and that seam is a place where a bad decision has to survive a second look before it becomes real.

Narrow roles also make the instructions sharper. An agent told to do one job well is easier to brief, easier to judge, and easier to catch than an agent told to run the business.

## Policies, written down like law

The second brake is policy, and the key word is written.

Every agent works against explicit documents: what it may do, what it must never do, what it should escalate instead of deciding. The refusals are not gentle suggestions buried in a friendly prompt. They are hard lines. Do not do this. When you hit this situation, stop and hand it up. Some of the most important lines have nothing to do with cleverness and everything to do with staying inside the law, because reaching out to strangers is regulated, and an agent does not know or care about that unless you make it a rule it cannot cross.

The reason to write these down, rather than trust a well-meaning agent to behave, is the same reason we write laws down rather than trusting good intentions. A written rule is inspectable. I can read it, argue with it, and change it in one place. A behavior that only lives inside the model's head at runtime is none of those things.

## Decision logs, so the past can be questioned

The third brake is memory, and it is the one I underrated at first.

When an agent makes a real decision, it writes down what it decided and why. When it hits something above its authority, it escalates, and that escalation is logged too. This sounds like bureaucracy. It is actually the single thing that makes the whole arrangement survivable.

Think about what goes wrong otherwise. Something in the funnel breaks. Meetings stop converting. If the agents did their work as an invisible stream of actions, I would be staring at a bad number with no way to walk backward to the choice that caused it. Because they log, I can. I open the record, follow the reasoning, find the exact decision that was wrong, and fix the rule that produced it. The log turns a mysterious outcome into a chain I can audit. It is the difference between a system you operate and a system that merely happens to you.

I lean on this constantly. The interesting operational moments in the business are not the agents doing the work. They are me reading back through what they decided, chasing why a number moved.

## The human is the exception handler

Put those three together and my role becomes clear. I am not in the loop for most of the work, and that is the point. The agents run the routine. I exist for the moments they cannot, or should not, settle on their own.

That is a real inversion of how we usually think about automation. The old model automated the easy parts and left the hard judgment to the human. This is the opposite. The agents carry the judgment of the day-to-day, which used to be my whole job, and I am reserved for the rare, expensive, or risky calls that sit above their authority. I am the exception handler. Most days the exceptions are few, which is exactly how you want it.

None of this is about the agents being brilliant. They are. That was never in doubt. It is that a fleet of brilliant, tireless workers with no instinct for when to stop is a dangerous thing to own unless you build the stopping in yourself. Roles give it seams. Policy gives it walls. Logs give it a memory you can interrogate.

The governance is the product. The agents are just the labor. Anyone about to run real work on a fleet will learn the same order I did: the easy part was teaching them to act, and the whole job was teaching the business to hold them accountable.

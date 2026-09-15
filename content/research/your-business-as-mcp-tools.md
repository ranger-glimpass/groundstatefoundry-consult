---
title: "Turning a Business Into Tools an Agent Can Operate"
category: "applied-ai"
date: "2026-07-04"
excerpt: "What it actually takes to expose a whole business function as typed tools an agent can call, and the things you have to harden before you dare hand over the keys."
author: "Rishi Raj"
---

Here is a strange thing to say out loud: most of a business is already a set of buttons.

Find a prospect. Send them an email. Create an ad. Launch it. Book a meeting. Take a payment. When you watch someone run sales development, they are pressing buttons in a sequence, in different apps, all day. The sequence is where the skill lives. The buttons themselves are simple.

So the question I kept circling was this. If the buttons are simple, and the skill is the sequence, could an agent press the buttons? Not one demo button in a sandbox. The real ones, in production, on a live business, all day. That is the bet behind MechMagnet: take a whole outreach and lead-generation motion and expose it as typed tools an agent operates on the company's behalf.

Around forty of them. Create and list campaigns. Build adsets and ads. Send email, SMS, WhatsApp, a direct message. Place a call. Post to social. Check whether someone opted out. Mint a sending identity. List prospects and conversations. Each one is a verb the agent can call, with a defined shape for what goes in and what comes back.

Getting to forty tools is not the hard part. Making it safe to let something press them is.

## Typed is not the same as safe

A typed tool is honest about its shape. It says: I need a campaign ID here, a recipient there, a body of this form, and I will hand you back a result that looks like this. That honesty is worth a lot. It means the agent cannot fumble the call in the small ways, the missing field, the wrong type, the malformed request, because the tool rejects those before anything happens.

But typing only guards the shape of a call. It says nothing about whether the call should happen at all. A perfectly typed "send email" is still a real email to a real person, and the type system is delighted to send a compliant-looking message to someone who begged you to stop. Types catch the typo. They do not catch the mistake. So the moment you have the tools working, the real work starts, and the real work is everything that stops a well-formed call from being a harmful one.

## The three things I hardened first

The first was the wall every send hits. Before any message goes out, on every channel, a compliance check runs: opt-out, quiet hours, dedup, per-channel rules, sensitive-vertical redaction. It fails closed, which means if the check does not return a clear yes, the send does not happen. The agent does not get to reason its way around it, because the check lives in the send path itself, not in the instructions I gave the agent. I trust the agent to be clever. I do not trust it to be careful, so careful is not its job.

The second was keeping tenants apart. The platform runs several brands on one engine, and the nightmare is one brand's agent touching another brand's data. The fix is not a rule that says "please don't." Each API key is bound to a single tenant, and every database query carries that tenant's ID inside it. There is no query that returns another tenant's rows, because the scope is welded into the query, not checked after the fact. Cross-tenant access is not forbidden. It is not expressible. That is a much stronger thing than forbidden.

The third was never handing the agent a key it could hurt someone with. The ad accounts are all operated server-side by a single system-level token that callers never see. When the agent asks to change an ad, it passes an object ID, and the server checks that ID against the ad platform to confirm it belongs to this tenant's account before it touches anything. The agent names what it wants. The server holds the power and verifies the request. The agent never holds the loaded thing directly.

## Let it create, but not fire

There is a smaller pattern woven through all of this that I have come to love. Ads are always created paused. The agent can build a whole campaign, adsets, ads, targeting, the lot, and none of it spends a cent until something explicitly activates it. Creation and activation are two separate acts.

That separation is the whole philosophy in miniature. You let the agent do the elaborate, creative, high-volume work freely, because that work is reversible and cheap. You put a second, deliberate gate in front of the one act that is expensive and hard to undo. The agent can draft the world. Turning it on is its own decision, made on purpose.

## What you are really building

When people hear "expose your business as tools an agent can drive," they picture the tools. The forty verbs. That is the visible part, and it is the easy part.

The thing you are actually building is the set of walls. The fail-closed gate that turns a bad decision into a blocked call. The tenant scope welded into every query so a mistake cannot cross a boundary. The power held server-side so the agent asks instead of holds. The pause before the spend. None of those show up in the tool list. All of them are the reason you can go to sleep while the agent works.

The tools are what let the agent act. The walls are what let you let it.

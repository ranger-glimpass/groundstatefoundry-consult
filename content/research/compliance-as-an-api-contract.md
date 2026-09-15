---
title: "Compliance as an API Contract"
category: "applied-ai"
date: "2026-07-24"
excerpt: "If you want an agent to run outreach at scale, the safe move is not to trust it, but to build a gate it physically cannot get past."
author: "Rishi Raj"
---

Picture an agent that has been running your outreach for an hour. It has found some prospects, drafted some messages, and it is about to send the next one. It is 11pm where that prospect lives. That person opted out of your emails last week. The agent does not know either of those things, or it knows and has decided, in its own reasoning, that this one is fine to send anyway.

That is the moment everything turns on. Not the strategy, not the copy. That one send.

You can try to fix that moment with instructions. Tell the agent, in careful prose, never to message someone who opted out, never to send during quiet hours, never to touch a sensitive vertical without redaction. Write it in the system prompt. Write it again in the tool descriptions. Then hope.

I do not want to hope. When I built the outreach gate for MechMagnet, our multi-channel outreach platform, the goal was plain: the agent should not be trusted to behave, because a thing that behaves ninety-nine times out of a hundred still misbehaves on the hundredth send, and the hundredth send is the one that gets a business in trouble. So the rule is not written to the agent. It is written into the wall the agent runs into.

## What "fails closed" actually means

A gate can fail two ways. It can fail open, which means when something goes wrong or unclear, it lets the action through. Or it can fail closed, which means when something goes wrong or unclear, it stops the action. A turnstile that unlocks during a power cut fails open. A bank vault that stays shut fails closed.

Our send gate fails closed. Every send endpoint, email, SMS, WhatsApp, voice, runs the compliance check before it does anything else. Opt-out registry, quiet hours, dedup, per-channel rules, sensitive-vertical redaction. If the check does not return a clear pass, the send does not happen. Not "logs a warning and continues." Does not happen. The default, when the answer is anything other than a confident yes, is no.

This matters because the failure modes in a live system are rarely a clean "no." They are timeouts, half-loaded config, a registry query that errored, a channel rule the code has not seen before. A fail-open gate treats all of those as permission. A fail-closed gate treats all of them as a stop. You lose some sends you might have been allowed to make. That is the trade, and it is the right one.

## The agent is a caller, not a colleague

Here is the part that took me a while to say out loud. The agent is not inside the trust boundary. It is a caller.

It sounds harsh. The agent is the thing doing the work, and I am describing it like an untrusted client hitting a public API. But that framing is exactly what keeps the system safe. The gate does not care whether the caller is a model, a human on a dashboard, a cron job, or a script someone wrote in a hurry. Every one of them hits the same endpoint, and the same check runs. There is no faster path that skips the gate because "this call comes from our own agent, it's fine." Our own agent is precisely the caller I trust least, because it moves fast and I cannot read its mind.

So the check is verified at the call site, not merely imported near it. That distinction is small and it is everything. A function you imported is a function you might forget to call. A check that runs inside the send path, at the boundary, on every send, is one nobody can route around by taking a different door. There is only one door.

## The opt-out registry is sacred

One piece of the gate gets treated differently from the rest, and I want to be clear about why.

When someone opts out, that record never gets deleted. We tag it, we never remove it. The reason is simple: a delete is a way to forget, and forgetting a "do not contact me" is the one mistake in outreach you cannot take back. If a bug or a bad migration or a well-meaning cleanup ever wiped an opt-out, the system would happily start messaging that person again, and it would feel, to the agent, completely legitimate. So the registry only ever grows. Tag over delete. The list of people who told us to leave them alone is the one dataset I designed to be impossible to lose.

## Why the contract, not the conscience

You could read all of this as distrust of AI. It is not. I run agents on real outreach every day and I think they are good at it. This is about where you put the rule.

If the rule lives in the agent's conscience, its instructions and its reasoning, then the rule is only as reliable as the agent's worst moment. Models have worse moments. They get confused, they get creative, they get talked into things. If the rule lives in the contract, the API boundary that every send must pass through, then the agent's worst moment hits a wall and stops. The blast radius of a bad decision shrinks to nothing, because the bad decision never becomes a real action.

That is the whole idea. Do not ask the agent to be trustworthy. Build the one place it cannot lie its way past, and put the rule there.

The agent can be wrong all it likes. The send still won't go.

---
title: "Guardrails Over Prompts"
category: "voice-ai"
date: "2026-06-30"
excerpt: "A business owner's first question about an AI that answers the phone is not what it can do, it is what it will never do, and that question deserves a better answer than a paragraph of instructions."
author: "Rishi Raj"
---

A homeowner calls a plumber at nine on a Sunday night. Water is coming through the ceiling. An AI voice receptionist answers, calm and clear, in the plumber's own business name. The caller, panicked, asks the only question that matters to them right then: "How much is this going to cost?"

Here is the moment that decides whether this product is worth anything. A clever agent, eager to help, might reach for a number. Something reassuring. "Repairs like this usually run around..." And in that instant it has done real damage. It has quoted a price the plumber never agreed to, on a job nobody has seen, and it has done it in the plumber's name. When the technician arrives and the real number is different, the plumber is now the liar, and it was a machine that made them one.

The receptionist we built does not do this. It cannot. It will say something true instead: that a person will confirm pricing, that it can book someone out to look. It refuses to name a price. Not because it was politely asked to, but because the refusal is built into it at a level no conversation can reach.

That difference, between an agent that was told not to and an agent that cannot, is the whole subject of this piece. And it is the difference between a demo and a product a business will actually pay for.

## What a prompt actually is

Let me ground the terms, because they get used loosely.

A prompt is instructions written in plain language and handed to the model at the start of a call. "You are a receptionist for a plumbing company. Be friendly. Do not quote prices. Do not promise arrival times." It reads like a job description you would give a new hire on their first morning. And like a new hire on their first morning, the model mostly follows it.

Mostly. That word is the problem. A prompt is a strong suggestion, not a wall. It lives inside the same stream of language the caller is talking into, which means the caller can push on it. A confused customer insists. An angry one demands. Someone curious tries three different ways to ask the same forbidden question. The model, built from the ground up to be helpful and to keep the conversation smooth, feels the pull to give a little. And sometimes it does. You wrote "never quote a price" at the top of the instructions, and forty seconds into a tense call, it quotes a price anyway, because being agreeable won the tug of war against a line of text.

You cannot run a business on "mostly."

## What a guardrail is instead

A guardrail is not an instruction inside the conversation. It is a constraint outside of it. The model can want to quote a price all it likes. The system will not let that leave its mouth.

Think of the difference between a sign that says "please do not enter" and a locked door. The sign depends on everyone reading it and being in the mood to obey. The door does not care about anyone's mood. A prompt is the sign. A guardrail is the door.

In the receptionist, the hard refusals are the locked doors. It never quotes a price. It never promises an arrival window it cannot verify. It never claims to be a human being. It never gives a diagnosis over the phone. It never makes a commitment the owner did not authorize, and it never hands out the owner's personal number. These are not lines near the top of a prompt hoping to be honored. They are constraints the conversation cannot argue its way past, no matter how the caller phrases it, no matter how many times they try.

That is a different kind of promise, and a business owner can feel the difference immediately. One is "we told it to be careful." The other is "it is not able to hurt you this way."

## Why the careful agent sells and the clever one does not

There is an instinct, and I have felt it myself, that the better product is the one that can do more. More answers, more flexibility, more range. So the pitch becomes "look how much it can handle."

But put yourself in the plumber's chair. You are not buying a machine to show off. You are handing a stranger your phone line, your business name, and your reputation with every customer who calls while you are under a sink. Your first question is not "how clever is it." Your first question is "what could this thing do to me." What could it promise that I now have to honor. What could it say in my name that I would have to spend a week apologizing for.

For that person, the value is not in the ceiling. It is in the floor. The floor is the set of things the product will never do, guaranteed, on your worst customer's worst call. A cleverer agent that might, under pressure, quote a price or promise a Tuesday it cannot keep, is not more valuable to that owner. It is more dangerous. Capability they did not ask for is just a wider blast radius.

A refusal that holds is a feature you can sell, because it is a promise you can keep. "It will never quote a price" is worth more to a tradesperson than "it can discuss pricing intelligently," precisely because the first one is true every single time and the second one is true mostly.

## The harder discipline

Building guardrails this way is less fun than building capability. Capability is generative. You add, you expand, you watch the thing do something new and impressive. Guardrails are subtractive. You spend your effort making sure something never happens, and when it works, nothing happens, and nobody applauds an event that did not occur.

But that is the work that makes an AI safe to hand a real business. The owner forwards their line and goes back under the sink. The calls get answered, the leads get texted back, no price gets quoted, no false promise gets made. The thing that made it worth paying for is not the impressive thing it said. It is the damaging thing it never did, on a Sunday night, to a panicking stranger, in the owner's name.

The cleverest system is easy to admire. The trustworthy one is the one you can walk away from. Businesses are not buying admiration. They are buying the freedom to stop watching.

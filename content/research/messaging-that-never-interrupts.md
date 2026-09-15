---
title: "Messaging That Never Interrupts"
category: "multi-agent-systems"
date: "2026-08-14"
excerpt: "When one agent needs to tell another something, the naive move is to interrupt, and the interruption is exactly what wrecks the work."
author: "Rishi Raj"
---

Picture two people deep in hard work. One of them thinks of something the other needs to know. The polite version of what happens next is a tap on the shoulder. The rude version is grabbing their arm mid-sentence and making them look at you right now.

Most agent-to-agent messaging is the rude version, and nobody means it to be. You have a fleet of Claude Code sessions working in parallel. One of them figures out something another one needs. The obvious thing to do is send it over. But an agent in the middle of a task is holding a lot in its head, the same way a person is, and the way most systems deliver a message is to shove it straight into the stream the agent is reading. You did not send information. You changed what the agent was thinking about. And you did it without asking.

I spent a while getting this wrong before I got it right, so let me walk through what "never interrupt" actually takes.

## The mailbox, not the phone call

The first fix is old and physical: a mailbox.

A phone call demands attention now. A letter waits on the mat until you choose to pick it up. When one agent messages another in the system I built, called Bubbles, it does not reach into the other agent's mind. It files a message in that agent's inbox and gets back an id. The message just sits there. The recipient is doing whatever it was doing, undisturbed.

The recipient learns it has mail through a quiet notice it picks up on its next turn, the natural pause between one unit of work and the next. Not mid-thought. At the seam. The agent reads its inbox when it is ready, clears what is there, and decides what to do about it. The sender never sets the timing. The reader does. That single inversion, reader decides when, is most of the whole design.

There is a subtlety worth naming. A tiny message can be written straight into the recipient's session without costing it a separate turn, because a one-line fact is cheaper to just hand over than to announce. A large one becomes the "you have mail" nudge instead. But even the inlined case is filed first and marked in a way that can never be mistaken for "the agent has dealt with this." The message exists on disk before anything tries to notify anyone. Nothing downstream can lose it. That is a rule, not a hope: no message is ever dropped.

## Letting the sender stop worrying

Here is the failure the mailbox alone does not fix. A sender who cannot see what happened to its message will nag.

Think about how a person behaves when a text goes unanswered. Did it send? Did they read it and ignore me? Should I send another one? Without any signal, the anxious move is to send again, and again, and now you have a fleet where every agent is poking every other agent because none of them can tell whether the first poke landed. That is not communication. That is a room full of people tapping shoulders.

So the sender can check status on anything it sent, and the answer is one of three plain states. Delivered. Read, no reply. Replied. That is enough for an agent to reason like a reasonable colleague. If it was delivered but not yet read, wait, the other agent simply has not reached a pause. If it was read and not replied, the recipient saw it and chose not to answer yet, so follow up if it truly matters, and otherwise leave them alone. The agent decides whether to follow up instead of being wired to nag. The read receipt is not a courtesy here. It is the thing that keeps the fleet quiet.

## You have to bound the noise anyway

I believed in all of the above, and it was still not enough, because policy is only as good as its worst day.

The trouble with "agents decide when to follow up" is that agents are built from models, and a model can get into a state where its judgment about following up is bad. One event in my fleet once got re-emitted more than a hundred times. Every polite rule about waiting and deciding was intact. It did not matter, because something upstream was fanning a single thing out across the whole fleet, and each copy was, on its own, a reasonable message to send.

The fix is not a smarter rule. It is a hard floor that no rule can lift. Each agent can be notified at most six times a minute, a simple bucket that sits underneath all the polite logic and cannot be raised or switched off by any setting or any clever agent. Below a certain rate, the mailbox and the read receipts run the show. Above it, the floor just says no. You design the good path for the good case and you put a wall behind it for the day the good case fails.

There is a companion rule I like even more, because it caught a whole class of quiet bugs. Every time the system decides not to deliver a notice, for any reason, it increments a counter. A suppression you cannot see is a suppression you cannot trust. We once had a feature that silently did nothing for weeks, and it survived that long precisely because its failure made no sound. So now every choice to stay quiet is itself countable. The fleet can be quiet without being opaque.

## What it feels like when it works

The test of all this is not a benchmark. It is the feeling of watching the fleet.

When the messaging is wrong, the fleet is a group chat that never stops buzzing, agents yanking each other around, nobody finishing anything. When it is right, it goes still. Agents work. Now and then one files a note for another. The other picks it up at a natural pause, reads it, answers or does not, and goes back to work. Nothing lurches. It looks less like a chat room and more like a good office late in the afternoon, where people know how to leave each other alone.

That quiet is the product. An interruption is the easiest message to send and the most expensive one to receive. The work of designing this was mostly the work of making the easy thing hard to do by accident, and the considerate thing the default.

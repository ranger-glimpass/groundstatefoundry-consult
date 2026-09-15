---
title: "Two People, Two Languages, One Call"
category: "voice-ai"
date: "2026-07-12"
excerpt: "Two people who share no language get on an ordinary phone call, and each hears the other in their own tongue, which turns out to be less about clever translation and more about how you split the call."
author: "Rishi Raj"
---

Picture a plumber in Dubai and a supplier in Guangzhou on the same phone call. One speaks Arabic. One speaks Mandarin. Neither installs anything. Neither learns a word of the other's language. The plumber talks, and the supplier hears Mandarin. The supplier answers, and the plumber hears Arabic. It is one ordinary call, and the language barrier is just gone.

That is the thing we built. And the interesting part is not the translation itself. The interesting part is a decision about plumbing, the audio kind, that most people would never think to argue about.

## The obvious way, and why it hurts

If you have ever used a meeting transcription tool, you know the usual approach. You record everyone into one mixed stream, then you try to untangle who said what afterward. That untangling has a name: diarization. It means teaching a machine to draw a line between speakers in a single blended recording, the way you might strain to follow two friends talking over each other at a loud dinner.

Diarization is impressive when it works. But on a live call it fights you. Two voices overlap. One person is loud, one is quiet. There is line noise. The machine has to guess, in real time, where one speaker ends and the other begins, and every guess costs time and every wrong guess sends the wrong words to the wrong translator. You have taken a hard problem, translation, and stacked a second hard problem on top of it, separation, for no reason other than that you mixed the audio together in the first place.

So we did not mix it together in the first place.

## Keep the two voices apart from the start

A phone call between two people already has two natural sides. There is the leg coming in and the leg going out. Instead of blending them and separating them later, we capture each leg on its own channel and never let them touch.

Here is the picture. Think of two garden hoses running side by side, each carrying water from a different tap. You could pour both into one bucket and then try to figure out later which water came from which tap, which is absurd. Or you could just keep the two hoses separate the whole way. We keep them separate the whole way. Each leg of the call is captured on its own audio channel and streamed over its own connection, tagged with which call it belongs to and which direction it is going. There is no mixing point. There is nothing to untangle, because nothing was ever tangled.

This is what I mean by structural separation. The two voices are not pulled apart by a clever model. They are apart by construction, because we built the transport so they could never merge. Diarization solves a problem we simply refuse to create.

The transport layer that does this is deliberately dumb, and I mean that as praise. Its whole job is to answer the incoming call, place the second call to the other person, capture each leg on its own stream, keep the timing tight, and tear both legs down together when someone hangs up. It does not translate. It does not think. It sets up two clean pipes and gets out of the way. All the real work, turning speech into text, translating it, turning it back into speech, happens above the transport, where it belongs. When one part of a system tries to be clever about everything, it is usually bad at all of it. The transport is good precisely because it wants to be boring.

## The clock nobody can turn off

Now the hard constraint. A conversation has a rhythm. When you finish a sentence, you expect the other person to start responding within a beat. Not instantly, people pause, but within the window that feels like listening rather than absence. Push past that window and the call stops feeling like a conversation and starts feeling like two people shouting into a well and waiting for the echo.

Every translated call has to live inside that window. And the window has to hold a whole chain of work. Catch the speech. Turn it into text. Translate the text. Turn the translation back into a voice. Send that voice into the other person's ear. Each step takes time, and they happen in sequence, one after another, because you cannot translate a sentence you have not finished hearing.

This is the real engineering pressure, and it is why keeping the legs separate matters so much. Every millisecond you would have spent deciding who is talking is a millisecond stolen from the budget you need for actually translating what they said. By refusing to mix the audio, we hand that entire slice of time back to the work that the caller actually cares about. The separation is not just cleaner. It is faster, because the cheapest step is the one you designed out of existence.

I want to be honest about where this stands. This is an engineering build, a working prototype. I am not going to hand you a latency number I did not measure, because the fastest way to lose your trust is to invent a statistic to win an argument. What I can tell you is the shape of the thing, and why the shape is right. Separate the legs at the source. Keep the transport dumb. Spend every spare millisecond on translation, not on cleanup.

## Why this is the honest design

There is a temptation in this work to reach for the most sophisticated tool, because sophisticated feels like progress. Diarization is sophisticated. A single blended stream that a model heroically untangles is a good demo. But the person on the call does not want a demo. They want to talk to someone and be understood, and they want it to feel like a phone call, not a negotiation with a machine.

The plumber and the supplier will never know how their call was split. They will not care that there was no mixing bridge, no speaker separation, no guessing. That is the point. The best translation is the kind where two people hang up having made a deal, and neither one stops to think about the fact that they were never speaking the same language at all.

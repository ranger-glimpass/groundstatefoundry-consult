---
title: "Cascade or Speech to Speech"
category: "voice-ai"
date: "2026-07-30"
excerpt: "Two ways to build a phone agent, and a plain account of when to chain three models and when to hand the whole conversation to one."
author: "Rishi Raj"
---

There are two ways to build a voice agent, and they disagree about what a conversation is.

The first way treats a spoken exchange as a relay race. Your voice becomes text. The text goes to a language model, which writes a reply. The reply goes to a text-to-speech engine, which turns it back into a voice. Three runners, one baton, handed off in order. We call this the cascade, or STT to LLM to TTS: speech to text, then the model, then text to speech.

The second way refuses the relay. It takes your audio and returns audio, with no text in the middle. One model listens and speaks. Google's Gemini Live works this way. People call it speech to speech, or audio to audio.

I have built both on the same runtime. Neither is the right answer. The question is what you are willing to trade.

## What the cascade buys you

The cascade is three moving parts, and that is exactly its appeal. You can see each one. You can swap each one.

When the conversation runs through text, you get a transcript for free. You know precisely what the caller said, word for word, and precisely what the agent decided to say back before it was ever spoken. You can log it, search it, and check it later. If the agent says something wrong, you can read the exact sentence and find the step that produced it.

You also get choice. In one of our study pipelines the transcription is done by one vendor, the thinking by a fast model on another, and the voice by a third. If a better voice comes out next month, you change one component and leave the rest alone. Want the agent to look something up mid-sentence, like a refund policy from a small database, and speak the answer? That lookup lives cleanly in the middle, between understanding and speaking, because the middle is text and text is easy to reason about.

The cost of all this is the handoffs. Three services in a row means three chances to wait. The audio waits for the transcript. The transcript waits for the model. The reply waits for the voice. Each step is fast on its own. Stacked in sequence, they add up into the small pause a caller feels before the agent answers. You are also holding three API keys, three bills, and three things that can fail.

## What speech to speech buys you

Now collapse the relay into one runner.

Audio goes in, audio comes out, and there is no text to hand off. Fewer steps in a row means less stacked waiting, so the agent tends to answer sooner. One service instead of three means one key, one bill, one thing to keep alive. Interruptions get easier too. When you start talking over the agent, a single model that is already listening to raw audio can stop and yield the floor without three separate parts having to agree on what just happened.

It feels more like talking to a person. That is the honest pull of it.

But you gave up the middle. There is no clean text step to read, to log, or to slip a database lookup into. You have less say over exactly how the voice sounds and fewer voices to pick from, because you no longer bring your own text-to-speech engine. And you are married to one company's model family. If their voice is not the voice you want, that is the voice you have.

## How I actually choose

I do not start from the technology. I start from the call.

If the conversation is mostly open and human, a friendly back and forth where sounding natural and answering quickly matter more than auditing every word, speech to speech earns its place. Fewer parts, less waiting, a warmer feel.

If the conversation carries weight, money, health, anything a regulator or an angry customer might ask you to prove later, I want the transcript. I want to point at the exact sentence and the exact step that made it. I want to swap the voice without touching the brain, and drop a lookup into the middle without fighting the model. That is the cascade, and I will pay the extra pause for it.

There is a reason our runtime supports both pipelines instead of picking a side. The trade is real, and it does not resolve in the abstract. It resolves against a specific conversation, with a specific tolerance for risk, cost, and the length of a pause.

Pick the one that fits the call in front of you. Then measure it, because your guess about where the time goes is probably wrong. That is a different piece.

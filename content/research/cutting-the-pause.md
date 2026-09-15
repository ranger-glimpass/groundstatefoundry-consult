---
title: "Cutting the Pause Before Your Agent Speaks"
category: "voice-ai"
date: "2026-07-16"
excerpt: "A phone agent says the same lines over and over, so we stopped paying to generate them twice and the pause got shorter."
author: "Rishi Raj"
---

Listen to a phone agent for a day and you start to hear the repeats.

"Thanks for calling." "Can I get your name?" "One moment while I check that." "Is there anything else I can help with?" The wording barely changes from call to call. A large share of what an agent says is not a fresh thought at all. It is boilerplate, the same handful of lines spoken again and again.

Now here is the part that bothered me. Every single time the agent says "Thanks for calling," a text-to-speech engine generates that audio from scratch. Same words, same voice, same settings, and we send it off to the provider's API, wait, pay, and get back audio that is identical to the audio we got on the last call. And the call before that. The pause the caller hears while that audio comes back is real, and we are paying to recreate a sound we already have.

That is silly. So we stopped.

## Say it once, keep the recording

The idea is old and boring, which is why it works. It is a cache.

The first time the agent needs to say a line, we generate the speech normally and save the audio. The next time it needs the exact same line, we do not call the provider at all. We play back the recording we already have. Think of a receptionist who has said "please hold" ten thousand times. They are not sounding it out letter by letter anymore. It is right there, ready, the instant they need it.

We keep these recordings in Redis, which is just a very fast store that lives in memory rather than on a slow disk. A cache hit, a line we have said before, comes back in roughly one to five milliseconds. That is not a faster API call. That is skipping the API entirely. For the lines an agent repeats all day, the layer removes better than ninety percent of the calls to the text-to-speech provider. Less waiting, and a smaller bill, for the same spoken words.

## The whole trick is the key

A cache is a box with labels. You put a thing in under a label, and later you ask for it back by the same label. Get the label wrong and you either miss something you already have or, worse, hand back the wrong recording. So the only real question is what goes on the label.

The obvious answer is the text. "Thanks for calling" is the label, and you fetch the audio for "Thanks for calling." The obvious answer is wrong, and here is why.

The same words can sound like completely different things. Speak "Thanks for calling" in a bright American voice, then in a calm British one. Speed it up. Switch the underlying model to a newer version. Same text, four different sounds. If your label is only the words, the cache will happily play the British recording when you asked for the American one, because as far as it knows, the words matched and the job is done. The caller hears the wrong voice mid-conversation, and you spend an afternoon confused.

So the label is not the text. The label is the text plus the whole voice configuration: which provider, which voice, which model, the speed, the stability, the language, all of it. We take every one of those settings, glue them to the text, and run the result through a hash to get one compact key. Change any single setting and the key changes, which means it is treated as a new sound and generated fresh. Nothing gets confused for something it is not.

This also matters because the cache is not fuzzy. It matches exact text, not text that means roughly the same thing. "Thanks for calling" and "Thank you for calling" are two different labels and two different recordings. That is on purpose. Fuzzy matching would sometimes play a line that is close but not what the agent meant, and in a live call that is a worse failure than a slightly longer pause.

## What it does not fix, and why that is fine

Caching does nothing for the sentences an agent has never said before. The genuinely new reply, the one shaped around this specific caller, still has to be generated the slow way, once. The cache is not there to make novelty faster. It is there so you stop paying the novelty price for things that were never novel.

And the honest shape of a phone conversation is this: a spine of repeated lines with fresh answers hung between them. Greetings, holds, confirmations, closings, all repeated. The cache takes the pause out of the repeated spine, which is a large part of every call, and leaves the model free to spend its time on the part that is actually new.

The caller does not know any of this. They just notice the agent answers the small stuff instantly, like someone who has done this before. Which, by now, it has.

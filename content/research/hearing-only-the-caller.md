---
title: "Hearing Only the Caller"
category: "voice-ai"
date: "2026-11-10"
excerpt: "A voice agent on a real call hears everyone near the phone, so we built a small open-source model that keeps the caller and cuts the rest."
author: "Rishi Raj"
---

A woman calls to move her appointment. She is in her kitchen. The TV is on in the next room, a news anchor talking steadily, and her husband asks her something from the doorway.

She says, "Can we do Thursday instead?"

The voice agent on the other end hears all of it. The anchor. The husband. Her. To the agent these are just words arriving down the same line, and it has no idea which ones matter. So it answers the husband. Or it hears the TV start a new sentence, decides someone is interrupting, and cuts itself off mid-reply. She repeats herself. It happens again. By the third try she is asking for a human.

Nothing in that call was broken in the usual sense. The agent did exactly what it was built to do: listen to the sound and respond. The trouble is that it listened to all of the sound.

## Clean is not the same as alone

The first thing everyone reaches for here is noise suppression. Good noise suppression is a solved problem, more or less. DeepFilterNet3, an open model by Hendrik Schröter, is excellent at it. Run a noisy call through it and the hum of the fridge, the clatter of a café, the hiss of a cheap line all fall away.

But a noise suppressor has one job: tell speech apart from things that are not speech. A TV anchor is speech. A husband in a doorway is speech. A colleague on the next desk is very clearly speech. So the suppressor keeps them, carefully, and often makes them cleaner and easier to hear than before.

That is the gap. A voice agent does not need clean audio. It needs the caller's audio, and only the caller's.

## What a near voice sounds like

Think about how you know, with your eyes closed, whether someone is talking right next to you or from across the room. You do not need to see them. A close voice is dry and full. You hear it directly, with almost nothing bouncing off the walls first. A far voice arrives softer and smeared, wrapped in the echo of the room it crossed to reach you. Your ears do this sorting without asking you.

The person on the phone is almost always the closest voice to the microphone. Everyone else is farther away. So the question "is this the caller?" turns into a physical one: "is this voice near or far?"

Here is the part that surprised me. DeepFilterNet3 already knows the answer. To do its job well, it builds an internal picture of the sound, a set of numbers it computes on the way to its output that we call features. Those features already encode how far away a voice is and how much of the room's reverberation (the echo that lingers after a sound) is clinging to it. The suppressor computes all of that and then throws the distinction away, because separating near from far was never its job.

So we did not need to build a new ear. We needed to listen to the one that was already there.

## A small head on a big ear

Nearfield is DeepFilterNet3 plus a small extra network we call the caller-ownership head. It has 562 thousand parameters, which in today's terms is tiny. It reads DeepFilterNet's internal features and answers one narrow question.

Every 10 milliseconds, the audio is split into 32 frequency bands, slices running from the low rumble of a voice up to the hiss of its consonants. For each band, in each 10 ms slice, the head decides: does this sound belong to the near voice, or to the background?

That gives you a map of ownership over time. Then a keep/cut rule turns the map into audio. Bands the caller owns are kept, and never cut down far. Bands the background owns are cut hard. When the caller goes quiet altogether, the whole frame is pulled down, so the TV does not fill the pauses. The rule also holds on for a moment after the caller stops, which closes the small gaps between words. Without that, the caller would sound choppy, and an agent listening for the end of a sentence could mistake a breath for a finished thought.

The keep/cut rule is plain arithmetic, not learning. That was deliberate. It means you can turn it up or down without retraining anything, which is where the strength settings come from.

## How well it works

We measured it on 48 held-out simulated calls. Held-out means the model never saw them during training, and the speakers and rooms in them were ones it had never heard. We checked two things.

The first is how much background is left while the caller is silent, in decibels. More negative is quieter.

The second is STOI, short-time objective intelligibility, a standard score from 0 to 1 that estimates how understandable the caller's speech still is. It tells you whether all that cutting damaged the voice you actually wanted.

| Setting | Background while the caller is silent | Caller intelligibility (STOI) |
|---|---|---|
| DeepFilterNet3 alone, for reference | -16 dB | 0.878 |
| gentle | -22 dB | 0.902 |
| strong | -37 dB | 0.893 |
| full (default) | -41 dB | 0.882 |

Read the first and last rows together. At the default setting, Nearfield pushes the background 25 dB further down than noise suppression alone, and the caller comes out at least as intelligible as before. The gentle setting is the interesting one if you care most about the caller's voice: it removes more background than DeepFilterNet3 and scores the highest intelligibility of the four.

## Fast enough to sit on a live call

A filter on a phone call lives under a hard budget. Every millisecond it adds is a millisecond the caller waits for a reply, and we have written before about how little silence a caller will forgive.

Nearfield works in 10 ms frames and looks 20 ms ahead, for a total latency of 30 ms. It costs between 0.5 and 2 ms of CPU per 10 ms frame on a single thread, so it runs comfortably on an ordinary server core with no GPU. One model handles 8, 16 and 48 kHz audio, which covers phone lines, WebRTC and full-band sound. The whole thing is one 11 MB ONNX file.

## Where it falls short

One limit, stated plainly.

While the caller is talking, background voices are reduced, but a background voice that overlaps the caller in the same frequencies can stay faintly audible underneath. The head decides band by band, and when the caller and the TV share a band at the same instant, the band goes to the caller. That is the right call for the caller's voice, and it means some of the TV rides along.

We tried a hand-programmed echo-tail remover aimed at exactly this case. It raised the caller over the background while talking from 4.3 to 6.1 dB, but intelligibility dropped from 0.892 to 0.874. It is part of the demo only, not the release, so you can hear the trade for yourself.

## Try it

Nearfield is open source under Apache-2.0, at [github.com/Ground-State-Foundry/nearfield](https://github.com/Ground-State-Foundry/nearfield). The v1.0.0 release has the model attached. It includes the DeepFilterNet3 weights by Hendrik Schröter, used under the MIT license, and none of this would exist without that work.

You can hear it before installing anything. The [live demo](/products/nearfield) runs the same model in your browser on an example call, or on your own voice from the microphone with the TV on behind you.

What stays with me is how little we had to add. The hard part, learning what a near voice sounds like, was already sitting inside a noise suppressor, unused. A small head and a simple rule were enough to put it to work. A voice agent's first job is not to be clever. It is to know who it is talking to.

---
title: "Tracing Who Is Speaking When"
category: "voice-ai"
date: "2026-07-02"
excerpt: "You cannot shorten a pause you cannot see, so we put a stopwatch on every part of a voice call and watched where the time actually went."
author: "Rishi Raj"
---

A caller finishes talking. There is a pause. Then the agent replies.

Everyone agrees the pause is too long. The argument starts right after. The model is slow, says one person. No, it is the voice engine, says another. It is the phone network, says a third, and everyone has a hunch and nobody has a stopwatch. You can spend a week tuning the model and shave nothing off the pause, because the pause was never in the model. You were guessing.

You cannot fix a delay you cannot see. So before touching anything, we made the pause visible.

## A stopwatch that hands off

The tool for this is called tracing. The plain version: you start a stopwatch when something begins and stop it when that thing ends, and you do this for every step, and you nest the stopwatches inside each other so you can see which step lived inside which.

A voice turn nests naturally. There is the whole conversation. Inside it, one turn: the caller speaks, the agent speaks back. Inside that turn, the pieces. The caller speaking. The gap. The agent speaking. Each gets its own stopwatch, and each sits under the turn it belongs to, so the picture is not a flat list of timings but a tree. You can look at one turn and see its parts laid end to end, in order, with the length of each drawn to scale.

We use OpenTelemetry to record these timings and Jaeger to look at them. OpenTelemetry is a common way to emit this kind of timing data. Jaeger is a dashboard that draws it as those nested bars. The names matter less than the shape they give you: a call stops being a mystery and becomes a timeline you can read.

## Marking who has the floor

The most useful marks we added are the simplest ones. Two spans, which is just the word for one of those stopwatches. One is called `user_speaking`. The other is `bot_speaking`.

We start `user_speaking` the moment the system detects the caller has begun talking, and stop it when they stop. We start `bot_speaking` when the agent's audio begins and stop it when the agent goes quiet. Drawn on the timeline, these two bars tell you, at a glance, who had the floor and for how long.

The interesting part is not the bars. It is the space between them.

When `user_speaking` ends and `bot_speaking` has not started yet, that empty stretch is the pause. It is the caller finishing, then waiting. That gap is the thing everyone was arguing about, and now it has a length and a place on the screen. You are no longer debating whether the pause is long. You are looking at it.

## Reading the gap

Once the gap is visible, the argument settles itself, because inside that gap sit the other stopwatches, the ones timing the actual work.

In a cascade pipeline, the pause has to hold three jobs in a row: turning the caller's speech into text, the model deciding what to say, and turning that reply back into a voice. Each has its own bar inside the gap. So you do not ask "why is the agent slow" anymore. You open the turn, look at the gap, and see which of the three bars is fat. If the voice engine is eating the pause, tuning the model was always going to be a waste of a week. The timeline would have told you on day one.

This is also how you catch the surprises. A tool call the agent makes mid-turn, a lookup into a small database, shows up as its own bar in the gap. Sometimes it is quick and sometimes it is not, and either way you can now see it sitting there instead of wondering why one turn felt heavier than the rest. The thing you did not think to suspect is the thing the trace hands you.

## Why bother before you optimize

It is tempting to skip all this and just start making things faster. Smaller model. Quicker voice. Cleverer code. Sometimes you get lucky and the pause shrinks.

Mostly you do not, and you cannot tell whether your change helped, hurt, or did nothing, because you never measured the before. Optimizing without tracing is rearranging a room in the dark. You might move the right chair. You will not know.

So we put the stopwatches in first. Then the conversation about latency changes from opinions to a picture, and the picture points at the one place worth touching. The pause was always there. Now we can see exactly whose it is.

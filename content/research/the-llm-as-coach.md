---
title: "Demote the Model to Coach"
category: "multi-agent-systems"
date: "2026-07-08"
excerpt: "A large language model is too slow and too expensive to drive a body in real time, so in Hivemind it stopped driving and started training the thing that does."
author: "Rishi Raj"
---

Try this. Stand up, and while you are standing, name every muscle you just used and the order you fired them in.

You cannot. Not because you do not know how to stand, but because the part of you that knows how to stand does not talk. It just does it, fast, below the level where words live. The part of you reading this sentence is a different, slower thing. It decides to stand. It does not do the standing.

That split is the whole idea behind Project Hivemind.

## The mistake I started with

Hivemind began as a little 2D robot in a browser that you command in plain language. Type "grab the apple" and a large model, Claude, would work out what to do and drive the robot's motors directly. Turn this much. Step forward. Close the gripper.

It worked, and it was the wrong design, and watching it work is what showed me why.

A language model is extraordinary at deciding what should happen. It is a bad fit for making it happen moment to moment. Motor control is a fast loop. A body correcting its balance runs at something like sixty updates a second, every second, forever. A large model answers in a beat you can feel, and each of those answers costs money. Putting it in the fast loop is like hiring a brilliant strategist and then making them personally twitch every muscle in the body. They are too slow for the job, they are too expensive for the job, and it is not the job they are good at.

So I took the model out of the loop.

## What "coach" means here

In the current version of Hivemind, Claude does not drive the motors. It coaches. When it decides the robot needs to be able to do something it cannot yet do, it calls a tool named `practice_skill`. That kicks off training. A tiny policy, a small numeric model with a few hundred numbers in it, learns to do the actual movement. The coach watches a competence score climb. When the score is high enough, the robot performs the skill using the learned policy, not using the model. If the skill is not ready, the coach says so plainly and calls `practice_skill` again with a request for more training.

Read that back and notice the shape of it. The big model recognizes what it cannot do and triggers the making of a smaller thing that can. It never sits in the fast loop. It sits above it, deciding when a new skill is needed and judging whether the skill is good enough yet. The doing lives in the small policy. The knowing-when lives in the coach.

## What goes in the fast loop instead

The thing that drives the body is deliberately small. For the navigation skill it was a policy with 146 numbers in it. That is not a typo and it is not a scaled-down version of something bigger. That is the whole controller. It is small on purpose, because small is fast, and fast is what a motor loop needs.

How does something that tiny learn to do anything? Not the way you might expect. I did not train it with the usual method of nudging every number a little in the direction that reduces error. I trained it by evolution.

Here is evolution in plain words. You take the policy and make a batch of slightly randomized copies of it. You let each copy try the task. You score how well each one did with a single number, its fitness. Then you keep what the good ones were doing and throw away the rest, and repeat. No gradient, no calculus, just variation and selection running over and over, the same pressure that shaped every living thing.

I chose that method for one hard practical reason: it spreads across machines beautifully. To evaluate one candidate a worker needs almost nothing. A random seed and a way to report back a single fitness number. That is it. So the work splits cleanly from eight cores on one laptop up to thousands of machines with no change to the idea. When your trainer only needs a seed in and a score out, scaling it is almost free.

## Does it work

Yes, and I want to give you the real figures rather than a feeling.

The navigation policy, the 146-number one, went from three percent competence to a hundred percent in about three seconds on eight CPU cores, and the skill it learned transferred to the live robot. A harder maze version, with more sensory inputs feeding it and 314 numbers inside, trained to 92.5 percent competence in roughly eight minutes on the same eight cores, and it drives the robot from its start point to the target around walls.

There is a later version with a two-dimensional walking body, ten joint motors, that has to balance. A hand-built balance controller survived every one of three thousand simulated ticks under a dozen random shoves. An evolved stand-up policy, 970 numbers, learns to get the body upright from a fall.

I will be as honest as the project's own notes are. So far navigation is the skill that is genuinely learned from scratch. The policies are simple networks, not anything exotic. The world is still two-dimensional. None of that undercuts the point. It sharpens it.

## Why this is the right shape

The reason to demote the model is not that the model is weak. It is that the model is the wrong tool for the fast, repetitive, cheap-must-be-cheap work of moving a body, and the right tool for the slow, rare, expensive work of deciding what the body should learn next.

You already run on this architecture. Something slow in you sets the intent. Something fast and wordless carries it out. And when you practice a thing enough, it sinks below language and stops needing the slow part at all.

Hivemind is me trying to build that on purpose. Keep the big model where judgment lives. Grow small, fast things to do the doing. Let the coach coach, and let the body move on its own.

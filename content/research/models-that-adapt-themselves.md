---
title: "Models That Adapt Themselves"
category: "perspectives"
date: "2026-01-29"
excerpt: "A model that quietly retunes itself for each question it is asked, using a single small dial per skill, hints at something about how learning might actually want to work."
author: "Rishi Raj"
---

A good doctor does not treat every patient with the same posture. Someone comes in with a broken wrist, and a certain set of instincts wakes up. Someone comes in describing a slow, vague tiredness, and a different set takes over. Same doctor, same training, same brain. But which parts of that training lean forward changes with who is sitting on the table. The knowledge does not get rewritten. It gets re-weighted for the moment.

Most models we use do not work that way, and for a long time it seemed like they couldn't. You train a model once, on everything, and then it is frozen. The same enormous set of internal settings answers your math question and your poetry request with the identical configuration. It is like a doctor who must hold every specialty in the exact same balance for every patient who walks in, never leaning toward the wrist, never leaning toward the fatigue. It works, roughly. But it is clearly not how a flexible mind behaves.

## Turning a small dial instead of rebuilding the machine

The usual way to make a model better at a specific task is to fine-tune it. That means taking the frozen model and gently adjusting its settings using new examples until it gets good at the new thing. The problem is that a model has an astonishing number of settings, and nudging all of them is heavy work. It is like retraining the whole doctor from scratch every time you want them to get better at wrists.

There is a lighter idea that has been quietly reshaping how people think about this. Instead of adjusting millions of settings, you learn to turn a few small dials that steer the settings you already have. Picture the model's knowledge as a mixing board that is already built, hundreds of sliders set in their positions. You do not touch the sliders. You add one master knob that, when turned, shifts many of them together in a coordinated way that means "be more like a mathematician" or "be more like a poet." Learning the knob is cheap. The board underneath stays exactly as it was.

The version of this that made me sit up goes one step further. What if the model turns its own knob, on the fly, for each thing you ask it? The idea, which came out of work with the memorable name Transformer-squared, is roughly this. First the model glances at your question and decides what kind of question it is. Then it reaches for the small dial it learned for that kind of task and turns it, retuning itself before it answers. A single vector, one modest list of numbers, is enough to do the steering. Ask it to code and it leans one way. Ask it to reason through a word problem and it leans another. Same frozen knowledge underneath, re-weighted for the moment. The doctor, finally, leaning toward the wrist.

## What this hints about learning

I do not want to oversell a technique. It is one approach among many, and the field moves fast. But the shape of the idea points at something I find genuinely interesting about learning in general.

We tend to imagine learning as accumulation. You pour more in, the container gets fuller, you know more. But the doctor example, and this self-tuning trick, suggest a different picture. A lot of getting good at something is not adding new knowledge. It is learning which of the things you already know to bring forward, and when. The expert and the novice may hold overlapping facts. What separates them is the reflex that says, for this situation, lean here, quiet that.

If that is true, then a model that retunes itself per input is not just an engineering convenience. It is a small step toward learning that looks less like filling a bucket and more like developing instincts. The heavy knowledge stays put. The cheap, flexible part, the part that decides how to hold that knowledge right now, is where the adaptation lives. And you can capture a surprising amount of that "how to hold it" in something as small as a single vector.

I find that quietly encouraging. It suggests that becoming adaptable might not require becoming heavier. That the path forward is not only bigger models with more crammed inside them, but models that get better at reaching for what they already have. We spent years teaching machines to know things. The more interesting question, the one I keep returning to, is whether we can teach them to know which self to be, right when it counts.

---
title: "The Two Faces of Simulation"
category: "agent-simulation"
date: "2026-06-20"
excerpt: "The same idea, agents standing in for something real, can stress a live system or model a room full of people, and I want to show why both are the same move."
author: "Rishi Raj"
---

Two problems landed on my desk in the same year, and on the surface they had nothing to do with each other.

The first was a voice platform that had to hold up when a new client went live. Dozens of calls at once, all hitting the same pipeline, and no way to know it would survive until it did. The second was a much older problem wearing a new coat: how does a company actually work, and how would you ever find out without spending months interviewing everyone in it.

I solved both with the same trick. I built agents that stood in for something real. And it took me a while to notice that these were not two projects. They were two faces of one idea.

## Face one: agents that drive a real system

Start with the voice platform. The bind is easy to state and hard to escape. You cannot scale-test with real customer calls, because there are not enough of them and the ones you have are precious, you cannot afford to break a real conversation to see what happens. But you also cannot onboard a new client without knowing the system holds at the concurrency they will bring. You need load, and the only honest source of load is real traffic, and real traffic is the thing you are not allowed to touch.

So I closed the loop. I built a suite where one AI agent dials another through the entire production stack. Not a mock, not a recording. A real call: the telephony layer, speech to text, the model deciding what to say, text back to speech, all of it, on both ends. A dialer agent and a receiver agent, talking to each other like two strangers on a line, except neither is a person and you can spin up as many pairs as you dare.

That is the first face. Simulation that produces genuine end-to-end load on demand. The agents are not the point. The system under them is. They exist to lean on it hard enough that it tells you the truth before a paying customer does.

## Face two: agents that stand in for people

Now the other problem. A synthetic company: departments, roles, a hierarchy, around a hundred employee personas, and a hidden map of how work truly flows through it. Then a separate agent, one that never sees that hidden map, whose whole job is to figure out how the company works by interviewing the synthetic staff. It decides who to talk to, asks its questions, records what it infers, and stops when it thinks it has the picture.

Here the agents are the point. They are people, or close enough to people that you can ask one "given your role, how does an invoice actually get approved around here," and get an answer shaped by that role's slice of the truth. The system, the company, is the thing being conjured. The whole company is made of agents.

That is the second face. Simulation that models a population well enough to run an evaluation you could never run on the real humans.

## Why they are the same move

Here is what took me a while to see.

In both cases I am replacing something scarce with something I can make on demand. In the first, the scarce thing is customer traffic. In the second, it is honest access to how a hundred people actually spend their days. Both are expensive to get, biased when you do get them, and impossible to run twice under identical conditions. Simulation makes them cheap, repeatable, and safe to break.

And in both cases the agents borrow their credibility from the same source. The dialer sounds like a caller because a model is good at holding a conversation. The synthetic employee answers like a manager because a model is good at reading a role and staying in it. The same capability, occupying a position and acting from it, powers a load test and a company at once. Point it at a system and it stresses the system. Point it at a person and it becomes the person. It is the same hand, turned palm up or palm down.

## The line between them, and why it matters

I do not want to blur this into one warm claim, because the two faces earn your trust differently.

When agents drive a real system, the result is hard. The pipeline either held at that concurrency or it did not. When I say the stack carried twenty concurrent calls end to end, that is a logged fact, not a hope. The agents were fake, but the load they made was real, and so is the answer. The system does not know its callers were synthetic, and it fails exactly the way it would fail for humans.

When agents stand in for people, the result is softer and you have to be honest about it. A synthetic employee is a model of a person, and a model is always less than the thing it models. The discovered process map is a strong guess, not a deposition. It is worth measuring, and I do measure it against the hidden ground truth, but I would never confuse "the agent recovered most of the true process" with "this is precisely how the company runs." One face tells you whether your machine breaks. The other tells you what is likely, which is a weaker claim and often the only one on offer.

Knowing which face you are looking at is the whole discipline. Confuse them and you will either trust a forecast like a measurement or dismiss a measurement as a mere forecast.

## The thing underneath both

What I keep landing on is that simulation is not a clever workaround. It is a way of running the experiment you were never allowed to run.

You cannot flood your own production system with fake customers and watch it strain, except now you can. You cannot interview a hundred people over and over, resetting them each time, except now you can. The two faces point in opposite directions, one at infrastructure and one at people, and meet at the same quiet permission. Try it first, where it is safe, before it counts.

I find that permission worth more than either result.

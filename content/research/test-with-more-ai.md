---
title: "Test Your AI With More AI"
category: "agent-simulation"
date: "2026-06-10"
excerpt: "Waiting for real users to find the failure is a terrible test plan, so we built agents that call each other and break the system on purpose first."
author: "Rishi Raj"
---

Here is a bad way to find out your system cannot handle load. A new client goes live on Monday morning. By ten o'clock their customers are calling in, dozens at once, and somewhere in the pipeline something buckles. Calls drop. The greeting takes six seconds. The client is on the phone with you, and the failure is now a real failure, happening to real people, on the one day it most needed not to.

That was the trap I was staring at with a voice platform. And the more I looked at it, the more I realized the usual test plan was just a slower version of the same disaster.

## The problem with waiting for real traffic

The honest way to test a system under load is to put load on it. For a voice platform, load means calls. Lots of them, at the same time, going through the whole stack.

But you cannot get that load anywhere safe. You will not manufacture a hundred real customers to call in on cue. You cannot borrow the client's live traffic to experiment on, because that traffic is real conversations you are not allowed to break. So the load you actually want, concurrent calls hammering the pipeline, only shows up on the day it is too late to learn anything gently. Your test environment is quiet, your production environment is where you find out, and finding out in production means finding out from the customer.

People fill this gap with mocks. You fake the phone layer, you stub the speech engine, you send synthetic requests at the parts you can reach. It is better than nothing, and it lies to you in a specific way. A mock tests the piece you replaced with a mock. It cannot tell you what happens when the real telephony layer, the real speech to text, the real model, and the real speech synthesis all contend for the same resources at once. The failures that hurt live in the seams between those pieces, and mocks paper over exactly the seams.

## The move: make the AI test itself

So I stopped trying to fake the load and made real load instead. If the thing I need is many real calls through the real stack, and I cannot get real callers, then I will build callers.

The suite pairs two AI agents. One dials, one receives. They place an actual call to each other through the entire production pipeline: the telephony stack, speech to text, the model that decides what to say, text to speech, both directions, live. Neither is a mock. From the system's point of view there is no way to tell these two agents apart from two humans having a conversation, because everything they touch is the same machinery a human would touch.

Then you do it in bulk. Spin up many pairs, set a total call count and a rate limit, and let them go. Now the pipeline is under genuine concurrent load, on demand, whenever you want, and no customer is anywhere near it. You can run it the night before onboarding. You can run it after every change. You can run it until it breaks, on purpose, which is the whole point of a test.

Think of it as a crash test. You do not learn whether a car is safe by waiting for a real crash with real passengers. You build a dummy, you run the car into the wall, and you read the sensors. The dummy is fake so the crash can be real and the passengers can stay home. The dialing agents are the dummies. The wall is your own system. What you read off the sensors is the truth you would otherwise have paid for in customers.

## What it actually caught

This is not a thought experiment, and I want to be precise about what it delivered rather than wave at a big number.

The suite verified twenty concurrent calls running end to end through the full stack. That is a logged result, not an estimate, and it is the tested ceiling from the runs I did, not a theoretical maximum I am dressing up. The system held at that concurrency, through real telephony, real speech, real model responses. When I say it held, I mean the calls connected and completed, because I watched them do it.

It also caught something a benchmark number would have hidden. The telephony layer treats an external call, one that goes out through a public number and comes back, differently from a purely internal one that stays inside the switch. They are not the same path, and they do not behave the same under load. That is the kind of finding you only get by driving the real system, because a mock would have collapsed both paths into one and told you a comforting lie. It cost me some engineering to handle the internal path properly, and I would rather pay that cost against test agents than discover the difference from a client whose internal calls quietly misbehave.

## Why this is the right shape

I have come to think the instinct to "test more carefully" is often the wrong instinct. Careful testing of a fake system tells you your fake system works.

The better instinct is to make the test real and make the traffic fake. Real pipeline, real seams, real contention, driven by agents that cost nothing and feel no pain when the thing breaks. You get to break it a hundred times before a customer breaks it once. You get to find the buckling point in a quiet room instead of on a launch morning.

There is something almost funny about the shape of it. We built AI that talks to people, and the way we made sure it could handle people was to have it talk to itself, over and over, until we trusted it. The system's first real conversations were with its own reflection. By the time a person finally called, the line had already been busy for hours, and every one of those calls was a rehearsal nobody had to sit through.

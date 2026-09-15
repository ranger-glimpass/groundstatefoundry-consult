---
title: "A Backend-Agnostic Control Plane for Agents"
category: "multi-agent-systems"
date: "2026-08-04"
excerpt: "The control plane that runs a fleet of agents should not know or care which model is behind any of them, and building it that way changes what it can survive."
author: "Rishi Raj"
---

There is a question you can ask about any system that manages agents, and the answer tells you almost everything: how much does it know about the model?

Most of them know too much. They are wired to a specific provider, a specific API shape, a specific way of holding a conversation. That coupling feels harmless while everything is working. It stops feeling harmless the day you want to move a workload to a cheaper model, or run half your fleet on a cloud provider your client already pays for. I wanted the opposite. A control plane that runs a fleet of coding agents and genuinely does not care what is behind any single one of them.

I built it in Go. Here is what that neutrality actually took, and why I think it matters more than it sounds.

## The trick is to not launch the model at all

The cleanest way to not depend on a model is to never touch it.

The system, Bubbles, does not talk to any model API. It launches the `claude` command line tool, once per agent, each in its own working folder. Whatever backend that tool is configured for is the backend the agent uses. Point Claude Code at a subscription and the agents run on the subscription. Set an API key and they run on the key. Export the standard variables for AWS Bedrock or Google Vertex and the agents run there, because the launch environment is inherited all the way down to each session. The control plane sets none of that policy. It just starts a process and lets the process be whatever it was configured to be.

This is a smaller idea than "abstract over every provider," and that is why it works. An abstraction layer over many model APIs is a thing you have to keep correct as all of those APIs drift. A thin launcher that inherits a tool's own configuration has nothing to keep correct. The neutrality is not a feature I maintain. It is a consequence of not reaching for the model in the first place.

## What the control plane actually owns

If it does not own the model, what does it own? A short list, and keeping the list short is the discipline.

An agent, in this system, comes down to one atom and one verb. The atom is an address, a dotted path like `0.1.2` that says where the agent sits in the fleet and never gets reused. The verb is `send`, the ability to put a message in another agent's inbox. From those two things everything else is built: who exists, who is currently running as a live process and who is paused, who is allowed to message whom, and who gets paused first when memory is tight.

The core is written as pure decision-making code. The package that decides which agent to pause, the one that decides whether a message becomes a notice, the one that reads how large a conversation has grown, none of them do any input or output, and none of them read the clock on their own. Time is handed to them by the caller. That sounds like a fussy detail. It is the reason the whole thing can be tested without a model at all: a fake runner drives the entire spawn, message, and save flow, so the suite runs with zero tokens and no network. A control plane you can only test by spending money on a live model is one you will not test often enough.

Go earns its place here. One statically linked binary, no runtime to install, no browser, no Electron shell: a single native file you drop on a machine. The concurrency model fits the job too, because a fleet is a pile of things happening at once, and goroutines are a natural way to hold many live sessions and many background checks in one process without it turning into spaghetti.

## Why the neutrality pays off

It would be easy to file all this under "nice, portable, whatever." I think it is more than that, and the reason is money.

Every turn an agent takes re-sends its entire conversation to the model. If the cache still holds the matching prefix, you re-read it cheaply, at roughly a tenth of the input price. If the prefix does not match, because the session restarted or something earlier changed, you pay full price for the whole context. On a long conversation that is the difference between cents and real dollars for one turn. So the control plane watches each agent's context size and nudges it to compact as it grows, and when memory forces it to pause a session, it pauses the one whose pausing wastes the least, because waking a paused agent pays that full price again.

Here is where backend-neutrality stops being an abstract virtue. Cost is not one number across providers. A subscription, a metered API key, and a cloud contract each have a different shape, and each has days where one is cheaper than the others. A control plane welded to one provider cannot follow that. One that launches whatever the underlying tool points at can move a workload from a subscription to a cloud account by changing an environment variable and restarting, with the fleet's own logic unchanged. The part that costs money is swappable. The part that governs the spend is not. That is the arrangement I wanted.

## The quiet argument underneath

I did not set out to make a point about coupling. I set out to stop losing track of my own agents. But building it this way keeps making the same argument in different places, so I have started to trust it.

A system lasts longer when it is honest about what it does not control. I do not control which model is best next quarter, or which provider a client has already standardized on, or what any of these APIs will look like in a year. Baking one of those choices into the core buys a little convenience today and a rewrite later. Keeping the model at arm's length, behind a tool I merely launch, costs a little indirection today and buys the freedom to not care tomorrow.

The best compliment I can pay the design is that the fleet has no opinion about the model running inside it. That was the whole idea. The control plane's job is to run the fleet well and count what the fleet costs. Which brain each agent thinks with is, deliberately, none of its business.

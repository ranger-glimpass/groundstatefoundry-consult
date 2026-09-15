---
title: "From Writing Code to Running a Fleet"
category: "multi-agent-systems"
date: "2026-08-28"
excerpt: "The IDE was built for one person typing into files, and that shape quietly falls apart the moment your coworkers are agents."
author: "Rishi Raj"
---

I had eleven terminal tabs open and I had lost the thread.

Each tab was a Claude Code session working on something real. One was fixing an auth bug. One was writing tests. One had stopped and was waiting for me to answer a question, and I did not know which one, so I clicked through all eleven until I found the blinking cursor. By the time I found it I had forgotten what the other ten were doing. This is not a story about being disorganized. It is a story about using the wrong tool. The IDE is a beautiful machine for one person typing into files, and I was not doing that anymore.

## What the IDE quietly assumes

Open any code editor and look at what it puts at the center of the screen. A file. Your cursor. The thing you are typing into, right now, one keystroke at a time. Everything else, the sidebar, the tabs, the terminal at the bottom, orbits that single point of attention. The whole design rests on one assumption: there is one worker, and the worker is you, and you are looking at exactly one thing.

That assumption held for forty years because it was true. Then it stopped being true.

When your coworkers are agents, the work does not happen at your cursor. It happens in ten places at once, none of which you are looking at. An agent does not need you to type. It needs you to decide, occasionally, when it hits something only you can settle. The rest of the time it just works. So the screen you actually need is not a file with a cursor in it. It is closer to what an air traffic controller stares at: many things moving at once, most of them fine, a couple that need you now, and a clear signal telling the two apart.

The tabs could not give me that. A tab is a room with the door closed. To know what is happening inside, you have to open the door, and while you are in that room the other ten are shut.

## The shape of the problem

Once I stopped fighting the tabs and looked at the actual problem, it split into a few plain questions. Not "how do I run several terminals," which is easy. The hard ones were quieter.

Which agent needs a decision from me, right now? Which one has quietly stalled and is burning nothing but also finishing nothing? When an agent has a question for another agent, how does that message arrive without yanking either of them off task? And under all of it: how do I keep this from costing a fortune, when every one of these sessions is billing tokens whether I am watching it or not?

None of those are editor questions. They are questions about running a group of workers. The tool for that is not an editor. It is a control surface. Mission control, if you want the tired phrase, but the phrase is tired because it is right: a room built so one human can hold a fleet in their head.

## What mission control actually needs

I ended up building the thing I wanted, an open-source terminal application called Bubbles, and building it taught me what the job actually requires. Not features. Shapes.

It needs the fleet on one screen. Each agent is a "bubble," drawn as a node in a tree you can zoom into and out of. You see all of them at once, and you dive into any single one to get its live session and collaborate directly, then pop back out. The default view is the whole fleet, not one file. That inversion is the entire point.

It needs the work to outlive the window. In an IDE, close it and everything stops, which is correct, because you were the worker. Here the agents are the workers, so they keep running as a background process after you close the interface. You reattach later and they are further along than you left them. The fleet is saved to disk and resumes if it is ever stopped. Closing the lid should not lay off the staff.

It needs the agents to reach each other without reaching through me. Early on, every question routed through the human, which just moves the eleven-tabs problem up a level. So the agents message each other directly, through inboxes that do not interrupt, and each keeps track of whether its message was delivered, read, or replied to. They decide when to follow up. I am no longer the switchboard.

And it needs to respect the meter. Every turn an agent takes re-sends its whole conversation to the model. Keep a session hot and idle and you are paying to keep a context warm for nothing; kill it to save memory and the next message pays full price to wake it back up. A control plane that ignores this is a control plane that hands you a shocking bill. So the one I built scores which sessions to pause by how wasteful pausing each one would be, and it caps how fast messages can pile up. The money is not an afterthought. It is a first-class thing the fleet measures about itself.

## The part that surprised me

The strangest adjustment was not technical. It was about where my attention goes.

For my whole career, being good at this job meant being the one at the cursor, the one who knew the trick, typing it in. The skill lived in my hands. Running a fleet moves the skill somewhere else. Now the job is noticing. Which agent is stuck. Which decision is mine to make and which I should leave alone. When to dive in and when to trust the thing to finish. You stop being the fastest typist in the room and start being the person who can hold ten moving parts in their head without dropping one.

I am not fully used to it yet. Some part of me still wants to open the file and do it myself. But when the fleet is running well, and I am watching a tree of agents finish work I only had to point at, it does not feel like I gave something up. It feels like I finally got the right screen.

The IDE was never wrong. It was built for a world with one worker in it. That world had a good run. It is just not the one I work in anymore.

---
title: "Running Stateful Calls on Serverless"
category: "voice-ai"
date: "2026-07-26"
excerpt: "A phone campaign is a long, stateful thing and serverless containers can vanish mid-sentence, so the whole trick is making the work survive the machine doing it."
author: "Rishi Raj"
---

A calling campaign is running. Ten thousand contacts, dialed one after another, each one a real phone call with a real person who might pick up. The campaign is halfway through. Contact five thousand and something is ringing right now.

And then the container running it dies.

Not because anyone did anything wrong. That is just what serverless infrastructure does. It spins containers up when there is work and tears them down when it thinks there is not, or when it needs to move things around, or for no reason you will ever see in a log. The machine doing your work is temporary by design. It can disappear at any moment, mid-sentence, with five thousand contacts still waiting to be called.

This is the core tension I kept running into while building a production voice platform on Google Cloud Run. A phone campaign is long-lived and stateful. It has a position, a history, a sense of where it is. Serverless is neither of those things. It is short-lived and forgetful on purpose. Putting one on top of the other feels like building a house on ground that keeps shifting.

Here is how you make it stand up anyway.

## Keep the memory out of the machine

The first rule is the one that makes everything else possible. The container holds no truth. All the state lives in the database.

A campaign is stored as a record: which contact list, which position in it, how many processed, its status. That last field is a simple word, running or paused or completed or cancelled. The container is not the campaign. It is just a worker that reads the campaign's current position from the database, makes the next call, and writes the new position back. Every call attempt updates the record.

Why does this matter so much? Because if the worker vanishes, nothing important vanishes with it. The campaign's memory was never in the container. It was in the database the whole time. A new worker can pick up the record and know exactly where things stood, down to the last contact dialed. We modeled a campaign as nothing more than a long series of single calls, and put all the real logic in how one call gets made. The campaign is just a loop over that, with its place saved after every step.

## A pulse, so you can tell alive from dead

But there is a subtler problem. If the container can die silently, how does anyone find out? A dead worker does not send a message saying it died. It just stops. From the outside, a campaign that is being worked on and a campaign whose worker quietly disappeared look identical. Both say running in the database.

So we gave each active campaign a heartbeat. While a container is processing a campaign, it updates a timestamp on that record every thirty seconds. Just a small "still here, still working" tick. Think of it like the beep on a hospital monitor. As long as it keeps beeping, you know the patient is alive. When it goes quiet, you know something is wrong, and you know roughly when it went wrong.

That heartbeat turns an invisible failure into a visible one. A campaign marked running whose heartbeat has gone stale, older than a couple of minutes, is not being worked on. Its worker is dead. It has been orphaned. Now the problem is not "detect the impossible" but "notice a timestamp that stopped moving," which is easy.

## Recovery as a normal event, not an emergency

The last piece is what happens with those orphans. And the design choice I am most glad we made is this: recovery is not a special rescue operation. It is just something every container does when it wakes up.

When a new Cloud Run container starts, before anything else, it scans the database for campaigns that claim to be running but whose heartbeat has gone cold. Those are the orphans, left behind by some earlier container that died. The new container simply resumes them from their saved position and picks up the heartbeat again. A container dies, its heartbeat stops, and the next container to come along notices and takes over. No human paged at 3am. No manual restart. The system heals itself as a side effect of normal startup.

Pause and resume fall out of the same machinery for free. Pausing a campaign just means setting its status to paused. The processing loop checks that status before each call and, seeing paused, stops cleanly and lets the heartbeat lapse. Resuming sets it back to running and starts a fresh loop from the saved position. To the system, a human pausing a campaign and a container dying look almost the same: work stopped, position saved, ready to continue. One is intentional and one is a crash, but the recovery path is identical. That is the sign the design is right. The unusual case and the everyday case run through the same door.

## Building on shifting ground

There is a lesson here that reaches past phone calls.

Serverless is cheap and it scales beautifully, but it asks something of you in return. It asks you to stop trusting the machine. You cannot assume the process that started the work will be the one that finishes it. You cannot keep anything important in memory and expect it to be there a minute later. Every long-running thing has to be written so it can be picked up cold by a stranger, mid-task, with nothing but what is in the database.

That sounds like a burden. In practice it made the system tougher than it would have been on a machine we trusted. Because we assumed the worker could die at any moment, dying stopped being a catastrophe and became a Tuesday. The container that vanishes with five thousand contacts still waiting is no longer a disaster. It is just a gap of at most a couple of minutes before another container notices the silence, reads the record, and keeps dialing from exactly where the last one left off.

You do not fight the shifting ground. You build something that does not mind being dropped.

---
title: "Grading the Agent Blind"
category: "agent-simulation"
date: "2026-05-28"
excerpt: "An autonomous agent that grades its own homework will always pass, so I built a company with a hidden answer key and scored the agent against a truth it never sees."
author: "Rishi Raj"
---

An agent finishes a long, autonomous run. It has been working on its own for a while, making its own choices about what to do next, and now it turns to you and says, with something like confidence, "done." The map is complete. The task is solved.

The obvious question is the one nobody likes to ask. How do you know it is right?

Not "does it sound right." Not "did it look busy." Right. Did the thing it produced actually match reality, or did it produce something plausible, hand it to you with a straight face, and move on. An agent that decides for itself when it is finished can fool you, and worse, can fool itself. If you are not careful, you build a very expensive machine for generating confident answers that no one ever checks.

I wanted to build something where I could not fool myself. So I set up a game with a hidden answer key.

## The setup: an answer that exists but stays hidden

The task was process discovery. Take a company and figure out how work actually flows through it, end to end, who hands what to whom, where the approvals live, how a thing gets done. Normally this is slow human work, consultants interviewing staff for weeks.

Instead I generated a synthetic company. Departments, roles, a hierarchy, around a hundred employee personas. And crucially, at generation time, I also created a hidden ground-truth process map: the real answer for how this particular company works. That map is written down. It exists. It is just kept sealed.

Then I let a separate agent loose on the company with no access to that sealed map. Its job is to discover the process from scratch by interviewing the synthetic employees, each of whom can only speak from their own slice of the truth. The agent decides which roles to interview, asks its questions, records the process it infers, and stops when it judges itself confident.

The shape here is the important part. The truth exists before the agent starts, and the agent never sees it. That is the only way a grade means anything. An answer key written after the fact, or derived from the agent's own output, is a mirror, not a test. A student who writes both the exam and the mark scheme will always score full marks.

## Two numbers, and why one of them lies

At the end of a run I have two numbers, and the gap between them is the whole lesson.

The first is the agent's own confidence. It ran the interviews, built its map, and will tell you how sure it is that it got the company right. This number is easy to get and easy to trust and you should not fully trust it. It is the agent grading its own homework. It measures how convinced the agent is, which is a different thing from how correct it is, and the two come apart exactly when it matters most.

The second number is computed by the referee, not the player. After the agent declares itself done, the server opens the sealed map and compares it to the discovered one, process by process. For each true process it asks a blunt question: did the agent recover this or not. It checks whether the words line up, using a measure of how much the two descriptions overlap, and whether the agent put the process in the right department. Get both close enough and it counts as recovered. Otherwise it is missed. And anything the agent invented that has no match in the truth is flagged as an extra.

That gives a scorecard: matched, missed, extra, and a score. Not the agent's opinion of itself. An outside verdict against a truth it was never shown.

## Missed and extra are the honest columns

I care most about the two columns the agent would never volunteer.

Missed is what the agent does not know it does not know. It finished confident, but there were real processes it never uncovered, whole parts of the company it walked past. From the inside, the map looked complete. The missed column is the difference between "I have the picture" and "I have the picture I happened to find." An agent grading itself cannot see this by definition, because you cannot notice the interview you never thought to conduct.

Extra is the opposite failure and maybe the more dangerous one. It is the agent confidently reporting a process that does not exist. Not a small error, an invention, delivered with the same certainty as everything true. This is the failure mode that quietly poisons trust, because it does not look like a gap, it looks like knowledge. Only the answer key catches it. Held up against the truth, the invented process has nothing to match, and falls out into the extra column where you can finally see it.

## The discipline is the point, not the score

I want to be clear about what this prototype is and is not. It is a demonstration of a method, not a shipped product with users, and the coverage numbers it produces are per synthetic company, generated fresh each run. I am not going to quote you a headline accuracy figure, because the honest value here is not a number. It is the discipline.

The discipline is this: separate the doer from the judge, write the truth down before the work starts, keep it sealed until the work is done, and grade against it, not against the doer's own account of itself. That is what turns "the agent seemed confident" into "the agent recovered this much and missed that much and made these things up." One of those is a feeling. The other is a measurement.

We are going to hand more and more work to agents that run on their own and report back, and the temptation every time will be to accept the report. It reads well, it is fast, and checking it is tedious. But an autonomous loop with no external grade is just a confident narrator, and confidence is the one thing these systems produce for free.

So build the answer key first. Seal it. Then let the agent tell you it is done, and go check. The moment you stop checking is the moment you stop knowing anything at all.

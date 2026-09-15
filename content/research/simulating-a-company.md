---
title: "Simulating a Whole Company"
category: "agent-simulation"
date: "2026-05-14"
excerpt: "Nobody in a company can tell you how the whole company works, so instead of interviewing everyone myself I built the company out of agents and let one agent go find out."
author: "Rishi Raj"
---

Ask anyone in a company how the company works and you will get a true answer that is also useless. They know their part. The person in accounts payable knows exactly what happens to an invoice once it reaches their desk and has only a rumor about where it was before. The engineer knows the deploy pipeline and thinks procurement is a black box with a form on the front. Everyone holds a real, sharp fragment. Nobody holds the whole.

This is why understanding how an organization actually works is such slow, expensive work. The full picture is not written down anywhere and it is not in anyone's head. It is smeared across a hundred people, and the only way to reassemble it has been to interview all of them, one at a time, for weeks, and stitch the fragments together by hand.

I wanted to know if an agent could do the stitching. So I did something that sounds backwards. Before I built the thing that discovers how a company works, I built a company.

## Build the company, hide the answer

The first agent's whole job is to invent an organization. Give it a prompt and it generates a synthetic company from nothing: departments, roles, a hierarchy, around a hundred employee personas with names and positions. And, at the same moment, it writes down the thing no real company ever writes down, the true end-to-end process map. How work genuinely flows through this specific org, start to finish.

That map is the ground truth, and it gets sealed away. Generating it up front means I will have something to check the answer against later. But it does something else too. It means the company has a real structure underneath it, not just a cast of characters. Each of the hundred employees can be handed their own slice of that truth. The person in accounts payable knows the invoice step and little else, exactly like the real one. The knowledge is distributed the way it is in life, incompletely and unevenly, with nobody able to see past their own desk.

## Then let one agent go find out

Now the discovery. A separate agent walks into this synthetic company knowing nothing, and it is not shown the sealed map. Its task is to reconstruct how the place works purely by talking to the staff.

It runs the whole thing itself. It looks at the org, decides which departments and roles are worth interviewing, and poses questions to them. The synthetic employees answer in character, each from their own fragment, the way a real employee would, confidently about their part and vaguely about everyone else's. The agent listens, records the process it is starting to infer, decides who to talk to next based on the gaps, and keeps going. When it judges that it has the picture, it stops.

That is the trick, and it is worth sitting with. I did not write a script that says "interview finance, then interview sales." The agent decides, mid-run, where the holes in its understanding are and who might fill them. It does what a good consultant does, following the thread, noticing that two people described the same handoff differently and going to find out why, except across a hundred people without getting tired and without taking a fee.

Underneath, this is a small team of models with different jobs. A capable one runs the discovery loop and makes the judgment calls. A middle one designs the company and writes the interview questions. A cheaper, faster one plays the hundred employees, because a line worker answering from a fragment does not need the horsepower of the agent reasoning across all of them. You spend expensive thinking where it pays off and cheap thinking everywhere else. That is not a compromise. It is how you would staff it if the workers were people.

## Two maps, side by side

What comes out is two pictures of the same company.

One is the org map, the input: the boxes and lines, who reports to whom, the shape of the hierarchy. That is the easy picture, the one every company already has on a slide. The other is the discovered process map, the output: how work actually moves, which the company almost never has. The interesting thing is watching the second get built out of interviews with people who each only knew a piece of it. The whole assembled from fragments, in front of you, live, as the agent works.

And because I sealed the truth at the start, I do not have to take the agent's word for how well it did. I can open the real map and compare, and see which processes it recovered, which it walked past, and which it invented out of thin air. Interviewing your way to the truth and then checking that truth against a real answer key is a luxury you never get with a real company, because the real company has no answer key. Here I made one on purpose, so I could find out whether the method actually works or just looks like it does.

## Why not just ask people

The obvious objection is that this is a toy. Real companies are messier, real employees contradict each other and lie and forget, real processes have exceptions that live only in one person's memory. All true. This is a prototype, a way to prove the method against a truth I control, not a product I am claiming runs on live organizations.

But hold the objection up to the alternative, a room full of consultants doing the same thing by hand. They also interview people who contradict each other. They also miss the process that lives in one person's head. They also cannot check their final map against a hidden truth, because there is not one. The human version is not more rigorous. It is the same guesswork, slower, with no way to grade itself when it is done.

What I find worth chasing is not that an agent replaces the consultant. It is that the whole exercise, understand this organization, becomes something you can run, and rerun, and measure. You can watch the picture assemble from fragments and know afterward how much of it was real. Companies have always been these strange distributed things that no single person can see all of. For the first time, something can go look at the whole of one and come back with a map, then be honest about how much of the map it actually got.

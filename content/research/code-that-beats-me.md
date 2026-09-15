---
title: "Code That Beats Me"
category: "evolutionary-systems"
date: "2026-09-10"
excerpt: "We built a system to search for a better way to multiply matrices, and it found one that no person on our team designed."
author: "Rishi Raj Jaiswal"
---

The first time our system produced an algorithm none of us wrote, I sat and stared at the screen for a while.

We had asked a simple question. Take two 4x4 grids of numbers and multiply them. Every engineering student learns the schoolbook way to do this, and every student learns it costs a lot of small multiplications. The clever people who came before us found shortcuts. Strassen found a way to do it with fewer. Winograd found fewer still. These are famous results, taught for decades, the kind of thing you assume a human genius has to sit and derive on a napkin.

We wanted to know if a machine could find one of those shortcuts on its own. Not by being told the answer. By searching for it.

## What "searching" actually means here

The framework we built is called Darweel. The name is a nod to Darwin, because the idea is stolen straight from biology.

Here is the whole thing in plain words. Imagine you have a room full of candidate solutions. Each one is a way of multiplying the two grids, some good, most terrible. You do four things to them, over and over.

They compete. You measure each candidate on how few multiplications it uses and whether it still gives the right answer.

They mutate. You take a candidate and make a small random change. Swap a step. Combine two lines. Most changes make it worse. A few, by luck, make it better.

They reproduce. The ones that scored well get to mix with each other, passing on the parts that worked.

They survive. The weak ones die off. The room fills with the children of whatever was doing well last round.

That is a genetic algorithm. There is no grand plan inside it. There is only pressure, applied again and again, the same pressure that turns a wolf into a dog over enough generations. You do not design the outcome. You design the pressure and you wait.

## The number that mattered

The schoolbook method for 4x4 uses 64 multiplications. Strassen, applied to this size, gets you down to 49. That 49 is the number in the textbooks, the one people quote.

Darweel reached 48.

I want to be careful here, because this is the honest part. Forty-eight is a real, verified result. The system found a scheme that does the job in 48 multiplications, which matches the Winograd bound and sits one below the Strassen figure everyone remembers. We checked it. It works.

There is a further claim in the published report of a scheme around 47.95, a "Conditional Winograd" figure that squeezes below 48 under certain conditions. I am not going to tell you that as a fact, because I have not personally reproduced it. The report claims it. I am telling you what I saw with my own tests, which stops at 48, and I am telling you the rest is a claim I would want to earn before I repeat it as truth.

## Why it unsettled me, in a good way

Here is the thing that stayed with me. Nobody on the team sat down and derived the 48-multiplication scheme. We could not have. It is not intuitive. It looks, honestly, a little ugly, the way an evolved thing usually does, full of steps that seem arbitrary until you trace them and realize each one is load-bearing.

The algorithm emerged. It was not handed down from a clever human. It crawled up out of a few hundred thousand rounds of compete, mutate, reproduce, survive, and at the end of it there was a thing that beat the version I would have written by hand.

That is a strange feeling for an engineer. You spend your career being the one who knows the trick. And then you build a process whose entire job is to find tricks you do not know, and it does, and you are left holding a result you have to study to understand.

I think that is the whole point of this line of work. We are not trying to encode what we already know into a machine. We are trying to build searches good enough to find what we do not. The 48 is small. Two grids of sixteen numbers is a toy compared to what matters. But the shape of it is not a toy. Somewhere out there is a search we have not run yet, pointed at a problem we actually care about, and it is going to hand us an answer we did not design.

I would like to be in the room when it does.

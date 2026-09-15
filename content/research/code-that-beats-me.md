---
title: "Code That Beats Me"
category: "evolutionary-systems"
date: "2026-09-10"
excerpt: "We built a system to search for a better way to multiply matrices, and it found one that no person on our team designed."
author: "Rishi Raj"
---

The first time our system produced an algorithm none of us wrote, I sat and stared at the screen for a while.

We had asked a simple question. Take two 4x4 grids of numbers and multiply them. Every engineering student learns the schoolbook way to do this, and every student learns it costs a lot of small multiplications. Sixty-four of them, to be exact. The clever people who came before us found shortcuts. Strassen found a way. Winograd found another. These are famous results, taught for decades, the kind of thing you assume a human genius has to sit and derive on a napkin.

We wanted to know if a machine could find shortcuts like those on its own. Not by being told the answer. By searching for it.

## What "searching" actually means here

The framework we built is called Darweel. The name is a nod to Darwin, because the idea is stolen straight from biology.

Here is the whole thing in plain words. You keep a room full of candidate solutions. Each one is a way of multiplying the two grids, some good, most terrible. You do four things to them, over and over.

They compete. You measure each candidate on how few multiplications it uses and whether it still gives the right answer.

They mutate. You take a candidate and make a small change. Swap a step. Combine two lines. Most changes make it worse. A few make it better.

They reproduce. The ones that score well mix with each other and pass on the parts that worked.

They survive. The weak ones die off, and the room fills with the children of whatever was winning.

That is a genetic algorithm. There is no grand plan inside it. There is only pressure, applied again and again, the same pressure that turns a wolf into a dog over enough generations. You do not design the outcome. You design the pressure and you wait.

## The numbers

Watch the lineage, because this is the good part.

The schoolbook method costs 64 multiplications. Two-level Strassen, applied to a 4x4, gets you to 49, and that 49 is the figure most people quote. One of our bots, working generations back, rediscovered the structure of Winograd's method entirely on its own and reached 48. Already one below the number in the textbooks, and nobody handed it the recipe.

Then a descendant of that bot, a program our logs call edbbc5b2, did something I did not expect. It reasoned that a multiplication by zero is free. If you already know one of the two numbers is zero, the answer is zero, so you never have to spend the multiply. It wrote itself a small guard that checks for a zero before every multiplication and skips the operation when it finds one.

The worst case is still 48. But most real inputs are not the worst case, and across the evaluation some of those multiplications land on a zero and cost nothing. We ran it against five hundred test cases. It got every single one right, five hundred out of five hundred, and it used 23,972 multiplications in total. That is an average of 47.94 multiplications per case. Below 48. We named the scheme Conditional Winograd, because the saving depends on the data it is fed.

I want to be clear about what that 47.94 is and is not. It is not a new worst-case bound on matrix multiplication. It is a real, measured, verified average from a run where every answer was correct, produced by a program that taught itself to notice that zero is a shortcut. I checked the logs myself. The number is real.

## Why it stayed with me

Nobody on the team sat down and derived any of this. We did not write the 48-multiplication scheme, and we certainly did not think to skip the zeros. We could not have. It is not intuitive. It looks, honestly, a little strange, the way an evolved thing usually does, full of steps that seem arbitrary until you trace them and realize each one is load-bearing.

The algorithm emerged. It crawled up out of hundreds of thousands of rounds of compete, mutate, reproduce, survive, one generation improving on the last, until there was a program that beat the version I would have written by hand.

That is a strange feeling for an engineer. You spend your career being the one who knows the trick. Then you build a process whose entire job is to find tricks you do not know, and it does.

I think that is the whole point of this line of work. We are not trying to encode what we already know into a machine. We are trying to build searches good enough to find what we do not. Two grids of sixteen numbers is a small problem. But the shape of the result is not small. Somewhere out there is a search we have not run yet, pointed at a problem we actually care about, and it is going to hand us an answer we did not design.

I would like to be in the room when it does.

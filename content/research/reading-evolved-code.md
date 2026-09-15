---
title: "Reading Code No Human Wrote"
category: "evolutionary-systems"
date: "2026-04-02"
excerpt: "An algorithm that emerged from search is full of steps that look arbitrary until you trace them, and trusting it means a different kind of reading."
author: "Rishi Raj"
---

There is a specific feeling that comes from reading code and not understanding why it works. Not code that is broken. Code that works, that you can run and watch produce the right answer, and yet every few lines you stop and ask: why that? Why subtract those two things here, of all places?

I got a lot of that feeling from Darweel.

Darweel is an evolutionary framework I built where a population of language-model agents compete on a problem, and the survivors reproduce and improve over generations. Its best-known run went after a hard target: multiply two 4x4 matrices using as few scalar multiplications as possible. The naive method uses 64. A famous approach caps at 49. Darweel's population found its way to 48, below the bound, and later a descendant went lower still by skipping any multiplication where a value was zero.

I am not going to re-tell that hunt here. I want to talk about what it was like afterward, sitting with the thing it produced and trying to read it.

## Load-bearing and arbitrary at once

Open one of the winning solutions and it looks, at first, almost normal. The matrices get split into blocks. There are sums and differences of those blocks with names like S1, S4, T2, T3. Then a set of products. Then the products get recombined into the answer.

The trouble is the details. The code adds this block to that one, subtracts a third, multiplies the result by some other combination, and there is no comment that explains the choice, because no human made the choice. The specific pattern of which sums feed which products is the entire trick. It is what lets the count come in under the bound. And it looks completely arbitrary. Change one of those combinations and the answer goes wrong, so it is load-bearing. But nothing on the page tells you why that particular combination is the one that carries the weight.

That is the strange doubleness of evolved code. Every line is essential and every line looks like it could have been anything. Human code carries its reasoning in its shape: a function is named for what it does, a structure mirrors how the author thought. Evolved code carries no such thing. Search does not narrate. It just keeps whatever scored well and throws away the rest, and what survives is a set of moves that happen to work, stripped of any story about why.

## How you actually come to trust it

So how do you trust something like that? You cannot read it top to bottom and nod along the way you would with code a colleague wrote.

What I found is that you trust it the way you trust a bridge you did not design. Not by re-deriving the physics from your armchair, but by testing whether it holds. You run the algorithm on a pile of matrices you already know the answers to. It gets them right, every time. You count the multiplications the way the harness does, by wrapping each number so every multiply increments a counter, and the count is what it claims to be. The evidence accumulates until doubt becomes unreasonable.

That is a real form of trust, but notice it is a different kind. It is trust in behavior, not trust in reasoning. I can tell you that the code is correct and that it uses 48 multiplications, and I can show you the runs that prove it. What I cannot always give you is the clean human sentence for why those particular sums and differences conspire to save a multiplication. The proof that it works and the story of why it works have come apart. Usually those arrive together. Here the machine handed me one and kept the other.

## Tracing a single arbitrary step

The only way I know to close that gap is slow. You pick one step that looks arbitrary and you refuse to move on until it stops looking arbitrary.

You take one of those odd differences, say a block subtracted from another before it gets multiplied, and you follow it. Where does this product end up? Which entries of the final matrix does it feed? And slowly, if you are patient, a piece of the logic surfaces. That subtraction is there so that when the products are recombined later, a term cancels, and a multiplication that a more naive version would have spent is never spent at all. The arbitrary step was a setup for a cancellation four steps downstream. It only looks arbitrary because you were reading it in isolation, and its whole purpose lived somewhere else.

Do that enough times and the algorithm stops feeling alien. But it is real work, and you do not get to skip it by trusting the search. The search found the moves. It did not find the explanation, and the explanation is the thing a human still has to reconstruct, by hand, one traced thread at a time.

## What this means going forward

I think we are going to be doing a lot more of this. As systems like Darweel get better at producing artifacts, whether that is code, a proof, or a design, we are going to spend less time writing and more time reading things no person authored, deciding whether to trust them and why.

That is a skill worth taking seriously now. The instinct to reject code you do not immediately understand is a good instinct with human code, where opacity usually means someone was careless. It is the wrong instinct with evolved code, where opacity is the normal condition and the code may be genuinely, verifiably right. The discipline is to hold both thoughts at once: I do not yet understand this, and it may still be correct, and my job is to find out which by testing and by tracing, not by how it makes me feel to read it.

The matrix code still looks, in places, like a series of arbitrary choices. But I have traced enough of the threads to know they are not arbitrary. They are reasons I did not think of, found by a process that could not have explained itself if I asked. That is a new kind of colleague to have. Brilliant, correct, and completely unable to explain itself.

---
title: "Reproduction by Merging"
category: "evolutionary-systems"
date: "2026-05-20"
excerpt: "In Darweel, two candidate programs have children by fusing their prompts and memories, and that turns out to be a real mechanism for new capability."
author: "Rishi Raj"
---

Think about how you got good at something hard. You did not invent your method from scratch. You took a trick from one person, a habit from another, and you welded them together into a way of working that was yours. Neither source could have told you the whole thing. The combination did.

That is the idea I wanted to build into Darweel. Darweel is a small evolutionary framework I wrote where a population of language-model agents, which I call bots, each get the same problem, write a solution, and get scored against each other. The top performers survive. Then they reproduce. The interesting word there is reproduce, and I mean it more literally than you might expect.

## What a bot actually carries

Before we talk about breeding, look at what a single bot is. It is not a fresh model each time. Each bot carries a system prompt that describes who it is and how it approaches problems, plus a two-tier memory. One tier is the working memory it holds while solving. The other is a longer record of what it has done and learned, written down in plain markdown and kept across the run. A bot also carries the report it last produced, its actual attempt at the problem.

So a bot is really a bundle of three things: a disposition, a memory, and a most recent piece of work. That bundle is what gets passed on.

## Breeding two bundles

When a generation ends, the top performers are selected, by default the strongest fifth or so. Then Darweel pairs them up and makes children until the population is full again.

Here is the part that matters. A child is not a copy of a parent, and it is not a random mutation of one. It is a merge of two. Darweel takes parent A's last report and its memory, and parent B's last report and its memory, and it asks a model to synthesize the most valuable pieces of both into a single inheritance for the child, held under a budget of a few hundred words. That fused text becomes the child's generational knowledge, the thing it starts life already believing.

There is a plain fallback if the synthesis step fails. The system pulls the key sentences out of each parent, the ones that mention a solution, an approach, an algorithm, a discovery, and stitches them together, then trims to the budget. Cruder, but the shape is the same. Two lineages of insight go in. One goes out.

The child also inherits a slice of each parent's memory and a record of who its parents were and how well they scored. It knows its own ancestry.

## Why this is a mechanism and not a metaphor

It would be easy to call this "reproduction" as a cute label and mean nothing by it. I want to argue it earns the word.

Consider the matrix problem Darweel is best known for. The task was to multiply two 4x4 matrices using as few scalar multiplications as possible. The naive method uses 64. A famous approach caps at 49. Darweel's population pushed below that, to 48, and it did not get there in one leap. It got there across generations: 64, then 56, then 49, then 48. Each of those numbers came from a bot standing on the merged inheritance of the ones before it.

That progression is the tell. If merging were decoration, a child would do about as well as a random parent, and the best score would wander rather than climb. It climbed. A bot that had absorbed one parent's habit of unrolling every operation by hand and another parent's willingness to hunt for redundant products could try something neither parent tried. The combination was the new capability. Not the individual, the combination.

This is also why I do not merge by averaging. You cannot average two programs and get a working program, the same way you cannot average two recipes and get dinner. What survives a merge is described insight, in language, which a model can recombine into something coherent. The parents hand down what they figured out, in words, and the child reads that as its starting belief. Language is the genome here. That is a strange sentence to write, but it is the honest description of what the code does.

## What the merge quietly protects against

There is a failure mode in any search like this. The population converges. Everyone starts thinking the same way, and the search stops finding anything new because there is nothing new to combine. Diversity dies and the whole thing gets stuck at a local best.

Merging two different parents, rather than cloning one good one, is a small guard against that. As long as the survivors are genuinely different in how they approach the problem, their children are recombinations, not repetitions. The interesting descendants come from parents who disagreed. A bot obsessed with order paired with a bot willing to cut corners produces a child that keeps the discipline and takes the shortcut. That specific pairing is where the 48-multiplication result lived, and where a later refinement that skips multiplying by zero came from too.

## The honest limit

I do not want to oversell it. The merge is only as good as what the parents wrote down, and a lot gets lost when you compress two theses into a few hundred words. Sometimes the child inherits the confident summary and not the fragile reasoning underneath it, and it repeats a claim it cannot actually support. Compression is lossy, and belief is easier to pass down than proof.

But the core thing holds. Two programs met, exchanged what they knew in plain language, and their child could do something neither could. We usually reserve that story for living things. It turns out you can write it in Python.

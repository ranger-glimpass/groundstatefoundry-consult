---
title: "Nearly Orthogonal"
category: "perspectives"
date: "2026-03-28"
excerpt: "In everyday space you can only fit three lines at right angles, but in a very high-dimensional space you can fit an astonishing number that are almost perpendicular, and that is why a model can hold a whole world inside it."
author: "Rishi Raj"
---

Stand in a corner of a room. Look at where two walls meet the floor. Three edges run away from that corner, and each one points at a right angle to the other two. Up, and two ways along the ground. Try to add a fourth line that is also at a clean right angle to all three. You can't. There is no room for it. Three dimensions give you exactly three directions that are truly perpendicular, and then you are out of space.

This bothered me for a long time, because I kept hearing that language models store thousands of separate ideas inside a list of a few thousand numbers. A single word gets turned into a vector, which is just a long arrow pointing somewhere in a space with, say, four thousand dimensions. And people would say this arrow encodes hundreds of features. Is it a plural noun. Is it about food. Does it carry a warm feeling. Is it formal. Each of those, supposedly, gets its own direction.

But if a corner of a room only has room for three clean directions, how does a space, even a big one, hold hundreds of thousands of them?

## The trick is the word "clean"

Here is the thing I was missing. The model does not need directions that are perfectly perpendicular. It only needs directions that are almost perpendicular. And "almost" changes everything.

Two arrows are perpendicular when they share nothing, when knowing one tells you nothing about the other. Perfectly perpendicular is a strict club. In three dimensions only three members fit. But if you loosen the rule just a little, if you say two directions count as separate so long as they are close to perpendicular, say within a few degrees of a right angle, the number of members you can fit explodes as the space gets bigger.

In three dimensions, loosening the rule barely helps. In four thousand dimensions, it helps beyond what feels reasonable. You can pack not thousands but a number so large it has no everyday name. Directions that are all mutually near-perpendicular, none of them stepping on any other, each one usable as its own private axis for its own private meaning.

This is not a trick of engineering. It is a fact about the shape of high-dimensional space itself. Mathematicians noticed it long before there were language models, and it carries the names of two of them, Johnson and Lindenstrauss. The plain version of what they proved is this. When you have a lot of dimensions, you can crush an enormous number of arrows into that space and keep almost all of them nearly at right angles to each other. Space up there is roomy in a way our eyes never trained us for.

## Why this is strange, and why it matters

Our intuition is built in three dimensions. We grew up in rooms and fields and the sky. So when someone says "add another perpendicular direction," a small voice inside us says no, there is no room. That voice is right about rooms. It is badly wrong about the space inside a model.

Think about what near-perpendicular buys you. If "plural" and "about food" point in nearly perpendicular directions, then a word can be a little of both, and the model can read off how plural it is without that reading getting muddied by how food-related it is. The two meanings don't interfere. They live side by side in the same list of numbers, quietly, because their arrows barely notice each other.

Multiply that by hundreds of thousands. A single vector, a few thousand numbers long, becomes a place where a whole world of small features can coexist without stepping on toes. Not because the space is infinitely large. Because near-perpendicular directions are cheap up there, and the model spends them freely.

I find this quietly beautiful. We tend to imagine that to hold more, you need more room, more shelves, a bigger warehouse. High-dimensional space says something gentler. You don't always need more room. Sometimes you just need to stop insisting on perfect right angles and accept "close enough." Close enough, repeated across thousands of dimensions, is how a few thousand numbers come to hold a whole language.

I still can't picture it. My eyes won't do four thousand dimensions, and I have made peace with that. But I trust the corner of the room to lie to me now, and that is its own kind of progress.

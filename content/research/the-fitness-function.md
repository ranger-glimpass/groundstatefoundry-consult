---
title: "The Fitness Function Is the Whole Game"
category: "evolutionary-systems"
date: "2026-04-18"
excerpt: "Whatever you choose to measure is exactly what an evolutionary system will give you, so getting the fitness function wrong means evolving the wrong thing perfectly."
author: "Rishi Raj"
---

Here is a mistake I made on purpose, to see what would happen.

When I first stood up Darweel, my evolutionary framework where a population of language-model agents compete and the winners survive and reproduce, I needed a way to score them. I reached for the simplest thing I could write. The score was the length of the report. Longer answer, higher fitness. I knew it was wrong. I wanted to watch it be wrong.

It was wrong immediately and it was wrong beautifully. Within a couple of generations the bots were producing enormous, padded, magnificently verbose documents that said very little. They had not gotten smarter. They had gotten longer, because length was the entire definition of winning, and they had found it. The system worked flawlessly. It optimized precisely what I asked for. I just asked for the wrong thing.

That is the whole lesson, and I want to spend the rest of this piece on why it is not a footnote. It is the game.

## What a fitness function actually is

In any evolutionary system, the fitness function is the one line that decides who lives. Everything else, the reproduction, the mutation, the competition, is machinery for climbing a hill. The fitness function is the hill. It defines up. Point it at the wrong summit and the population will climb, tirelessly and cleverly, to a place you never wanted to go.

A human trying to reach a goal notices when the goal has gone stupid. They feel the wrongness and stop. An evolutionary population feels nothing. It does not know what you meant. It only knows what you measured. Give it a proxy for what you want and it will chase the proxy right off a cliff, and it will look like success the whole way down. The verbose reports were not a bug in the bots. They were the honest answer to the question I actually wrote.

## Measuring the real thing

The fix is not cleverness. It is choosing an honest measurement. And the cleanest fitness functions are the ones where the thing you want and the thing you can count are the same thing.

The matrix problem Darweel is known for has that property, which is why it works. The task was to multiply two 4x4 matrices with as few scalar multiplications as possible. The naive method uses 64. A well-known approach caps at 49. So the fitness function could be brutally direct: run the bot's code, confirm it produces the correct product, and count how many multiplications it used. Fewer is better. There is no proxy in that. The number you optimize is the number you care about.

Under that fitness function the population did something real. It drove the count down generation by generation, 64, then 56, then 49, then 48, dropping below the bound I had quietly bet it could not beat. That progress was not luck and it was not my cleverness. It was the fitness function doing its job, because for once the job was measuring the truth.

Notice the difference from the length experiment. Both fitness functions "worked" in the sense that the population maximized them. Only one of them was pointed at something worth maximizing. Same machine, opposite outcomes, and the only thing that changed was the one line that defines up.

## Two ways to get it wrong

Once you take this seriously, you start seeing the two failure modes everywhere.

The first is measuring a proxy. Report length instead of report quality. It is seductive because the proxy is easy to compute and correlates with what you want, right up until the population learns to break the correlation. Every proxy has a gap between it and the real goal, and evolution's entire talent is finding that gap and living in it.

The second is subtler: measuring something that is real but incomplete. If I had scored the matrix bots only on correctness and forgotten to count multiplications, I would have gotten correct, ordinary, 64-multiplication code forever, and no reason for anything better to emerge. The bots would have been right and boring, because I never told them that fewer was better. What you leave out of the fitness function is as loud as what you put in. Silence on a dimension is a decision to not care about it, and the population hears that decision clearly.

This is also why Darweel does not always trust a single measurement. On hard problems it runs a peer-voting arena alongside the execution check, and it leans on the vote early, when it wants to explore promising but unpolished ideas, and on the hard measurement later, when it wants the proven result. The arena is a hedge against a fitness function that is too narrow, too soon. A way of not strangling a good idea for failing a test it was not ready for.

## Why this is the part that keeps me up

People building these systems spend most of their attention on the model, the search, the scale. Those matter. But they are all in service of climbing, and the fitness function is what they climb toward. It is the smallest piece of the whole system and it decides everything the system becomes.

I think about this well beyond Darweel. Every metric a team optimizes is a fitness function. Pick engagement and you will get engagement, including the kind that corrodes the thing you were actually trying to build. The organization climbs the hill you named, not the one you meant, and it does it with the same tireless indifference as a population of bots chasing report length.

So before I ask whether a system is powerful, I ask what it is measuring. That one line is the answer to what it will become. Everything else is just how fast it gets there.

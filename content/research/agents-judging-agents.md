---
title: "Agents Judging Agents"
category: "evolutionary-systems"
date: "2026-05-06"
excerpt: "In Darweel, the agents grade each other's work in a voting arena, which lets selection run round after round without a human scoring every answer."
author: "Rishi Raj"
---

Who decides which answer is better?

For most machine learning, the honest answer is: a person did, at some point. Someone labeled the data, or wrote the reward, or sat down and ranked the outputs. The judgment is human, frozen into the system ahead of time. That works until the questions get hard enough that no human wants to grade ten thousand of them, one at a time, every round.

Darweel needed a way around that. Darweel is an evolutionary framework I built where a population of language-model agents compete on a problem, and the winners survive and reproduce. The word "compete" is doing a lot of work. To compete, they need to be scored. And I did not want to be the scorer.

## The arena

So the bots score each other. I call it the arena.

The mechanic is simple. After every bot has written its solution, Darweel runs a voting round. It takes two reports at a time, hands the pair to a bot, and asks a plain question: which of these better solves the problem, A or B? The bot reads both and replies with a single letter. That is a vote. The report it picked gets a win. Do this across many random pairings, count up the wins, and you have a ranking. The bots with the most wins are the survivors.

No human in the loop. The population produces the work and the population judges the work. The judgment feeds selection, selection feeds reproduction, and the next generation shows up already shaped by what its parents' peers rewarded. That is a feedback loop that closes on itself, and it can run as many rounds as you can afford tokens for.

## Why pairwise, and why blind

Two small choices matter more than they look.

First, the comparison is pairwise. I do not ask a bot to give a report a score out of ten. Absolute scores from a language model are mush. Ask the same model to rate the same essay twice and you can get a seven and then a four. But ask "is A better than B" and the answer is far steadier, because a comparison only needs to get the direction right, not the magnitude. It is the difference between asking someone how tall a stranger is and asking which of two strangers is taller. The second question is easy even when the first is hopeless.

Second, the pairings are random and the voter does not know whose work it is reading. It sees two reports, nothing else. A report earns votes by being convincing on the page, not by belonging to a bot with a reputation. Spread enough of these blind comparisons across the population and the noise in any single vote starts to cancel. A genuinely better solution wins more of its matchups than it loses. The signal is in the aggregate, never in one judgment.

## Self-supervised, and what that really means

I keep calling this self-supervised, so let me be precise about what I mean, because it is easy to overclaim.

The bots are not inventing the goal. The goal is fixed. What the bots supply is the labor of evaluation. Instead of a human deciding, ten thousand times, that this report reads as more sound than that one, the population does that work for itself, in parallel, on its own output. The supervision signal is manufactured by the same system it trains. That is the sense in which it feeds itself.

And here is the honest catch, which I think is the most interesting part. A jury of language models can be confidently wrong together. If they all share a blind spot, they will all reward the same flawed answer, and the arena will happily select for it. Peer judgment is only as good as the peers. A room full of people who all believe the same wrong thing will vote for it unanimously and feel great about it.

## So why trust it on a hard problem

That worry is exactly why the arena does not run alone when there is a hard fact to check against.

Take the matrix multiplication work Darweel is known for, where the bots hunted for a way to multiply two 4x4 matrices using fewer scalar multiplications, and drove the count below a well-known bound. For a problem like that, opinion is not enough. There is a ground truth. The code either produces the right product or it does not, and the harness counts exactly how many multiplications it used. So Darweel runs the arena and the execution check side by side.

What I like is how it weights them over time. Early generations lean on the arena, because early on you want exploration, and a bot with a promising idea and messy code should not be killed for the messy code. Later generations lean on execution, because by then you want exploitation, the actual measured result, no charm points. The vote gets an idea through the door. The measurement decides whether it earned its place. Taste first, then proof.

## The part that stays with me

Strip it back and the arena is a machine for turning judgment into a renewable resource. Human evaluation does not scale. It is slow, it is expensive, and it runs out. The arena does not run out. You can hold ten thousand comparisons in an afternoon, and the population never gets tired or bored or annoyed at question nine thousand.

The catch is the one I already named. When the judges are wrong together, the arena has no way to know. That is why I never let it be the only voice on a problem where the truth can be measured. But on the problems where it works, there is something quietly startling about it. A crowd with no human in it can still tell better from worse, most of the time, well enough to climb. You just have to keep it honest with a fact it cannot vote away.

---
title: "Tools as Data"
category: "applied-ai"
date: "2026-04-22"
excerpt: "Most software teams ship a new product by writing new code. What if a new product were just a row in a database, and shipping it took minutes?"
author: "Rishi Raj"
---

Here is a question I kept asking on an EdTech platform, and it turned out to be the only question that mattered. A coaching institute wants a new study tool. A biology mock-test product, say, with its own branding, its own quizzes, its own way of scoring and reporting. How long should it take to bring that into existence?

The normal answer is a development cycle. A designer, a couple of engineers, a branch, a review, a release. Weeks, if you are quick. And the next institute wants a chemistry tool that is almost the same but not quite, and you do it all again, slightly differently, and now you are maintaining ten near-identical products that drift apart over time. Anyone who has built software for many customers knows this ache. Every new thing is a new build, and every build is a new thing to keep alive.

I did not want to build products. I wanted to build a machine that produces them. And the way to do that is to stop treating a product as code and start treating it as data.

## The idea, in one sentence

A new tool is not new code. It is a new row in a database.

That is the whole philosophy, and it sounds almost too simple to work. Let me make it concrete. On this platform, a study tool is defined by a handful of configuration fields stored in a `tools` table. One field holds the branding: the name, the colors, the card the student sees. Another holds the environment: what screens the tool has, which of a small set of reusable interface pieces it uses, how they are wired together. A third holds the prompts: the exact instructions given to the AI that generates the questions and reads the answers.

Those fields are just data. JSON, sitting in a column. To create the biology mock-test product, an administrator writes that data. No new frontend code is written. No branch, no release. The platform reads the row and assembles the tool on the fly.

## Why this works: the pieces are dumb on purpose

The move that makes this possible is to build the interface out of pieces that know nothing about biology or chemistry or any particular subject.

There is a Quiz piece. It knows how to show questions and collect answers. It does not know or care what the questions are about. There is a Dashboard piece, a Reports piece, a Profile piece. Each one is data-agnostic, which is a fancy way of saying you can point it at any source of data and it will render it. Think of them like the standard bricks in a construction set. A brick does not know whether it is going to be a house or a bridge. Its dumbness is exactly what lets it be either.

The configuration is the instruction sheet that tells the bricks what to become. When the platform loads a tool, it reads the config, picks the right pieces, feeds them the right data, and points the AI features at the right prompts. The biology tool and the chemistry tool run on the identical pieces of code. The only thing different between them is the data that describes them.

So the surface area of "a new product" collapses. It is no longer code you write and maintain. It is a configuration you author. And authoring a configuration is a task measured in minutes, not weeks.

## What you get, beyond speed

The speed is the headline, but the deeper wins are quieter.

You maintain one thing, not ten. When you fix a bug in the Quiz piece, every tool that uses it is fixed at once, because they are all the same piece. The old world, where ten near-identical products slowly rot in ten different directions, simply does not form. There is nothing to drift, because there is only one of each part.

The AI behavior becomes something you can tune without a deploy. Because the prompts, the instructions to the question-generating model, live in the config rather than buried in code, you can adjust how a tool behaves per institute by editing data. A tool for one audience can be told to generate gentler questions; another, harder ones. That is a data change, not an engineering project.

And the shape of the business changes with the shape of the software. When making a new product is a configuration task, non-engineers can make products. The bottleneck stops being the development team. That is the real meaning of "tools as data." You are not just shipping faster. You have moved the act of creation out of the codebase and into a place where more people can reach it.

## The honest cost

I will not pretend it is free. Building the generic pieces is harder than building a specific screen. A Quiz component that must work for any subject, any config, any data source, takes more thought than a biology quiz you hardcode in an afternoon. You pay the design cost up front, and you pay it in full, before any of the payoff arrives.

There is also a ceiling. A configuration-driven system does beautifully the things its pieces were designed to do, and it does nothing at all outside that. The day an institute wants a genuinely new kind of interaction, one no existing piece can express, you are back to writing code, adding a new piece to the set. The art is in choosing pieces general enough to cover most of what people will ask for, and being honest that "most" is not "all."

But when it fits, it is a different way to live. A product used to be a thing you built. Now it is a thing you describe. And the gap between an idea and a working tool in front of a student shrinks from a project to an afternoon. That compression is the point. It is what a machine that makes products, rather than a product, actually buys you.

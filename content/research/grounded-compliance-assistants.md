---
title: "Assistants That Have to Be Right"
category: "applied-ai"
date: "2026-05-02"
excerpt: "In a chatbot about movies, a wrong answer is a shrug. In one that tells a business owner how to register or file taxes, a wrong answer costs them money. That changes how you build."
author: "Rishi Raj"
---

Imagine a woman running a small manufacturing unit. She speaks Marathi more comfortably than English, and she needs to know whether she qualifies for a particular government scheme, and how to register her business to get it. She has been told to ask an assistant. She types her question in her own language, and the assistant answers, confidently, in a clean paragraph.

Now everything depends on one thing: is the answer true?

If it is a chatbot about films, and it invents a director, nobody is hurt. She laughs and moves on. But this is not films. If the assistant tells her the wrong registration category, or a filing deadline that does not exist, she can lose money, miss a benefit she was entitled to, or file something that gets rejected. The cost of being wrong is real and it lands on a person who trusted the machine.

Building an assistant for a domain like that is a different discipline from building a clever one. The goal is not to sound smart. It is to be right, or to be honest about not knowing. Here is how you design for that.

## Why a raw language model is the wrong tool alone

A language model, left to itself, is a fluent guesser. It has read an enormous amount of text and it predicts what words should come next. That makes it wonderful at sounding authoritative. It also makes it willing to invent. When it does not know something, it does not go quiet. It produces something plausible in the same confident tone as everything else. The polite word for this is hallucination. In a regulated domain it is the whole danger, because the reader cannot tell the invented sentence from the true one. They both read like an expert talking.

So the first design decision is to stop letting the model answer from memory.

## Grounding: make it cite, not recall

The technique is called retrieval-grounded generation, and the plain version is this. Before the model answers, the system goes and finds the actual relevant passages from a trusted source: the real rules, the real scheme documents, the authoritative guidance. It hands those passages to the model and says, in effect, answer using only this, and point to where you got it.

Think of the difference between a student answering an exam from memory and one answering with the textbook open on the desk, required to cite the page. The second student can still make mistakes, but the mistakes are bounded, and you can check their work. That is what grounding does. The model's job shifts from "know the tax code" to "read these three passages of the tax code and explain them." The second job is one it is actually good at, and it is one you can verify.

The engine underneath is a curated knowledge base, kept in what is called a vector store, which is just a way of finding passages by meaning rather than exact words. When she asks about her scheme in Marathi, the system finds the right passages even though she did not use the official English keywords. Then it answers from those passages, grounded, ideally in her language.

## The parts that are quietly the hard parts

Grounding is the headline, but trust is built in the unglamorous details around it.

You have to know what she is actually asking. A question about "registration" could mean the business registration, the tax registration, or a scheme enrollment, and the right documents differ for each. So before retrieval there is intent classification, a step that reads the question and decides what kind of question it is. Get that wrong and you retrieve the right answer to the wrong question, which is its own species of confidently incorrect.

Language multiplies the difficulty. Serving a domain across a dozen languages is not a translation layer bolted on the end. The retrieval has to work when the question and the source documents are in different languages, and the answer has to come back in the language the person is comfortable reading, without the meaning drifting in the round trip. A subtle mistranslation of a legal term is indistinguishable, to the reader, from a subtle lie.

And you have to design the not-knowing. The most important sentence such an assistant can produce is some form of "I am not certain, here is where to check, or here is a human who can help." A system that always answers is a system that will sometimes answer wrong with a straight face. One that knows its own edges, and hands off at them, is one people can actually rely on. Building that restraint in is harder than building the fluency, because the fluency comes for free and the restraint does not.

## Trust is a system property, not a model feature

None of this lives inside the language model. The model is one component. The trust is a property of the whole system wrapped around it: the trusted knowledge base, the retrieval that keeps answers tied to real sources, the intent step that aims the retrieval, the multilingual handling that does not distort meaning, the citations that let an answer be checked, the graceful admission of doubt, and behind all of it the boring, essential scaffolding of a regulated build, encryption, access control, and a compliance framework that treats this person's data as seriously as her question deserves.

I find this the honest frame for applied AI in domains that matter. The model is not the product. The model is a fluent, gifted, slightly reckless intern. The product is everything you build to make that intern trustworthy: the sources on its desk, the requirement to cite them, and the manager who taught it to say "let me check" instead of guessing. For the woman with the Marathi question, that scaffolding is the difference between help and harm. She will never see any of it. She will only feel whether the answer was right.

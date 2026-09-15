---
title: "Turning a Phone Camera Into a Data Pipeline"
category: "applied-ai"
date: "2026-05-22"
excerpt: "A pharmacist photographs a crumpled supplier bill, and a vision model turns it into a live inventory. Here is what works and where it still fights back."
author: "Rishi Raj"
---

Picture the counter of a small pharmacy at the end of the day. A supplier's delivery bill sits next to the till. It is a thermal-printed sheet, half a page, with faint ink, a coffee ring, and forty line items squeezed into a grid that was never designed to be read by anything but a tired human. Each line is a medicine, a batch number, an expiry date, a quantity, a price. Someone has to type all of that into a computer, or it does not become inventory, and if it does not become inventory the shop cannot tell you what is about to expire on the shelf.

For years the answer was: someone types it. Slowly. At night. With mistakes.

I wanted the phone to do the typing. Not the phone's keyboard. Its camera.

## The old way to read a page, and why it breaks

The traditional tool for this is OCR, optical character recognition. You can think of it as a machine that traces the shape of every letter and guesses which letter it traced. It has been around for decades and it is very good at clean text on a clean page. A printed novel, a typed letter, a tax form with fixed boxes. Point it at those and it will read them beautifully.

Point it at a supplier bill and it falls apart. The problem is not reading the letters. The problem is that a bill is not a paragraph. It is a table where the meaning of a word depends entirely on which column it sits in. "AMOX 500" means one thing under "product" and nothing at all under "batch." Classic OCR gives you back a soup of characters and their positions on the page. It does not know that the second number on the row is the batch and the third is the expiry, because it does not know what a batch or an expiry is. You are left writing brittle rules about pixel coordinates, and every supplier prints their bill differently, so the rules never stop breaking.

## Reading for meaning, not just shape

The shift is to stop asking a machine to trace letters and start asking it to understand a document.

A modern vision-and-language model, in our case Google's Gemini, does not read the page one letter at a time. You hand it the photo and you tell it, in plain words, what you want back: for every medicine on this bill, give me the name, the batch, the expiry, and the quantity, as structured data. It has seen enough invoices and bills in its training that it holds a rough idea of what a purchase bill is. So it reads for meaning. It understands that this messy grid is a list of products, that this column is dates, that this smudged token is probably a batch code. It returns clean rows.

That is the whole trick, and it is a big one. The camera becomes the data-entry device. A pharmacist photographs the bill, and a few seconds later the medicines, batches, and expiry dates are sitting in a live inventory. On top of that inventory you can finally build the thing that actually saves money: expiry intelligence. The system watches the dates and warns the shop, three times a day, about stock that is about to turn into a loss. None of that is possible until the bill is data. The camera is the front door.

## Where it still fights back

I promised honesty, so here it is. Reading bills with a language model is not magic, and the failures are specific.

Dates are the cruelest. An expiry printed as "06/28" could be June 2028, and almost always is, but a model that reads for meaning can also decide it looks like a day and a month and quietly invent a year. On a pharmacy shelf that mistake is not cosmetic. Flag an expired strip as fresh and someone can be harmed. So we do not simply trust the read. We wrap the date handling in guardrails: explicit instructions about the format, sanity checks that reject a date in the past or absurdly far in the future, and a bias toward asking rather than guessing. A model that is confidently wrong about an expiry is worse than one that admits it is unsure.

Then there is the near-match problem. A bill might say "PARACIP 500" when the shelf and the master catalog call it something slightly different. To connect a read to a real product we match every extracted name against a master dataset of roughly fifteen thousand medicines. That matching reaches about 99.6% accuracy on our data, which is high, and the remaining fraction is exactly the fraction a human still needs to eyeball. We measured that number ourselves; it is our result, not an independent audit.

And bills arrive twice. A delivery gets photographed, then photographed again by a different staff member, and now the shop's inventory is double-counted. So the system detects duplicate bills and offers to replace rather than re-add. The model reads the page; the plumbing around it decides what to do with a page it has already seen.

## What the counter looks like now

The honest summary is that the model does the reading and the system does the trusting. The vision model is astonishing at turning a crumpled photo into rows. It is not, on its own, careful. Care is something you build around it: the date guardrails, the master-data match, the duplicate check, the editable field so a pharmacist can fix the one line that came back wrong.

Get that right and the night shift of typing disappears. The pharmacist points a camera at the mess on the counter, and the mess becomes something the shop can act on. That is the part I keep coming back to. We did not make the bills any cleaner. We just stopped needing them to be.

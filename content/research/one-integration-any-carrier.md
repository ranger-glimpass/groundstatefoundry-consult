---
title: "One Integration, Any Carrier"
category: "voice-ai"
date: "2026-08-20"
excerpt: "A telephony provider changes one field name in a webhook and your whole voice product breaks, unless you built a seam between your code and the carrier."
author: "Rishi Raj"
---

A client comes to you and says their calls need to run over a different carrier. Maybe the old one has bad coverage in their region. Maybe the pricing changed. Maybe a compliance rule says calls to a certain country have to go through a local provider. Whatever the reason, the request sounds small. Switch the phone lines. Keep everything else the same.

Then you open the code and your stomach drops.

The carrier is everywhere. Its field names are in your database. Its webhook shapes are baked into your route handlers. The way it identifies a call, the way it reports who hung up, the way it tells you a call was answered, all of it is scattered through the system like sand in a carpet. Changing the carrier does not mean changing one thing. It means touching a hundred things and praying you found them all.

I have built a production voice platform where this exact problem had to be solved, and solved without breaking the calls already running. Here is what we learned.

## Three carriers, three dialects

We supported three telephony providers: Plivo, Exotel, and Twilio. Think of a carrier as the company that actually connects your software to the phone network, the way an internet provider connects your house to the wider internet. All three do the same basic job. They dial a number, they open an audio stream, they tell you what is happening on the call.

But they describe that job in completely different words.

When a call starts ringing, one carrier sends you a field called `CallUUID`. Another calls the same thing something else. One tells you the caller's number in a field named `From`, another names it differently, and the format of the number is not even guaranteed to match. When a call ends, each one reports the hangup reason in its own vocabulary, with its own set of possible values. Even the security is different: one signs its webhooks with an HMAC signature, another uses basic auth. A webhook, by the way, is just the carrier calling your server back to say "something happened on this call."

So you are not dealing with one phone system. You are dealing with three, each speaking a related but incompatible dialect. If you let those dialects leak into your application, your application now speaks three languages badly.

## The seam

The fix is an old idea and a good one. You put a layer between your code and the carriers, and you make a rule: above this layer, there is only one language.

We used the adapter pattern for this. An adapter is a translator. It takes the carrier's specific words and turns them into a single normalized shape that the rest of the system agrees on. Every call, no matter which carrier carried it, becomes the same kind of record: a call id, a from and to in one consistent format, a start time, an answer time, an end time, a status drawn from one fixed list, a hangup cause from one fixed vocabulary. The messy original data is kept too, tucked in a raw field, in case you ever need to look at exactly what the carrier said. But the application never reads that raw field. It reads the clean version.

Above the adapters sits one component that picks which adapter to use. Give it a client, and it looks up which carrier that client is configured for and hands back the right translator. The routes, the business logic, the frontend, none of them know or care which carrier is on the other end. They ask for a call to be made. They get normalized events back. The specifics stay behind the seam.

The frontend part matters more than it sounds. Because the console never learned any carrier's vocabulary, we could change a client's carrier without shipping a single frontend change. The seam did not just protect the backend. It protected everything downstream of it.

## The part people skip

Here is the detail that separates a design doc from a system that survives contact with production.

We already had live calls running over Plivo. Real clients, real traffic, real money. You cannot pause that to go build a beautiful new abstraction. If the migration breaks the existing path, you have not improved the system, you have set it on fire.

So the first adapter we built did almost nothing clever. It wrapped the existing Plivo code. Same functions, same behavior, just presented behind the new interface. The rule was zero breaking changes: the old routes kept working exactly as before, and the new unified routes ran alongside them. A client defaulted to Plivo unless told otherwise. Nothing moved until we chose to move it.

That let us migrate one client at a time. Flip a single client to the new layer. Watch it. If something looked wrong, flip it back, because the legacy path was still alive and unchanged. Only once a client was proven on the new system did we go near the next one. No big bang. No weekend where the whole product holds its breath.

## Why you want the seam even if you never switch

You might read all this and think it only pays off the day you change carriers. It does not.

The seam is worth building even if you stay on one carrier forever, because it is where you put everything that used to be scattered. Webhook signature checking lives there, done the right way for each provider. Cost normalization lives there, turning each carrier's billing into one currency-aware number. Retry logic, logging, the mapping from a carrier's twenty status strings down to your seven, all of it has one home. When a carrier quietly renames a field in their webhook, and they will, you fix it in one adapter instead of hunting through the whole codebase.

That is the real gift. Not that you can switch carriers. That the carrier stops being everywhere.

The request that made my stomach drop, switch the phone lines and keep everything else the same, is only terrifying when the carrier has grown into every corner of your system. Build the seam early, while it is cheap, and that same request becomes a config change and a coffee. The work does not disappear. You just do it once, in one place, on your own schedule, instead of a hundred times in a panic.

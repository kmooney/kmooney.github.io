---
layout: post
title: "Tetris With Microservices Pt. 2: Back to the Future"
date: 2015-07-19
categories: programming the-wrong-tool-for-the-job microservices
---

The last couple weeks have been spent working out some of the details in the very-sketchily-detailed last post, where I shared with my decision to implement a Tetris-like game with microservices.
Since I've started working on this project, I have experienced both excitement and regret at having taken on such a silly project.
Regret because why would you intentionally choose a bad tool for the job and then implement it?
Excitement because I'm starting to realize that if this works reasonably well, it will allow me to do all kinds of cool stuff.
Also, it will give me quite a lot to write about.

Since I have started, I have completed the Gameboard (though I wrote it in Go, not Ruby), a protocol guide, which I have regularly diverged from, and I have rediscovered some 1990s-era technologies that would have been really useful had they maintained their popularity, or were more usable by out-of-the-enterprise small teams.
Thus far, I believe I have wished for the following technologies from the 90's:  [CORBA](https://en.wikipedia.org/wiki/Common_Object_Request_Broker_Architecture) (or even COM would suffice), [XML](https://en.wikipedia.org/wiki/XML), and especially the [W3C XML schema format] (https://en.wikipedia.org/wiki/XML_Schema_%28W3C%29) - I will get to my reasoning a bit later, along with a few ideas about how to get some of the same functionality in the stack I have chosen.

#Gameboard
The game board, [as described here]() is the service that actually maintains state.
It keeps track of the current state of the game, determines if any changes need to occur, then notifies subscribers to that effect.

## Some design decisions

One interesting design decision is the gameboard does not persist the game state to a storage engine of any kind.
It is concievable that it may be quite easy to persist the gamestate to a document-based storage engine very easily.
In fact, the subscription mechanism may make this doable with almost no work.

I added a subscription mechanism that I believe could be used as a general purpose HTTP-based subscription mechanism.
You are allowed to use a SubscriptionResource to remotely create a subscription that associates a Game ID with a URL.
When the Game who has that ID is updated, the Game state is POSTed to all URLs that are subscribed to that Game.
Since this is go, the subscriptions are fired through goroutines.
I am not handling any errors from those routines, however the only errors that are likely to occur are
due to misconfigurations on the server that is intended to receive the post.  
Network errors are also possible, but since all of those URLs will be posted again when the next game event 
occurs, I can live with the possibility of a message not passing through for now.
If this turns out to have a major impact on later system performance, I'll go back and handle the errors.

I pared down the plan for the subscription mechanism from the original design document.  Instead of allowing users to subscribe to 
various subsets of the game state using different HTTP methods, I am simply posting the entire gamestate to the listener.
This change just makes the code much simpler to write, and if it turns out to use a lot of bandwidth, I will find some ways to 
minimize the message that is passed, perhaps through refinement.  On review, I can't think of a reason to allow the user to 
specify the HTTP method, so I'm taking that out too.

What's cool about this subscription mechanism is that it allows for different clients to subscribe to a gamestate for one or more games.  This allows
us to build, among other things, advanced logging mechanisms, a cool leaderboard, alternative game clients that could allow a user to view or even play
multiple games at once.

## Other thoughts

It occurred to me while I was working out the first module that every module should actually know the definition of each message.  Right now, I have this
defined in a very informal Protocol description document, but it would be really interesting to be able to create and maintain a schema, so we can make
changes to the messaging protocol and run some basic tests to ensure all the clients are now getting and sending correctly formed messages without
having to chase down issues that may crop up in individual microservices.

It turns out that the [W3C XML schema format (or .xsd)](https://en.wikipedia.org/wiki/XML_Schema_%28W3C%29) does exactly that!  It's funny, because I have
written code to validate my generated XML against an .xsd file before, but it never occurred to me that we should use something like that with JSON when
building a new system from the ground up.  But, of course we should!  Doing so will give us a guarantee of the integrity of our messages before they 
get lodged in the plumbing of a service that wasn't designed (or redesigned!) to take advantage of an updated message type.

It appears that there are a few different ways to deal with schemas in JSON, including a [draft proposal at json-schema.org](http://json-schema.org/).

Because there are validation libraries created for Python, Go, Ruby, Haskell and Java, this appears to be a pretty easy path to pursue to validate that our JSON messages match a shared, defined, schema.

It may be easy to create a service that validates messages against a preloaded set of schemas.

### Future Work

#XML
## XSD
## CORBA / COM

#Next Steps

---
layout: post
title: "The Wrong Tool For The Job: Tetris With Microservices"
date: 2015-06-21
categories: programming the-wrong-tool-for-the-job microservices
---

I've been thinking for a couple weeks about a series of posts called *"The Wrong Tool For The Job"* where I pick a tool that is arguably the wrong tool for a particular job, then build a proof of concept where the wrong tool is actually working to do the job.
It's supposed to be funny.
And educational.

The first tool I am going to choose is *microservices*.
I know, I know, you're thinking "microservices" aren't a tool, they are a software architecture.
Well, you're wrong.
Architectural patterns are tools just as much as a specific brand of database is.

With that out of the way, let's talk about Tetris.
In a previous post, I wrote about implementing Tetris on fewer than 100 lines of Ruby.
That was fun.
It's a small, self-contained project with few opportunities to break out specific services and APIs.
With that said, I am going to re-implement Tetris as heterogeneous microservices, running on the cheapest cloud servers I can find.
I will package each Tetris service in a Docker container and deploy it in a container.

I will also modify my < 100 LOC tetris to create a tetris client, written in Ruby, to access the services.

## What Are Microservices?

I am essentially a layperson when it comes to *microservices* (having been building sort of big monolithic web and REST-api based systems for the last 10 years) but I will share with you my (possibly incorrect) understanding.
A microservice architecture, as I understand it, is one where the functions of a larger, more monolithic, application are broken up into completley separate apps, each with an API that can be accessed via the network, or at least across the process boundary.
As an aside, this isn't an especially new way of structuring applications.
In the days before the ubiquity of HTTP-based APIs, interprocess communication and distributed systems were quite often set up to communicate either through shared memory or via IPC pipes.
I would say that a characteristic of a microservice architecture is that the API is designed with the idea that it will serve responses to requests in a relatively stateless manner.
In situations like this, the context of the request is maintained by the client either on the client side, or provided as a session-specific token.

Old fashioned distributed systems were often poorly designed because they were tightly coupled and sometimes even synchronous over the process boundary.
It's truly awesome that many of today's developers are native to the web, and so used to stateless requests and responses that a stateful async request would not even occur to most of them!
If this seems like hyperbole, I've seen this twice in my career, and I'm not that old.

## What are the specific wrong tools for this job?

![Diagram for new Tetrislike](/img/tetris-microservice/tetris-microservice-overview.png)

OK!  *So that said*, we will be using microservices to implement a Tetris.
To maximize the potential for catastrophe, I will be writing this in a heterogeneous language environment with at least one language I've never really used before.

One of the microservices will be written in Go, one in Ruby and I'll write another part of the game in Python, my go-to language.

Not that it has GOTO.

Anyways.

I'll also use docker containers to hold each component, exposing an HTTP-based API interface.
Tetris is already a pretty small program, so the microservices will be absurdly *micro*.

### Gameboard

The gameboard will store the state of the game, the score, how many lines have been completed.
It also stores the grid - the configuration of already dropped shapes.
The gameboard needs to allow for a shape, position and configuration to be submitted, and return whether or not the submitted configuration is valid.
It would be cool if we could register webhooks against the gameboard, for update when the state of a particular game changes.
The gameboard will maintain lots of simultaneous games.
Persistance should not be necessary.

### Next Shape

The next shape service will return the next shape, randomly.
This service could potentially serve arbitrary shapes, not just the commonly played tetriminos.

### Current Shape Status
This service must allow the current shape to be set.
It must allow the current shape to be moved, and disposed of.
It must also allow the current shape's content to be replaced (see the rotator below).
Shapes will be indexed by current game.

### Rotator
This service will take a shape and return a rotated copy of the shape.

### Tetrislike Client
This will connect to all of the services and present the gameboard, current shape, current game status, and next shape to the player.

### Docker 
We'll use Docker to containerize each microservice, and link the gameboard service to the other (the other services must be made aware of the gameboard) services.

### Authentication and authorization
It seems that the most popular method for securing microservices is to proxy them behind Nginx with an SSL certificate and basic http authentication.
So, that's what we'll do that too!

More and more I am finding that Nginx is the tool of choice when you want to bolt-on some baseline security to an otherwise security agnostic application.
I wonder if it makes sense to create a general purpose authenticating and authorizing proxy service?

## What would the *right* tools be?

In the case of a videogame, I would say there are lots of "right" tools, depending on how complex and advanced the game you plan.
Most likely, you could get by with a tool like [Unity](www.unity3d.com) or even simpler tools like [Gosu in Ruby](https://www.libgosu.org/) or [Pygame in Python](http://pygame.org).
Gosu and Pygame are both essentially wrappers around [SDL](https://www.libsdl.org/), though at slightly different levels of abstraction.  You can use SDL if you want to create simple games in C.

If you want to get fancy, you can look into [Unreal Engine](https://www.unrealengine.com/what-is-unreal-engine-4).
I've never used Unreal Engine, but as I understand it, you'll need to be pretty adept w/ C++ before you dive in.
Of course, you're reading about a microservice Tetris!
So you're probably already "adept."

## What's Next?

Throughout the next few posts, I expect to discuss the specifics of building each component, from concept to completion.  Here's how I plan to follow up:

  *   Development Posts
  *   Measurement and Reportage
  *   Scaling
  *   Any advantages to this approach?

Finally, this dovetails nicely with [Julython 2015](http://www.julython.org) so I'll be sharing my progress there, too.


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

With that out of the way, let's talk about Tetris.  In a previous post, I wrote about implementing Tetris on fewer than 100 lines of Ruby.  That was fun.  It's a small, self-contained project with few opportunities to break out specific services and APIs.  With that said, I am going to re-implement Tetris as Go microservices, running on a fleet of Amazon EC2 instances.  I will package each Tetris service in a Docker container and deploy it to EC2.

I will also modify my < 100 LOC tetris to create a tetris client, written in Ruby, to access the services.

## What Are Microservices?

First of all, let's get this out of the way: I have only some idea what I'm doing.
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

OK!  *So that said*, we will be using microservices to implement a Tetris.
To maximize the potential for disaster, I will be writing this in a heterogeneous language environemnt with at least one language I've never really used before.
One of the microservices will be written in Go, one in Ruby and I'll write another part of the game in Python (which should be easy).
I'll also use docker containers to hold each component, exposing an HTTP-based API interface.
Tetris is already a pretty small service, so the microservices will be absurdly *micro*.

### Gameboard
The gameboard will store the state of the game, the score, how many lines have been completed.
It also stores the grid - the configuration of already dropped shapes.  
The gameboard needs to allow for a shape, position and configuration to be submitted, and return whether or not the submitted configuration is valid.
It would be cool if we could register webhooks against the gameboard, for update when the state of a particular game changes.

### Next Shape 
The next shape service will return the next shape, randomly.

### Current Shape Status
This service must allow the current shape to be set.  It must allow the current shape to be moved, and disposed of.

## What would the *right* tools be?

In the case of a videogame, I would say there are lots of "right" tools, depending on how complex and advanced the game you plan.
Most likely, you could get by with a tool like [Unity](www.unity3d.com) or even simpler tools like [Gosu in Ruby](https://www.libgosu.org/) or [Pygame in Python](http://pygame.org).
Gosu and Pygame are both essentially wrappers around [SDL](https://www.libsdl.org/), though at slightly different levels of abstraction.  You can use SDL if you want to create simple games in C.

If you want to get fancy, you can look into [Unreal Engine](https://www.unrealengine.com/what-is-unreal-engine-4).
I've never used Unreal Engine, but as I understand it, you'll need to be pretty adept w/ C++ before you dive in.
Of course, you're reading about a microservice Tetris!
So you're probably already "adept."

## Measure and report



## Advantages of this silly approach

## 


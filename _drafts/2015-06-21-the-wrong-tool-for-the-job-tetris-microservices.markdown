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

### A Layperson's explanation

## What are the specific wrong tools for this job?

## What would the *right* tools be

## Measure and report

## Advantages of this silly approach

## 


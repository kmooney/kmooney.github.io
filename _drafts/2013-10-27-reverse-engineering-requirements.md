---
layout: post
title: "Reverse Engineering Requirements"
date: 2013-10-27 23:30:00
categories: kevn.co softwareengineering
---

Big Bang Rewrites Suck
=======================
Lately, I've been fantasizing about the big-bang rewrite.  Sometimes, one may inherit a large project that has some bugs in it.  For the original author, the bugs may have been intentional omissions or concessions made to accomodate future requirements.  I don't like to worry too much about how a system got to where it is.  I'm only concerned with making it work profitably and effectively for our customers and our business.

However, it can be very interesting to consider the big-bang rewrite.  I know that there are a lot of pitfalls inherent in a rewrite:  you don't have the resources to support the existing system and also build a new system, your future crew won't build the new system perfectly either, and your future crew doesn't even know what the sofware should do.  Like it or not, **the requirement for any rewrite *is* the current behavior of the system.**

Maybe you think that you will never rewrite your system.  You don't have a future crew.  That's fine.  Have you noticed that it's takes months to onboard new team members?  Even when they understand your stack? Have you noticed that you can't bring in a QA team without an enormous effort and learning curve?  It turns out, not having requirements sucks.  

So you have two choices: sit around the water cooler and kvetch about how "it sucks," or get out there and document the requirements.  

A Note About Requirements
==========================

The thing about software requiremnets is that they are metaphysical.  They are real and immutable, but they are beyond the senses.  We can only discover them through careful consideration.  They seem to change as we discover more about them, but this is not change; it is merely further discovery of what already exists.  They are like mathemetical theorems.  Theorems don't change, even when they haven't been discovered yet.

All software has requirements whether your team wrote them down or not.  "Requirement" is just another word for "need," and your software wouldn't get written unless it needed to get written.  So your challenge, with limited artifacts available, is to figure out what your customers needs were before your system existed.  If you are planning to do a rewrite, you must also understand that the requirements for a new system include not just the original system needs, but the expected behavoir that your customers have evolved after months or years of running your system.

So, how do you figure out the current behavior of the system?  How do you separate the "correct" system behavior from the "incorrect" behavior?  After all, you wouldn't be considering a rewrite, unless you were trying to fix some bugs or make it easier to add new, ostensibly correct, features.

It's easy if the original system had documented requirements that matched up perfectly with the implementation of the system.  If you have inherited a  system where, when a defect was discovered, the requirements, specifications, code and test plan were all updated to reflected the corrected defect, then you should stop reading now and get back to work!  The only thing standing between you and success is faster typing!  

For the other 99% of you who don't live in a perfect world, you've got to figure out what the hell your system does, and worse, figure out what it is supposed to do!  Even worse then that, the only artifacts you have are the finished system, and (if you're lucky) some source code.

Break It Down
==============

Work Through the System 
=========================

Read the Code
==============

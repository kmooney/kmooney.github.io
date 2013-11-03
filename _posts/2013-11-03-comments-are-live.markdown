---
layout: post
showcomments: true
title: Comments are live!
image: /img/site-structure.png
---

Hurray! Comments are live.  Here's the simple version of what I did:

-  We wrote a tornado app to act as a WebSocket server.  It takes comments from the website, stashes them in redis, then rebroadcasts to everyone who is listening.
-  We wrote an angular application that runs the comments, clientside.  We hash the URL (as a channel), hash the email address (it is never stored), then transmit your lovely discourse to the chat server.
-  The client-side application also hashes your email, so your address is never transmitted to the server, and display of your address to anyone else is impossible.
-  Chat server sticks a time and date stamp on your comment, stuffs it in redis, and rebroadcasts.
-  Spend <del>lots of</del> a little time tweaking the css and js to make it work nice and look sort of pretty.

Right now, the DNS records for the chat server are propagating.  The server probably has memory leaks.  A quick peak at my DO shows it taking about 1% of the memory right now. Which seems... wrong.  The whole server is running under a supervisor process, so if something goes wrong, it ought to just restart, but we all know how those things go.  Until all the kinks are worked out, we may have to periodically kick it.

A quick review of my redis config shows that messages should be stored persistently.  A quick google showed me the details about redis persistence.  I think it will be sufficient for this project, but for a real-world application I will need to actually understand what I'm doing.  

Some other neat features - this server ought to work for anyone who wants to write a Web Socket client to connect to it.  Hopefully, I will be able to build a drop-in javascript snippet to show a comment / chat section similar to how the one on posts on this site work.  I am curious to see how this stands up to load, though there are no visitors on this site at this time....

Anyways, I will break down the componenets in future posts.

Bug alert!  I just realized that comments leak between the rooms since it broadcasts to all listeners, not just other listeners on the current URLHash.  

I fix it soon.

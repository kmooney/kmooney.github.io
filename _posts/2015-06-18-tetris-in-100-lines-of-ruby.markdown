---
title: Learning Ruby by Writing Tetris in Fewer Than 100 LOC
layout: post
date: 2015-06-18
categories: programming ruby tetris
showcomments: false
---

I was messing around with Ruby, which is a much better language then I ever gave it credit for!
My excuse is that, as a Python programmer, I already knew a language that filled Ruby's niche just fine.
If I was going to learn another language, it should either be lower level like Go or a different paradigm altogether, like Haskell or Scala.

Last year and this year I've pretty much crossed Scala and Haskell off the list, and I'm procrastinating about Go, so it's time to dig deep into Ruby.
While looking around for some little projects to do, I decided that I did not want to make a *todo list*, and I remembered a bet I lost many years ago.
I bet my pal that he couldn't write a Tetris in fewer than 100 lines of Python.

I think he brought it in at around 70 LOC...

...but, if I recall, it also did not have perfect collision detection.

## Game Rules

Anyways!  I decided to write <strike>Tetris</strike> a tetris-like in 100 lines of code.  I had a few rules for the game:

1. All of the pieces should be represented as in the original Tetris.
2. The game should have perfect collision detection - don't jam a piece into another one.
3. If possible, the game should show the next piece.
   My experience playing [Spectrum Holobyte Tetris on a PC](https://www.youtube.com/watch?v=z7IShUS105Q) in 1989 was that the next piece was never shown, and I hated that!
4. When you drop the piece, it should move toward the floor more quickly, but not 'teleport' to the bottom of the screen.
   This is how Gameboy and NES Tetris worked and it was a much better gameplay experience than the PC.
5. You should get a grace period when the piece hits the ground.
   That's a short period of time where you can still rotate or slide the piece into a tight spot.

## Code Ground Rules

And some ground rules for writing the code:

1. Try to make the code readable.
   Since I am trying to squeeze as much functionality as possible into 100 LOC, I wanted to be sure I didn't have any lines that were just white-space.
   I'll argue that this isn't obfuscation, since each line is still intended to be read and understood.
   Even though I would never write production code like that, it seemed a fine concession for this challenge.
2. Multiple variable declarations on a single line are allowed.
   I think I would be OK with this in production, too - Ruby makes it easy to understand what's going on with multiple declarations on a single line.
3. Each logical line of code (that is not a declaration) should be on its own line.  It would be cheating just to stick everything on a single line of code.
4. External libraries (barring a "Tetris" library) are allowed.

I also moved the braces to close code-blocks onto the last line of the block.  I couldn't bear to look at a line with just a brace on it.

All in all, I'm pretty pleased with the result:

![Tetris animated gif](/img/testris/tetris-in-100-loc.gif)

## Interesting Problems

### Piece Representation and Rotation

One interesting problem was how to represent the pieces in-game.
I didn't want to make a bunch of 2D Arrays, mostly because it would have been pretty hard to make a readable matrix and keep the line-count low.
Instead, what I decided to to was represent each piece as an array of integers - if I was more concerned about space, I could have shifted the bits for each piece into a single integer.
In this case, my metrics for success are line-count and readability, so I decided not to do that.
I was also concerned that unpacking the integers may cost me too many precious lines of code!

When I was done iterating on this, I had an Array of Integers - the first number was the color of the piece, the second was the width of the piece, and the remainder of the Array were 'bits' to represent whether or not to render part of the [tetrimino](https://en.wikipedia.org/wiki/Tetromino):

For instance, a T-shaped piece would be represented by the following Array:

    [7,   # The color of the piece
     2,   # The initial width of the piece
     1,   # The shape data starts here...
     0,
     1,
     1,
     1,
     0]   # ... and ends here.

So a vertically oriented T-shaped block with the flat part facing right would be represented by `101110` with a width *w=2*.  

![Illustration of mapping from bits to block](/img/testris/bits-to-block.png)

When you rotate that block clockwise, the shape is now represented by `111010` with a width of *w=3*.

![Illustration of mapping from bits to block, rotated](/img/testris/bits-to-block-rotated.png)

After a bit of experimentation, it turns out there's a pretty simple and fast function to figure out how to map from one set of bits to another:

    f(i) = w * (r - i % r - 1) + 1 / r

This is when *w* is the width of the shape, *r* is the height of (or number of rows in) the shape, and *i* is the index of the bit.
Using this neat little equation, we can figure out the new shape configuration in just one line of code:

    @shape_config = @shape_config.each_with_index.map{|__, i| @shape_config[@width * (r - i % r - 1) + i / r]}

### Testing whether a move is allowed

When you move to the left or right or rotate a piece, you need to be sure that you're not going to end up with the shape overlapping pieces that are already placed.
You also don't want the piece to go off the edge of the screen.

The simplest way (that I could think of) to test is to copy the piece, make the move, then check that the copied piece doesn't overlap with anything placed on the gameboard or go off the edge.
If the check passes, then perform the move on the current shape.
Each "move" function returns whether the move was valid, so the way I ensure only valid moves are made is like so:

    @current.rotate_ccw @grid if id == Gosu::KbQ and check.rotate_ccw @grid

... where the `check` variable is a copy of the `@current` shape.

### Eliminating completed rows

Ruby's built-in iterators make it surprisingly easy to eliminate completed rows:

    @grid.delete(Array.new(BOARD_WIDTH){1})
    (0...BOARD_HEIGHT - @grid.length).each { @grid.unshift(Array.new(BOARD_WIDTH){0}) }

[If you're interested, you can see the code in Github.](http://github.com/kmooney/testris.git)

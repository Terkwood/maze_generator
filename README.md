# maze\_generator

**maze\_generator** is a module for easily generating mazes.

This is all very much work-in-progress, however feedback is welcome.

Almost everything is subject to change so this is all very unstable

## Example Usage

```javascript

import {Maze} from "https://deno.land/x/maze_generator/MazeClasses.js"

let mazeSettings = {
  width: 12,
  height: 12,
  algorithm: "recursive backtracker"
}

//initialize the maze
let m = Maze.create(mazeSettings);

//generate it
m.generate();


console.log(JSON.stringify(m));

```

# #   M a z e   S e t t i n g s   ( o b j e c t ) 



|   P r o p e r t y   |   D e s c r i p t i o n   |   V a l i d   V a l u e s   |   D e f a u l t   V a l u e   | 

| - | - | - | - | 

|   w i d t h   ( o r   x S i z e )   |   T h e   w i d t h   o f   t h e   m a z e .   ( H o w   m a n y   c o l u m n s  t h e r e   s h o u l d   b e . )   |   A n y   i n t e g e r   g r e a t e r   t h a n   0 .   A n y   n u m b e r  g r e a t e r   t h a n   1 0 0   d e f a u l t s   t o   1 0 0 .     |   ` 3 0 `   | 

|   h e i g h t   ( o r   y S i z e )   |   T h e   h e i g h t   o f   t h e   m a z e .   ( H o w   m a n y   r o w s  t h e r e   s h o u l d   b e . )   |   A n y   i n t e g e r   g r e a t e r   t h a n   0 .   A n y   n u m b e r  g r e a t e r   t h a n   1 0 0   d e f a u l t s   t o   1 0 0 .   |   ` 3 0 `   | 

|   a l g o r i t h m   |   T h e   a l g o r i t h m   t o   u s e .   |   A n y   o n e   o f   t h e   f o l l o w i n g :  ` " r e c u r s i v e   b a c k t r a c k e r " ` ,   ` " e l l e r s " ` ,   ` " s i d e w i n d e r " ` ,  ` " k r u s k a l s " ` .   T h i s   i s n ' t   c a s e   s e n s i t i v e .   C h a r a c t e r s   o t h e r   t h a n  a - z   a r e   i g n o r e d   ( s o   y o u   c a n   a d d   a p o s t r o p h e s   i f   y o u   l i k e ) .   |  ` " r e c u r s i v e   b a c k t r a c k e r " `   | 

|   s e e d   |   * * N o t   c u r r e n t l y   w o r k i n g . * *   T h i s   i s   t h e   s e e d   f o r   t h e  r a n d o m   n u m b e r   g e n e r a t o r .   |   A n y   n u m b e r .   |   A   r a n d o m   i n t e g e r   f r o m   0  t o   1 0 ^ 8 .   | 


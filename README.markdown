# jsynth-script-node

14:03 < mikolalysenko> you should try to understand how this function works:  
                       http://en.wikipedia.org/wiki/Atan2
14:03 < jjjjohnn1y> because which way am i going?
14:04 < jjjjohnn1y> thanks will do
14:04 < mikolalysenko> basically atan2 handles all the tricky cases for you
14:05 < jjjjohnn1y> sweet
14:06 < mikolalysenko> for example, say you want to figure out how much you turn along two points
14:06 < mikolalysenko> let cx, cy be the center
14:06 < mikolalysenko> and x0,y0 / x1,y1 be the coordinates of your two points
14:06 < mikolalysenko> then your turning amount is just:
14:06 < mikolalysenko> Math.atan2(x1-cx, y1-cy) - Math.atan2(x0-cx, y1-cy)
14:06 < mikolalysenko> that's it
14:07 < jjjjohnn1y> ooo
14:07 < mikolalysenko> (up to some constant factor of n * 2 * pi)
14:07 < jjjjohnn1y> what does that mean in terms of spinning a continuous dial w/ ones finger?
14:08 < mikolalysenko> spin_angle += Math.atan2(x1-cx, y1-cy) - Math.atan2(x0-cx, y1-cy)
14:08 < mikolalysenko> that's all you need
14:08 < mikolalysenko> err that should be a y0 at the end
14:08 < mikolalysenko> spin_angle += Math.atan2(x1-cx, y1-cy) - Math.atan2(x0-cx, y0-cy)
14:08 < mikolalysenko> but you get the idea
14:09 < mikolalysenko> you can also do this stuff with complex number too
14:09 < mikolalysenko> it amounts to the same thing
14:09 < mikolalysenko> like suppose your coordinates were x0, y0 for the first and x1, y1 for the second
14:09 < mikolalysenko> then your spin can be represented by a complex number that is:
14:10 < mikolalysenko> (x0 + y0 * i) * (x1 - y1 * i)
14:10 < mikolalysenko> if you normalize that it will give you the turning amount
14:10 < jjjjohnn1y> *eeks*
14:10 < mikolalysenko> (ie just project to unit length)
14:10 < jjjjohnn1y> how do i?
14:10 -!- defunctzombie_zz is now known as defunctzombie
14:11 < mikolalysenko> basically, you would encode your spin amount as a complex number using euler's formula
14:11 < mikolalysenko> ie set it equal to:  spin = e^(i * theta)
14:11 < mikolalysenko> so you have to parts:
14:11 < mikolalysenko> spinx + spiny * i = cos(theta) + i * sin(theta)
14:11 < mikolalysenko> and then update it using the rule:
14:11 < mikolalysenko> spin *= (x0 + y0 * i) * (x1 - y1 * i)
14:12 < mikolalysenko> and be sure to normalize it when you are done
14:12 < mikolalysenko> you will get a degeneracy of the rhs of that is 0, so be careful
14:12 < mikolalysenko> to recover the spin as an angle, you can just take atan2(spiny, spinx)
14:13 < jjjjohnn1y> what do I gain using this more complex method?
14:13 < mikolalysenko> faster and more robust
14:13 -!- shuaib [~shuaib@unaffiliated/shuaib] has quit [Quit: Textual IRC Client: http://www.textualapp.com/]
14:13 < mikolalysenko> you don't have to worry about the degeneracy due to the angle flipping or anything
14:13 < jjjjohnn1y> b/c I don't understand part one, two, or the gestalt
14:13 < mikolalysenko> atan2 would also work, but that requires trig functions
14:14 < mikolalysenko> this might help understand it:  http://en.wikipedia.org/wiki/Complex_number#Polar_form
14:14 < jjjjohnn1y> what is theta?
14:14 < mikolalysenko> theta is the angle that the mouse is turning
14:14 < jjjjohnn1y> and how do i determine that
14:14 -!- jamiejam [~jamiesche@nat-07-mht.dyndns.com] has quit [Remote host closed the connection]
14:15 < mikolalysenko> compute the difference in the angles from its previous position to the next position
14:15 < mikolalysenko> where the angle is that of the right triangle formed by having its base at the spinner 
                       center
14:15 < mikolalysenko> and has the axis projected along the x-axis of the coordinate system
14:15 -!- timoxley [~timoxley@119.56.6.3] has quit [Quit: Computer has gone to sleep.]
14:15 < mikolalysenko> you should really read this wiki page:  
                       http://en.wikipedia.org/wiki/Complex_number#Polar_form
14:16 < mikolalysenko> it basically shows you can interpret atan2 as a complex logarithm
14:16 < jjjjohnn1y> and then what if there is no center?
14:16 < mikolalysenko> then you can use a relative coordinate system
14:17 < mikolalysenko> so suppose you had 3 points, x0,y0; x1,y1; x2,y2
14:17 < mikolalysenko> you could move by the amount the vector turns
14:17 < mikolalysenko> which is just:
14:17 < mikolalysenko> Math.atan2(y2-y1, x2-x1) - Math.atan2(y1-y0, x1-x0)
14:18 < mikolalysenko> or in complex nubmers:
14:18 < mikolalysenko> (p2 - p1) / (p1 - p0)
14:18 < mikolalysenko> where pi = xi + yi * i
14:19 < mikolalysenko> if you take the imaginary part of log of the complex expression you get the atan2 form
14:19 < mikolalysenko> this is just euler's formula in reverse
14:19 < mikolalysenko> http://en.wikipedia.org/wiki/Euler's_formula
14:19 < mikolalysenko> ^^^ that is the fundamental theorem of trigonometry
14:19 < jjjjohnn1y> is that p*i = x*i + y*i + i, or did you stack the variable i
14:20 < mikolalysenko> oh, no I meant use the i as an index
14:20 < mikolalysenko> how about:
14:20 < jjjjohnn1y> thats what i thought :p
14:20 < mikolalysenko> p[k] = x[k] + y[k] * i
14:20 < jjjjohnn1y> how do i in javascript?
14:20 < mikolalysenko> you write out complex multiplication as a function
14:20 < jjjjohnn1y> Math.i?
14:20 < mikolalysenko> no
14:21 < mikolalysenko> you represent the numbers as pairs, say arrays or objects or whatever
14:21 < mikolalysenko> and use the fact that:
14:21 < mikolalysenko> (a + b * i) * (c + d * i) =  a*c - b*d + (a*d + b*c) * i
14:21 < mikolalysenko> there is a trickier way to do this which is a bit faster:
14:21 < mikolalysenko> http://en.wikipedia.org/wiki/Multiplication_algorithm#Gauss.27s_complex_multiplication_algorithm
14:22 < jjjjohnn1y> this is how I determine what i is?
14:22 < mikolalysenko> just think of these things as vectors
14:22 < mikolalysenko> split them into components
14:22 < mikolalysenko> you have a real part and an imaginary part
14:22 < mikolalysenko> and you represent each component separately
14:22 < substack> dominictarr: ward cunningham just said "duplex stream" and had a.pipe(b).pipe(a) on his 
                  slide
14:23 < dominictarr> very good
14:23 < dominictarr> at nodepdx?
14:23 < substack> yep
14:23 < jjjjohnn1y> mikolalysenko: that is how i determine what i is?
14:23 < substack> also I realized that voxeljs is basically ractive mode in the young lady's illustrated 
                  primer
14:23 < dominictarr> this guy? http://en.wikipedia.org/wiki/Ward_Cunningham
14:23 < substack> the very same
14:24 < substack> he uses browserify and everything
14:24 < jjjjohnn1y> i was really hoping that would come for free 
14:24 < jjjjohnn1y> in terms of writing algorithms
14:24 < dominictarr> haha, awesome!
14:24 < mikolalysenko> jjjjohnn1y: i = sqrt(-1)
14:24 < mikolalysenko> everyone should use browserify!  it rocks
14:24 < mikolalysenko> (though that is not a controversial opinion here)
14:25 < substack> mikolalysenko: absolutely watch max's voxeljs talk when the video goes online
14:25 < substack> if you didn't catch the live stream
14:25 < mikolalysenko> substack: will do.  when is it going to be posted?
14:26 < chrisdickinson> awesome :D
14:27 < jjjjohnn1y> mikolalysenko: thanks. i took notes and will use this when I'm back optimizing that part 
                    of the pig
14:27 < mikolalysenko> jjjjohnn1y: yeah, though you should also learn this stuff for its own sake
14:28 < mikolalysenko> complex numbers show up all over the place in trigonometry and are also important for 
                       understanding signal processing
14:28 < jjjjohnn1y> it'll come to me
14:28 < mikolalysenko> if you can find it, the first chapter of visual complex analysis by tristan needham is 
                       pretty good at explaining all this stuff
14:28 < mikolalysenko> http://usf.usfca.edu/vca//


### The Game Project 5 – Making a complete level

#### Week 7

Download the Game Project 5 [template](https://www.doc.gold.ac.uk/tutorials/thegameproject/gp5.zip).

1. Inspect the code.

2. Add your front-facing game character to the sketch using the
	`drawGameChar` function. As previously, use the `gameChar_x` and
	`gameChar_y` variables to control the position of the character on
	the canvas.
	- Add your character drawing code within the `drawGameChar`
		function. This function is called within the `draw` function to
		update the character on the canvas each frame.
	- Check your character moves left and right when the corresponding
		keys are pressed.

3. Add all other character animation code within the `drawGameChar`
	function. You need to included all animations from Game Project 3.
	- Hint: the drawing of each animation needs to be controlled by a
		separate condition using a series of `if`, `else if`, and `else`
		statements.
	- Check your character can:
			- face forward
			- turn left
			- turn right
			- jump/fall facing forward
			- jump left
			- jump right

[2 marks]

3. Add all arrays of scenery objects from Game Project 4 to this
	sketch. You will need to declare a global variable for each array
	(`clouds`, `mountains`, `trees`, `houseXs`) and initialise each
	array of objects within `setup`.

4. Next draw the scenery objects, but unlike the previous project we
	will now use functions to draw each kind of scenery item. First
	copy your clouds drawing `for` loop from the previous project into
	the `drawClouds` function. This function does not take any
	arguments, but when called it will draw all of your cloud objects
	to the canvas.

5. Within the `draw` function call your new `drawClouds` function.
	- Hint: to call a function, even if it does not require any
		arguments, you must include parentheses: `drawClouds()`.
	- Check that your clouds are drawn correctly to the canvas. At the
		moment your clouds will not have the scrolling feature.

6. To add scrolling you need to call the `drawClouds` function within
	`push`/`pop` statements and use the `translate` function. Call
	`push` and `translate` *before* `drawClouds`, and `pop`
	*after*. Pass to `translate` the arguments that you used to
	simulate parallax from Game Project 4.
	- Test that your clouds scroll when your game character moves to
		the edges of the screen.

[2 marks]

6. Now add mountains, trees and houses in the same was as you just
	added clouds by creating a function for each kind of item. Call
	each function within `draw` using `push`, `pop` and `translate` to
	add scrolling and simulate parallax.
	- Test that each of your scenery items scroll in a naturalistic
		way, creating a sense of perspective when the character moves
		towards the left and right edges of the canvas.

[2 marks]

7. Add the canyon variable and object from game project 3.
	- Your object should describe position and width

8. Draw the canyon using the `drawCanyon` function.
	- Copy the canyon drawing code from Game Project 3 and place it
		inside `drawCanyon`.
	- replace the `canyon` variable with `t_canyon`. This will use the
		the argument from your function
	- Call your new function within `draw` passing your canyon as an argument
	- Use `push`, `pop` and `translate` to make sure your canyon scrolls correctly.
	- Check that your canyon appears at the correct locations within
		the game, and scrolls correctly when the play approaches the
		edges of the canvas.

9. Test if your character is in the canyon using `checkCanyon`.
		- Copy and paste the code which does this from Game Project 3
		into `checkCanyon`
		- As above replace the `canyon` variable with `t_canyon` to use
		your argument.
		- Replace `gameChar_x` with `realPos` to test your character’s real position
			within the game world. This becomes important when the view scrolls.
		- Check that when you character walks into the canyon they begin
			to fall.

[2 marks]

7. Add the pickupable object from game project 3.
- Hint: the pickup object should look something like this:
		`{x_pos: 100, y_pos: 100, size: 50, isFound: false}`

11. Draw your pickup item using a function.
	- Define a new function called `drawPickup` (or something more
		descriptive like `drawJewel` or `drawCoin` depending on what kind
		of item your are using).
	- Your function should have one argument for the jewel/coin. (eg. `t_jewel`)
	- Copy your item drawing code from Game Project 3 and place it
		inside your new function.
	- Replace the variable name in the code with your new argument name.
		(eg. replace jewel with t_jewel )
	- Call your new function within `draw`
		HINT: you will need to pass your jewel/coin as a parameter.
		(eg. `drawJewel(jewel);`
	- Use `push`, `pop` and `translate` to make sure your item scrolls correctly.
	- Check that your item appears at the correct locations within the
		game and scrolls correctly when your character approaches the
		edges of the canvas.

12. Add another function (e.g. `checkPickup`) to test if your
		character’s location coincides with that of the pickup item.
	- Use your `if` statement from Game Project 3 to test if your
		character collides with the item.
	- Your function should have one argument for the jewel/coin. (eg. `t_jewel`)
	- Use `realPos` instead of gameChar_x to test your character’s real position
		within the game world.
	- Check that when you character walks into the item it disappears
		from the canvas.

[2 marks]

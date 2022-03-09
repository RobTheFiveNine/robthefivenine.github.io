---
layout: post
title: Creating an Eye Blinking Effect in Godot
date: 2020-06-27
thumbnail: cover.png
tags:
  - animation
  - game-dev
  - godot
---

I've been prototyping a new game as a means of testing a few things out in Godot and wanted to add a blinking animation to a cat I had drawn. As the sprite is really simple and flat looking, my initial idea was to have some kind of circular shape that just filled with a colour to give the illusion of eye lids covering the top of the eyes (as can be seen below in the final result):

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path blink.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>

The problems I faced with this were:

- There didn't seem to be an easy way to draw a well rounded ellipse (like when creating collission shapes)
- I couldn't create a "stretchable" sprite due to the shape of the eyes

My solution was to create a new sprite for each eye and then animate the `Region` properties. One of the sprites can be found below, if you want to follow along:

{% asset_img LeftEyeLid.png %}

If you create a new `Sprite` node in Godot and head over to the inspector tab, you will see there is a `Region` group. The settings within this group will allow you to change the region of a sprite that is drawn to screen.

For example, if after enabling the `Region` properties we set the `region_rect` height property to `40` (roughly half of the height of the sprite), we can see that Godot now only renders the top half of the sprite:

{% asset_img region_example.png %}

After finding this, it was clear this would help me achieve exactly what I wanted. However, animating just the height property alone was not enough, as everytime the height property is changed, the sprite will move to ensure it is still centered like this:

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path center_problem.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>

My initial solution to the centering issue was to animate the `Offset` property in the opposing direction, however, whilst writing this post, I realised that there is a much simpler solution - within the `Offset` properties, there is a `Centered` property. Disable this, and the anchor point of the sprite will be the top left corner.

Now, when we animate the `region_rect.h` property, the top of the sprite will remain in a fixed position, whilst the bottom side of the region will change:

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path uncentered.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>

With the sprite properly configured, creating the animation was as simple as adding a track in an `AnimationPlayer` for the `region_rect` property, ensuring the height value starts at `0`, at the mid point is at full height (I altered this to `60` as I changed the `y` offset slightly), and then ends on the last key frame at `0` again:

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path working-eyelid.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>

After repeating this process for both eye lids, and positioning appropriately in front of the cat sprite, the eyes now blink!

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path blink.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>
---
layout: post
title: Visualising RayCasts in Godot
date: 2020-08-09 00:00:00
thumbnail: cover.png
tags:
  - game-dev
  - godot
  - programming
---
I began creating a new game this week and today needed to create an on screen visualisation of where the user is aiming. To do this, I wanted to be able to draw a line that would start at the origin of a `RayCast` and end where it collides with another body (to stop a line being indefinitely drawn through the level's geometry).

I could find several examples of how to do this in 2D space, but as I am building a 3D game, the methods shown would not work. Eventually, I came across the [ImmediateGeometry](https://docs.godotengine.org/en/stable/classes/class_immediategeometry.html#class-immediategeometry) class, which allowed me to achieve exactly what I wanted to.

An example of how the final product looks can be found below. The line extruding from the rotating arrow is a visual representation of the `RayCast` and ends at each object that it collides with.

<video width="100%" muted autoplay playsinline loop>
  <source src="{% asset_path raycast-line.mp4 %}" type="video/mp4" />
  Your browser does not support the video tag.
</video>

The node tree for this example looks like this:

{% asset_img node-tree.png %}

There's not much special going on here, but for completeness sake, the purpose of each node is as follows:

- The `Arrow` node is a `Spatial` which contains the arrow mesh and also contains the `RayCast` that will be visualised.
- The `ImmediateGeometry` node is what will be used to "draw" the visualisation
- The `Shapes` spatial contains the various meshes that are setup with collision enabled that are placed around the scene

The script attached to the root node is:

```gdscript
extends Spatial

onready var arrow = $Arrow
onready var raycast = $Arrow/RayCast
onready var line = $ImmediateGeometry

func _process(delta):
    arrow.rotate_y(delta * 1.5)
    line.clear()

    if raycast.is_colliding():
        line.begin(Mesh.PRIMITIVE_LINE_STRIP)
        line.add_vertex(to_local(raycast.global_transform.origin))
        line.add_vertex(to_local(raycast.get_collision_point()))
        line.end()
```

First, [ImmediateGeometry->clear](https://docs.godotengine.org/en/stable/classes/class_immediategeometry.html#class-immediategeometry-method-clear) is called, which will remove everything that was previously drawn.

Next, if `RayCast` has collided with another body, [ImmediateGeometry->begin](https://docs.godotengine.org/en/stable/classes/class_immediategeometry.html#class-immediategeometry-method-begin) is called with the `PRIMITIVE_LINE_STRIP` constant, which will ensure that the specified vertexes will be rendered as a line strip (see [Mesh::PrimitiveType](https://docs.godotengine.org/en/stable/classes/class_mesh.html#enum-mesh-primitivetype) for more options).

Now that the `ImmediateGeometry` node is ready to begin creating the mesh, two calls are made to [ImmediateGeometry->add_vertex](https://docs.godotengine.org/en/stable/classes/class_immediategeometry.html#class-immediategeometry-method-add-vertex), the first being the starting point (i.e. the origin of `RayCast`) and the second being the point where `RayCast` detected a collision.

An important thing to note about plotting the positions, is that they need to be in local space. All classes that extend `Spatial` have a `to_local` method available to them, which will take a global coordinate and translate it to a local one. For this reason, rather than accessing `raycast.transform.origin`, I use the global transform instead. Likewise, the `Vector3` returned from `raycast.get_collision_point` is in the global coordinate system, and needs to be converted to local.

Finally, calling [ImmediateGeometry->clear](https://docs.godotengine.org/en/stable/classes/class_immediategeometry.html#class-immediategeometry-method-end) will finish the rendering and draw the line on the screen.

You can grab a copy of the sample project at [RobTheFiveNine/godot-raytrace-visualisation-example](https://github.com/RobTheFiveNine/godot-raytrace-visualisation-example).
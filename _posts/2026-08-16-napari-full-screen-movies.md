---
title: Pixel perfect borderless animations in Napari
description: How to record animations without borders and with proper scaling in Napari
author: Tamas Nagy
layout: post
tags: napari
thumbnail: assets/img/2026-08-16-napari-full-screen-movies/screenshot.png
date: 2026-08-16 10:38:00
---

I've been trying to switch more of my image analysis workflow to [Napari](https://napari.org) 
since my large imaging datasets are a bit much for ImageJ/FIJI. One thing that
was missing from my Napari pipeline was a way to easily generate compressed
`.mp4`s of my movies for my slide decks. I came across the 
[Napari animation plugin](https://napari.org/napari-animation/), but I couldn't
find a way to export a pixel-perfect rendering of my movies without any black 
borders. 

A lot of my movies ended up pretty low resolution with black borders that 
require careful window resizing to minimize:

<div style="max-width: 400px; margin: 0 auto;">
    {% include video.liquid path="assets/video/2026-08-16-napari-full-screen-movies/borders.mp4" class="img-fluid rounded z-depth-1" controls=false autoplay=true loop=true playsinline=true muted=true %}
</div>

After some try and error, I hacked up the following function that should work
in most cases (high-DPI displays and scaled axes supported). Running this
function should rescale the window to match your movie for pixel-perfect 
export.

```python
from qtpy.QtCore import QSize, Qt
from qtpy.QtWidgets import QDockWidget

def resize_canvas_to_image(viewer):
    """
    Resize the Napari window so the VisPy canvas exactly matches the layer size.
    """
    h, w = viewer.layers[0].data.shape[-2:]

    qt_window = viewer.window._qt_window
    canvas = viewer.window._qt_viewer.canvas.native

    # switch to frameless window to expand past display
    qt_window.setWindowFlag(Qt.WindowType.FramelessWindowHint)
    qt_window.setMinimumSize(500,500)
    qt_window.show()

    # high-DPI displays
    dpr = canvas.devicePixelRatioF()

    window_size = qt_window.size()
    canvas_size = canvas.size()

    # Physical size in world coordinates
    scale_y, scale_x = viewer.layers[0].scale[-2:]

    # Amount of window occupied by non-canvas widgets
    extra_w = window_size.width()  - canvas_size.width()
    extra_h = window_size.height() - canvas_size.height()

    # Resize the entire window
    qt_window.resize(
        QSize(
            int(round(w / dpr)) + extra_w,
            int(round(h / dpr)) + extra_h,
        )
    )

    # Resize canvas
    viewer.camera.zoom = 1/dpr/scale_x
    viewer.camera.center = (0.0, (h * scale_y)/dpr, (w * scale_x)/dpr)

    return window_size, canvas_size
```

I wrote some helper functions that hide and show all the widgets so that Napari
can go full screen and back:

```python
    def hide_widgets(viewer):
        win = viewer.window
        win._qt_viewer.dockLayerControls.hide()
        win._qt_viewer.dockLayerList.hide()
        win._qt_viewer.dockConsole.hide()
        win._qt_viewer.dims.hide()
        win._qt_window.menuBar().hide()
        win._qt_window.statusBar().hide()

        for dock in win._qt_window.findChildren(QDockWidget):
            if "animation" in dock.windowTitle() or "Timestamper" in dock.windowTitle():
                dock.hide()

    def show_widgets(viewer):
        win = viewer.window
        win._qt_viewer.dockLayerControls.show()
        win._qt_viewer.dockLayerList.show()
        win._qt_viewer.dims.show()
        win._qt_window.menuBar().show()
        win._qt_window.statusBar().show()

        for dock in win._qt_window.findChildren(QDockWidget):
            if "animation" in dock.windowTitle():
                dock.show()
```

So in complete script, you can run it as so:

```python
import napari
import dask.array as da
import zarr
from napari_animation import Animation

# load a .zarr movie
z = zarr.open("timelapse.zarr", mode="r")
darr = da.from_zarr(z["25"]["0"])

# open the movie in napari
v = napari.Viewer()
v.add_image(darr[:, 0, :, :], name="TRITC", scale = [300.0, 0.22898, 0.22898], units = ('s', 'um', 'um'))
v.add_image(darr[:, 1, :, :], name="BF" , scale = [300.0, 0.22898, 0.22898], blending = "additive", units = ('s', 'um', 'um'))
v.layers["TRITC"].colormap = "bop orange"

hide_widgets(viewer)
resize_canvas_to_image(viewer)

# animate
animation = Animation(v)
v.dims.set_point(-3, 0) # set to first frame
animation.capture_keyframe()
v.dims.set_point(-3, 719*300) # set to last frame
animation.capture_keyframe(steps = 240) # change steps to change length
animation.animate('pos29.mp4', canvas_only = True, fps = 20) # save

# reset to framed window
viewer.window._qt_window.setWindowFlags(Qt.WindowType.Window)
viewer.window._qt_window.show()
show_widgets(viewer)
```

This should create a full-screen pixel-perfect movie in your current folder:

{% include video.liquid path="assets/video/2026-08-16-napari-full-screen-movies/r5.mp4" class="img-fluid rounded z-depth-1" controls=false autoplay=true loop=true playsinline=true muted=true %}

Pretty nice, right?
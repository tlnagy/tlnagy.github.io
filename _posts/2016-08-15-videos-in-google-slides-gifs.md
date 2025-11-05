---
title: "Embedding videos in Google Slides as GIFs"
author: Tamas Nagy
layout: post
tags: [science, productivity]
date: 2016-08-15 12:00:00
---

In my field, systems biology, it's pretty common to take time-lapse movies
to get the dynamics of how the system behaves. And we like showing them
off. This makes Google Slides[^1] inability to embed videos (without
uploading them to Youtube) pretty annoying and inconvenient. Slides does,
on the other hand, have good support for embedding GIFs. I came up with
the following pipeline (based on notedible's comment on
[Stackoverflow](https://superuser.com/questions/556029/how-do-i-convert-a-video-to-gif-using-ffmpeg-with-reasonable-quality)).
First, make sure to install `libav` and `imagemagick`. On Debian-based
systems, you can run 

```
sudo apt-get install libav-tools imagemagick
```

and on MacOS[^2] the easiest way to install them is via
[homebrew](http://brew.sh). Then I use the following command to create the GIF:

```
cat some_movie.m4v | avconv -i pipe: -r 10 -f image2pipe -vcodec ppm - | convert -delay 5 -loop 0 - gif:- | convert -layers Optimize - output.gif
```

where `some_movie.m4v` is the video file. This creates an optimized GIF
version called `output.gif`, which you can then upload to Google Slides.
The last niggle is that the GIFs play continuously and sometimes it's
helpful to be able to stop/start the playback. Enter the [Toggle Animated
Gifs](https://addons.mozilla.org/en-US/firefox/addon/toggle-animated-gifs/)
extension for Firefox (I'm sure there's something comparable for Chrome),
which lets you do just that.

## Addendum 17-04-28

If you get an error that looks like the following with some weirdly
formatted `.mov` files:

```
avconv version 12, Copyright (c) 2000-2016 the Libav developers
  built on Mar  6 2017 22:35:59 with Apple LLVM version 8.0.0 (clang-800.0.42.1)
[mov,mp4,m4a,3gp,3g2,mj2 @ 0x7fc78b000000] stream 0, offset 0x30: partial file
[mov,mp4,m4a,3gp,3g2,mj2 @ 0x7fc78b000000] Could not find codec parameters (Video: mpeg4 (Simple Profile) [mp4v / 0x7634706D]
      none, 1958 kb/s)
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'pipe:':
  Metadata:
    major_brand     : qt
    minor_version   : 537199360
    compatible_brands: qt
    creation_time   : 2015-05-26 19:04:15
  Duration: 00:00:10.00, bitrate: N/A
    Stream #0:0(eng): Video: mpeg4 (Simple Profile) [mp4v / 0x7634706D]
      none, 1958 kb/s
      600 tbn (default)
    Metadata:
      creation_time   : 2015-05-26 19:04:15
      handler_name    : Apple Alias Data Handler
      encoder         : MPEG-4 Video
Output #0, image2pipe, to 'pipe:':
Output file #0 does not contain any stream
convert: no decode delegate for this image format `' @ error/constitute.c/ReadImage/509.
convert: no images defined `gif:-' @ error/convert.c/ConvertImageCommand/3254.
convert: no decode delegate for this image format `' @ error/constitute.c/ReadImage/509.
convert: no images defined `output.gif' @
error/convert.c/ConvertImageCommand/3254. 
```

Then installing the `qtfaststart`[^3] Python package via `pip install
qtfaststart` and then running

```
qtfaststart bad_movie.mov good_movie.mov
```

should fix the problem and now you can use `good_movie.mov` with the
previous commands to create all the gifs. So
[apparently](https://superuser.com/questions/479063/ffmpeg-pipe-input-error/479064#479064)
what is happening is that some recording software puts the `mdat` block
prior to the `moov` block (the structural metadata). This is more
convenient for recording since the structure isn't known till the
recording is finished, however for playback it isn't as nice.
`qtfaststart` fixes this by swapping the two blocks:

```
$ qtfaststart -l bad_movie.mov
ftyp (32 bytes)
wide (8 bytes)
mdat (2448358 bytes)
moov (998 bytes)
```

while

```
qtfaststart -l good_movie.mov
ftyp (32 bytes)
moov (998 bytes)
wide (8 bytes)
mdat (2448358 bytes)
```

[^1]: I like Google Slides for a variety of reasons, but the main ones are
its simplicity, portability, and collaboration features. Hard to beat for
presentations.

[^2]: OS X dammit

[^3]: So apparently this Python package just repackages ffmpeg's own
qtfaststart.c file. Why ffmpeg can't do this on its own? Who knows.

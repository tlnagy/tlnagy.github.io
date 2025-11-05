---
title: Native MTP interconnect on Mac/Linux
author: Tamas Nagy
layout: post
tags: [linux, mac, android, diy]
date: 2016-02-17 12:00:00
---

Connecting your phone to your computer via MTP isn't as easy as it should
be: the Android File Transfer app is very lackluster and I wanted to have
native file manager integration so that my phone would show up in either
Nautilus on Debian or Finder on Mac. Here's how I got it working.

## Linux setup

On Debian (or Debian derivatives like Ubuntu):

```
sudo apt-get install libfuse-dev android-tools-adb
```

## Mac setup

Install Homebrew (<http://brew.sh>) and OSXFuse
(<https://osxfuse.github.io/>) then run:

```
brew update
brew install android-platform-tools
``` 


## Clone, build, and setup `adbfs`

We'll be using [`adbfs`](https://github.com/spion/adbfs-rootless) to mount
our Android phone:

```
git clone git://github.com/spion/adbfs-rootless.git
cd adbfs-rootless    
make
```

Create a mount point

```
mkdir ~/phone
```

Mount device as follows:

```
./adbfs ~/phone
```

And your phone should be mounted and visible the same way as any DAS
device (e.g. External drives).

## Troubleshooting

Try reseting and restarting `adb` and the mount point

```
killall -9 adb; sudo umount -f ~/phone
```

---
title: Backing up a TrueNAS App Pool to another pool
description: How to set up a simple local replication task for the ix-apps dataset
author: Tamas Nagy
layout: post
tags: truenas
thumbnail: assets/img/2026-02-28-truenas-app-pool-replication-task/IMG_1470-1.jpg
date: 2026-02-28 13:08:00
---

I have been running the same TrueNAS machine for a decade plus and had my first major catastrophic hardware failure last week when the SSD that I use for the boot pool failed. I was not using any RAID[^1] for the boot pool so it meant that I completely lost the OS. Thankfully, the boot pool isn't very important and I could just reinstall the OS and all my data (which is protected by RAIDZ2) was safe. 

However, I used this failure to do some spring cleaning and I decided to do a clean reinstall of the OS instead of restoring. This means that I have to re-set up all of my replication tasks/settings that I built up over years and that I, quite frankly, have forgotten how/what I was doing. Previously, I had a replication task that I failed to document that I used to back up my Docker app pool, which also lives on a single SSD, to my main data array. This isn't essential since I set up all my actual data to live on the data pool via the **Host Path** option during app setup, but it is nice for configs and other things that aren't technically needed but would be a pain to remake if the app pool SSD also failed. 

Unfortunately, as of TrueNAS 25.10.1 there isn't a documented way to do this, but I ran across [this post](https://forums.truenas.com/t/howto-copy-the-hidden-ix-apps-dataset-from-one-pool-to-another/24434) by Stux for moving the app pool from one pool to another that serves as a nice template for building my replication task.

TrueNAS stores all of your Docker mounts and configs in a dataset called `ix-apps` which has some weird behaviors. It's not shown in the GUI but it's mounted at `/mnt/.ix-apps`. You can find the actual location like so:

```
truenas% sudo zfs list | grep ix-apps
perseuspool/ix-apps                                                                         202G   246G   328K  /mnt/.ix-apps
```

where `perseuspool` is my App Pool. You'll need to use this exact location (e.g. `perseuspool/ix-apps`, no preceding or trailing `/`) to get the replication task to work. You set this as the source and your data pool as the destination (`andromedapool` in my case). In the GUI this looks like:

{% include figure.liquid loading="eager" path="assets/img/2026-02-28-truenas-app-pool-replication-task/Screenshot 2026-02-28 at 22.46.24.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true width="80%" %}

And on the next panel, you can set a backup schedule:

{% include figure.liquid loading="eager" path="assets/img/2026-02-28-truenas-app-pool-replication-task/Screenshot 2026-02-28 at 22.43.49.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true width="80%" %}

And it's as simple as that! The only other thing you to need to do is make sure you have Periodic Snapshots set up on the App Pool so the replication task has something to replicate. Hopefully then you'll be good to go.

{% include figure.liquid loading="eager" path="assets/img/2026-02-28-truenas-app-pool-replication-task/Screenshot 2026-02-28 at 23.30.40.png" class="img-fluid rounded z-depth-1 mx-auto d-block" zoomable=true width="80%" %}


[^1]: I'm severely SATA port constrained in this machine. I only have 6 native ports and I have an extension card for two more and all 8 are used.
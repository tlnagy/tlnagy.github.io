---
title: Building this Jekyll site on Debian 8
author: Tamas Nagy
layout: post
tags: [meta, linux]
date: 2016-01-23 12:00:00
---

One of my goals with the redesign was to improve the portability of my
site's stack. It's now pretty simple getting it to work on a fresh Linux
install. For example, on [Debian Jessie](https://debian.org), install the
following packages:

```
sudo apt-get install ruby ruby-dev git imagemagick libmagickwand-dev pandoc pandoc-citeproc
```

then install [bundler](http://bundler.io/)

```
sudo gem install bundler
```

Next, clone the git repo and navigate into the directory

```
git clone https://github.com/tlnagy/tnsite.git
cd tnsite
```

and run bundler to install all ruby dependencies

```
bundle
```

Finally, build and serve the website with Jekyll:

```
jekyll serve -wi
```

Voilà

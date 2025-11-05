---
title: "A deep dive into the Stellar public network (Part 1)"
author: Tamas Nagy
layout: post
tags: [crypto]
date: 2018-03-18 12:00:00
redirect_from: /blog/stellar-network-analysis/
---

One of the basic tenets of public blockchains is that all account and
transactional information is open to anyone to see. While I'm pretty certain
that most cryptocurrencies will eventually adopt some type of zero-knowledge
cryptography (e.g. [zk-snarks](https://z.cash/technology/zksnarks.html)) that
would make this sort of analysis impossible or much more difficult, many
still have everything recorded in the clear, e.g. the [Stellar network](https://stellar.org)
and its corresponding currency, Lumens (XLM).

Stellar is an interesting project because it does not rely on the
extremely wasteful proof-of-work consensus method (used by Bitcoin and Ethereum).
It instead uses the Stellar Consensus Protocol (SCP), which is a form of a federated
Byzantine agreement. There's a [technical summary](https://medium.com/a-stellar-journey/on-worldwide-consensus-359e9eb3e949)
and a [white paper](https://www.stellar.org/papers/stellar-consensus-protocol.pdf)
that both explain how SCP works[^1]. Its key benefits are that it is both fast
(1000+ transactions per second) and environmentally friendly (extremely low
energy costs).

**Okay, so Stellar is cool, but how are people using it?** This was the question that
spawned this analysis. I wanted to see what I could find out from the Stellar's
public blockchain about how people (and bots) were using it. This is part 1 of
what I hope is a multipart dive into the Stellar network[^2]. Some questions I
hope to answer:

1. [What is the inflation destination distribution across accounts?](#account-inflation-destination-distribution)
2. [Is there a correlation between account balance and age?](#correlation-between-account-balance-and-age)
3. Are most accounts just holding[^3] lumens or are they actually moving around?
4. What is the topology of the transaction graph? Is it more hub-and-spoke or more Erdős-Rényi like?
5. Can I detect when major giveaways and changes to the protocol happened?

## Getting the data

While Stellar's documentation is surprisingly good compared to other
cryptoprojects, it took a bit of finagling to get everything to work, but that
might be more indicative of my newness to the whole scene.

The first step was actually getting the data. Stellar has a convenient RESTful
API for many things via [Horizon](https://github.com/stellar/horizon), but that
isn't [sufficient](https://stellar.stackexchange.com/questions/729/possible-to-get-a-list-of-account-holders-satisfying-certain-criteria-using-hori?noredirect=1#comment597_729) for my needs so I needed to set up a full
node locally.

### Setting up a local node

The easiest way to do this is via [`Docker`](https://www.docker.com/) and once
you install it, provisioning a Stellar node is a easy[^4] as running the following
command in your terminal (don't type the preceding `$`):

```
$ docker run --rm -it -p "8000:8000" -p "5432:5432" -v ~/Documents/stellar:/opt/stellar --name stellar stellar/quickstart --pubnet
```

**Make sure to enter a password in for the PostgreSQL database and that you write
it down. You'll need it to connect to the database later.**

The above command tells Docker to download the [`stellar/quickstart`](https://github.com/stellar/docker-stellar-core-horizon)
Docker image and create a volume at `~/Documents/stellar` where the Stellar node
will store all of its data. It will also expose the HTML and PostgreSQL ports
locally too. We'll need the latter one to actually access the data. Finally, the
`--pubnet` flag tells the node to use the public network (i.e. real lumens).

Once you run this command you'll need to wait till the node is synchronized with
the network. You can check its progress by connecting to the Docker container

```
$ docker exec -it stellar /bin/bash
```

which opens a connection to the container's shell. You can then run

```
$ stellar-core --c 'info'
```

to ask query the state of your node. The key thing is to look at the `"state"`
value below, it should eventually read `"Synced!"`

```
Content-Length: 761
Content-Type: application/json

2018-03-18T02:55:14.579 GACID [default INFO] {
   "info" : {
      "authenticated_peers_count" : 8,
      "build" : "v9.1.0",
      "ledger" : {
         "age" : 8,
         "baseFee" : 100,
         "baseReserve" : 5000000,
         "closeTime" : 1521341706,
         "hash" : "260f4e039fb7835c376b0402fec928049c2071412c1fdfcf220445b67a95ad7e",
         "num" : 16874829,
         "version" : 9
      },
      "network" : "Public Global Stellar Network ; September 2015",
      "pending_peers_count" : 0,
      "protocol_version" : 9,
      "quorum" : {
         "16874828" : {
            "agree" : 5,
            "disagree" : 0,
            "fail_at" : 2,
            "hash" : "ba2fc8",
            "missing" : 0,
            "phase" : "EXTERNALIZE"
         }
      },
      "state" : "Synced!"
   }
}
```

The last ledger was [16874860](https://stellarchain.io/ledger/16874860) when I
shutdown my node to prevent the data from mutating during my analysis.

### Querying the data

I used [Postico](https://eggerapps.at/postico/) to actually query the data, but
any PostgreSQL client will work.

![](assets/img/2018-03-18-stellar-network-analysis/f6930827.png)

You'll need to tell it to connect to the PostgreSQL instance by telling it to
connect to localhost on port 5432, with `stellar` as the username and the
password you entered from above. The main database we'll be interacting with is
`core`. You can then execute any SQL query against the database.

## Analysis

Now to the fun part, actually answering some questions! All my analysis was done
in [Julia](https://julialang.org) and my jupyter notebook is available [here](https://gist.github.com/tlnagy/13c88fb4987ab4081cbc043b31a5e018).

### Account inflation destination distribution

One major concept of the Stellar network is the concept of [inflation](https://www.stellar.org/developers/guides/concepts/inflation.html).

> The Stellar distributed network has a built-in, fixed, nominal inflation mechanism. New lumens are added to the network at the rate of 1% each year. Each week, the protocol distributes these lumens to any account that gets over .05% of the “votes” from other accounts in the network.

My understanding is that lumens that are distributed are both new lumens that
are added (at the rate of 1% of each year) and the lumens collected from
transaction fees[^5]. But...lumens are only distributed if an inflation
destination is set. I wanted to look at the inflation destinations ordered by
the total amount of XLM in the accounts pointed at each destination (on left)
and the number of accounts pointed at each destination (on right).

![](assets/img/2018-03-18-stellar-network-analysis/inflationdest.svg)

First thing, there are a lot of accounts without a set inflation destination
(i.e. a NULL destination). 6.7 billion lumens are not earning inflation, which
works out to 37% of all distributed lumens. It's even worse if you look at the
level of accounts. 76% percent of all accounts aren't earning any inflation!
The biggest community pool (balance-wise) is [GCCD..NAUT](https://lumenaut.net/),
which is one of the newer pools that has no fees. Pretty cool that it caught on
so quick.

I don't understand why manual setting of the inflation destination is necessary.
Why can't the lumens be distributed to every account equally? I just find it
unfortunate that the majority of accounts aren't taking advantage of the
inflation payouts.

### Correlation between account balance and age

Another thing I wanted to look at is if there was any correlation between the
age of an account and the size of the balance. The account creation time is not
stored, but there is a last modified time. Plotting the 2D histogram of the last
modified time versus balance size gives this:

![](assets/img/2018-03-18-stellar-network-analysis/balanceage.svg)

Couple interesting points. You can clearly see when the minimum account balance
was lowered from 10 XLM to 0.5 XLM in [January](https://github.com/stellar/docs/commit/9c0100d80d32dfff9d9d071b77def6bf8599b151#diff-fe29f1f4bf5e6ceed24a2a27a5d241c6).
There is also a strip around 5000 XLM, which are probably old accounts that
received free lumens, but were forgotten.

In the next part, I'll map transactions to each account so then I'll be able to
find the oldest transaction for each account to determine its age instead of
using the last modified time. I also hope to answer the rest of the questions
outlined above.

If you made it this far and have any more ideas for what I could look into, tweet
at me ([\@tlngy](https://twitter.com/tlngy)).

[^1]: I plan to write an intuitive description of how SCP works on this blog
some time in the future. Hopefully, it will help me a better understanding of
the limitations and weaknesses of the protocol design.

[^2]: That depends heavily on the amount of free time I have, heh.

[^3]: hodling

[^4]: I originally tried setting up an instance by compiling stellar-core
locally on my MacOS machine, but ran into issues with the [config file](https://stellar.stackexchange.com/questions/731/running-into-an-invalid-quorum-set-error-when-running-stellar-core?noredirect=1#comment594_731). Apparently, the default config file ships with a non-functional
quorum-set (probably a good thing to make sure people actually think about which
nodes they list here, heh).

[^5]: In proof-of-work currencies, the transaction fees are much higher and paid to
the miners.

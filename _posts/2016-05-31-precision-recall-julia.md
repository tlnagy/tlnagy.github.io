---
title: Precision-Recall curves in Julia
author: Tamas Nagy
layout: post
tags: [julia, science]
date: 2016-05-31 12:00:00
redirect_from: /blog/precision-recall-julia/
---

Precision-Recall (PR) curves are useful for evaluating the performance of
a binary classifier on highly skewed datasets where one class is much more
prevalent than the other. This situation is common in biology where most
things have little to no effect and there is a small subset of things that
have large effect. In contrast to ROC curves, PR curves do not
overestimate performance in these cases [@davis_relationship_2006]. The
reason ROC curves are more sensitive to this issue is due to their
reliance on the false positive rate (FPR), defined as $\frac{FP}{FP + TN}$
where $FP$ and $TN$ are the number of false positives and true negatives,
respectively. Since $TN >> FP$ for skewed datasets, ROC curves are
insensitive to the number of false positives, making them overly
optimistic. 

PR curves, on the other hand, do not use $TN$ so they avoid this problem,
since precision and recall are defined as $\frac{TP}{TP+FP}$ and
$\frac{TP}{TP+FN}$, respectively. Intuitively, precision measures what
fraction of called positive hits are correct and recall measures how many
of the actual positive hits did the algorithm call. Generating the curves
is all very nice, but it is desirable to collapse this curve down into a
single value when scanning through a large parameter space, which is often
the area under the curve (AUC). However, unlike with ROC curves, there
isn't a single accepted way of computing the AUC of a PR curve (AUPRC).

I recently found an interesting paper by @boyd_area_2013 that explored
different ways of computing the AUPRC. They showed that there are some
good and some very bad ways of computing this value and they generated
some really nice figures in `R`. I much prefer
[Julia](http://julialang.org) so I decided to recreate some of the results
of the paper using it. My implementation is pretty fast, but I would gladly 
accept any PRs to improve it.

## Precision, recall, and AUC calculation

{% highlight julia %} 
"""
Copyright 2016 Tamas Nagy, Martin Kampmann, and contributers

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain a
copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.
"""

function Base.count(labels::AbstractArray{Symbol}, pos_labels::Set{Symbol})
    num_pos, num_neg = 0, 0
    for label in labels
        if label in pos_labels
            num_pos += 1
        else
            num_neg += 1
        end
    end
    num_pos, num_neg
end

"""
auprc(scores::AbstractArray{Float64}, classes::AbstractArray{Symbol}, pos_labels::Set{Symbol})

Computes the area under the Precision-Recall curve using a lower
trapezoidal estimator, which is more accurate for skewed datasets.
"""
function auprc(scores::AbstractArray{Float64}, classes::AbstractArray{Symbol}, pos_labels::Set{Symbol})
    num_scores = length(scores) + 1
    ordering = sortperm(scores, rev=true)
    labels = classes[ordering]
    num_pos, num_neg = count(labels, pos_labels)

    tn, fn, tp, fp = 0, 0, num_pos, num_neg

    p = Array(Float64, num_scores)
    r = Array(Float64, num_scores)
    p[num_scores] = tp/(tp+fp)
    r[num_scores] = tp/(tp+fn)
    auprc, prev_r = 0.0, r[num_scores]
    pmin, pmax = p[num_scores], p[num_scores]

    # traverse scores from lowest to highest
    for i in num_scores-1:-1:1
        dtn = labels[i] in pos_labels ? 0 : 1
        tn += dtn
        fn += 1-dtn
        tp = num_pos - fn
        fp = num_neg - tn
        p[i] = (tp+fp) == 0 ? 1-dtn : tp/(tp+fp)
        r[i] = tp/(tp+fn)

        # update max precision observed for current recall value
        if r[i] == prev_r
            pmax = p[i]
        else
            pmin = p[i] # min precision is always at recall switch
            auprc += (pmin + pmax)/2*(prev_r - r[i])
            prev_r = r[i]
            pmax = p[i]
        end
    end
    auprc, p, r
end
{% endhighlight %}

##Plotting

Then to recreate Figure 2:


{% highlight julia %}
using Distributions
using Gadfly
π = 0.1
test_dists = Array[
    [Normal(0, 1), Normal(1,1)],
    [Beta(2, 5), Beta(5, 2)],
    [Uniform(0, 1), Uniform(0.5, 1.5)]
]
x_ranges = Array[
    linspace(-5, 5, 500),
    linspace(0, 1, 500),
    linspace(-0.5, 2, 500)
]


names = ["binormal", "bibeta", "offset uniform"]

plots = []
for (name, test_dist, xs) in zip(names, test_dists, x_ranges)
    X, Y = test_dist
    push!(plots, plot(
        layer(x=xs, y=pdf(X, xs), Geom.line, Theme(line_width=2pt, default_color=colorant"#cccccc")),
        layer(x=xs, y=pdf(Y, xs), Geom.line),
    Guide.ylabel(""), Guide.xlabel(""), Guide.title(name), Guide.yticks()
    ))
end
draw(SVG(30cm, 10cm), hstack(plots...))
{% endhighlight %}

![The artificial datasets with the positive distributions in 
blue and the negative ones in grey](/assets/images/pr-dists.svg)

And now we're ready for Figure 3:


{% highlight julia %}
# true precision, recall functions
recall(xs, Y) = 1-cdf(Y, xs)
precision(xs, π, X, Y) = π*recall(xs, Y)./(π*recall(xs, Y) + (1-π)*(1-cdf(X, xs)))


plots = Plot[]
for (name, dists, xs) in zip(names, test_dists, x_ranges)
    X, Y = dists
    classes = [:b, :a]

    layers = []
    push!(layers, layer(x=recall(xs, Y), y=precision(xs, π, X, Y), 
    Geom.line, Theme(line_width=2pt)))
    for i in 1:10
        cat = rand(Categorical([1-π, π]), 500)
        scores = map(rand, dists[cat])    
        _auprc, p, r = auprc(scores, classes[cat], Set([:a]))
        push!(layers, layer(x=r, y=p,Geom.line, 
        Theme(default_color=colorant"#cccccc", highlight_width=0pt)))
    end
    push!(plots, plot(layers..., Coord.cartesian(fixed=true), 
    Guide.ylabel("precision"), Guide.xlabel("recall"),
    Guide.title(name), Guide.yticks(ticks=[0.0, 0.5, 1.0])))
end
draw(SVG(30cm, 10cm), hstack(plots))
{% endhighlight %}

Voila, we have Figure 3:

![Precision-recall curves on highly skewed artificial datasets. 90% of the
data is negative.](/assets/images/precision-recall.svg)

<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

## References

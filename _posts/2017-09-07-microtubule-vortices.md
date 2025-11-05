---
title: "Active matter modeling"
author: Tamas Nagy
layout: post
tags: [science, math]
thumbnail: assets/img/2017-09-07-microtubule-vortices/mt_vortices.gif
date: 2017-09-07 12:00:00
redirect_from: /blog/microtubule-vortices/
---
Yesterday was the systems biology module of the iPQB bootcamp here at UCSF. I was in charge of the modeling section and I decided to try to get the students to model the relatively simple active matter system from @Sumino2012-dc since it was relatively straightforward, very visual, and shows complex emergent properties from simple rules (See Figure 1). Active matter systems are ubiquitous nonequilibrium condensed systems whose "unifying characteristic is that they are **composed of self-driven units, active particles, each capable of converting stored or ambient free energy into systematic movement**" [@Marchetti2013]. An *in vitro* microtubule and dynein system, like the one we're investigating here, is much more controlled and reproducible compared to the flocking of birds or fish and thus serves as a nice model system in which to study active matter.


![Figure 1A-B from @Sumino2012-dc. Cy3 labeled microtubules form vortices when placed on dynein-c coated glass coverslips in the presence of ATP](assets/img/2017-09-07-microtubule-vortices/0de43a55.png)

The authors proposed a relatively simple model that could recapitulate this phenomenon. They modeled the behavior of the microtubules as a biased Ornstein–Uhlenbeck process where the microtubules moved at a constant velocity in a direction, $\theta_i$, that was updated by an angular velocity, $\omega_i$, at each time step. They added some normal brownian noise to $\omega_i$ with mean $\xi_{\mu}$ and standard deviation $\xi_{\sigma}$. They noticed that the microtubules had a slight clockwise curvature preference and that after relaxation time $\lambda$, the angular velocity $\omega_i$ would approach the preferred angular velocity, $\omega_0$.

@Sumino2012-dc also noted that microtubules would almost always align or anti-align after collisions (they would sometimes stall or cross). They modeled this by taking the aggregate angle of all neighbors of a microtubule that are within a certain distance from the microtubule. This was then weighted by a parameter $A$ that controls the relative influence of other microtubules.

Mathematically, this can be expressed in the following non-dimensionalized form:

$$
\begin{align}
\frac{d\Omega_i}{dT} &= - \frac{1}{\lambda}\left(\Omega_i - \Omega_0\right) + \textrm{Normal}(\xi_{\mu}, \xi_{\sigma})\\
\frac{d\theta_i}{dT} &= \Omega_i + \frac{A}{N_i(T)} \sum_{j \sim i} \sin\left(2(\theta_j - \theta_i)\right) \\
\frac{d\mathbf{X_i}}{dT} &= \mathbf{e_x}\cos \theta_i + \mathbf{e_y} \sin \theta_i
\end{align}
$$

I implemented the code using Python 3, NumPy, SciPy, and Matplotlib and it is available as a Jupyter Notebook in this gist: <https://gist.github.com/tlnagy/cba938ffd5c98236e90bfd1dc3d23d11>. The students found a quite few parameter combinations that yielded interesting results, most of which were highly unrealistic. I suspect this is due to the much lower "concentration" of microtubules that we used in our simulation to achieve interactivity, $N=1500$ instead of $N=2621440$. We were still able to get vortices to form:

![Initially, microtubule movement looks pretty random.](assets/img/2017-09-07-microtubule-vortices/mt_initial.gif)

![However, they start to coalesce into a grid of vortices](assets/img/2017-09-07-microtubule-vortices/mt_vortices.gif)

<script type="text/javascript"
src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>

## References

---
title: 'Machine Learning Part 4: Markov Decision Processes & Reinforcement Learning'
date: '2019-06'
slug: 'ml-part-4-reinforcement-learning'
selectedWork: true
description: 'Exploring Value Iteration, Policy Iteration, and Q-Learning in stochastic grid worlds, comparing convergence, rewards, timing, and behavior across easy and hard MDP environments.'
previewImage: '/images/project/machineLearning/reinforcementLearning/cover.png'
sourceCode: 'https://github.com/rylew2/Machine-Learning-Assignments'
tags:
  - python
  - reinforcement learning
  - mdp
  - value iteration
  - policy iteration
  - q-learning
  - omscs
---

In this assignment I moved from supervised and unsupervised learning into the world of **sequential decision making**. Using two grid-world environments, I compared three core algorithms for solving **Markov Decision Processes (MDPs)**:

- **Value Iteration (VI)**
- **Policy Iteration (PI)**
- **Q-Learning** (model-free reinforcement learning)

The goal was to understand how these algorithms behave as the environment becomes more complex: how quickly they converge, how good their final policies are, and how much computation they require.

---

## 📘 MDP Overview

An MDP is defined by:

- **States (S):** all possible agent locations in the grid
- **Actions (A):** up, down, left, right
- **Transition function (T):** probability of landing in next state s′ after action a
- **Rewards (R):** numeric feedback for entering states (good or bad)

Value Iteration and Policy Iteration assume that T and R are known.
**Q-Learning**, in contrast, never sees the model and instead learns purely from trial-and-error interaction.

The **discount factor γ** controls how much the agent values the future:

- High γ (around 0.99) encourages long-term planning toward the goal.
- Low γ makes the agent shortsighted, caring mostly about immediate rewards.

---

## 🌍 Grid-World Environments

I used two grid-worlds that share the same reward structure but differ in scale and difficulty.

### Easy Grid World (10×10)

- White cells: small negative reward (−1) to encourage reaching the goal quickly
- Colored cells: harsher penalties (−10, −30, −50)
- Top-right cell: terminal state with reward +100
- A few walls to bend the path but not make it too maze-like

### Hard Grid World (20×20)

- Much larger map with many more walls and bottlenecks
- More frequent and severe negative reward regions
- Many more distinct paths to the goal – and many more bad ones

Both worlds are **stochastic**: the intended action happens 80% of the time, and each of the other three directions occurs about 6.67% of the time. Even a good policy must be robust to occasional slips.

![Easy vs Hard Grid Worlds](/images/project/machineLearning/reinforcement/easy-hard-grids.png)

---

## 🟦 Dynamic Programming: Value Iteration vs Policy Iteration

Value Iteration and Policy Iteration both assume a full model of the environment and aim to compute an optimal policy, but they do it in different ways.

- **Value Iteration** repeatedly applies the Bellman backup to update state values until they stop changing. The policy is implicitly “greedy” with respect to these values.
- **Policy Iteration** alternates between:
  1. **Policy evaluation** – computing values for the current policy
  2. **Policy improvement** – updating the policy to be greedy with respect to those values

### Easy World

On the smaller grid, both algorithms converge quickly to the same intuitive strategy: weave around high-penalty cells while heading toward the +100 terminal state.

![Easy World VI vs PI – Reward, Steps, and Delta](/images/project/machineLearning/reinforcement/easy-vi-pi-reward-delta.png)

Some observations:

- **Policy Iteration converges in fewer iterations**, because each iteration does a full policy evaluation step.
- Those iterations are **more expensive**, so total runtime is closer than the iteration counts suggest.
- Higher γ values emphasize the +100 goal state more strongly, making the agent tolerate short detours through mildly bad states if they lead to a shorter overall route.

To visualize how values propagate, I plotted both **value maps** and **policy arrows** over iterations. Early on, everything is red and noisy; as iterations progress, blues spread outward from the goal and arrows line up to form clean paths.

![Easy World Policy and Value Maps](/images/project/machineLearning/reinforcement/easy-policy-maps.png)

### Hard World

The 20×20 world tells a different story.

![Hard World VI vs PI – Reward, Steps, and Delta](/images/project/machineLearning/reinforcement/hard-vi-pi-reward-delta.png)

- Convergence takes significantly longer because there are many more states and many more ways to accumulate negative reward on the way to the goal.
- VI tends to improve more **gradually and smoothly**, as each sweep softly updates values everywhere.
- PI shows sharp spikes early on as new policies radically redirect the agent through different parts of the maze.
- With **low γ**, both algorithms effectively give up on reaching the goal – the future +100 is discounted so heavily that staying near safer regions looks preferable.

The final policy in the hard world still manages to thread a narrow path through the maze of penalties:

![Hard World Optimal Policy Maps](/images/project/machineLearning/reinforcement/hard-policy-maps.png)

---

## ⚡ Q-Learning – Model-Free Reinforcement Learning

Unlike VI and PI, **Q-Learning** does not require knowing T or R in advance.
It instead learns **action-values** Q(s, a) directly by interacting with the environment:

Q(s, a) ← (1 − α)Q(s, a) + α [R + γ maxₐ′ Q(s′, a′)]

Learning depends heavily on three hyperparameters:

- **Learning rate (α)** – how much new information overrides old estimates
- **Exploration rate (ε)** – probability of taking a random action
- **Initial Q-values** – optimistic vs neutral starting assumptions

### Easy World: Hyperparameter Experiments

In the 10×10 grid I varied ε, α, and the initial Q values.

![Q-Learning in the Easy World – Varying Parameters](/images/project/machineLearning/reinforcement/easy-qlearning-params.png)

Key findings:

- **ε = 0.1** struck the best balance between exploration and exploitation – enough random moves to discover the map, but not so many that the agent thrashes forever.
- Very high ε values produce noisy reward curves, as the agent keeps revisiting bad states.
- **α = 0.1** provided stable learning; large α (0.9) caused Q-values to overshoot and oscillate.
- Neutral initial values (Q = 0) worked better than overly optimistic ones, which tempted the agent to wander too long before committing to good paths.

Over time the learned policy converges to the same path as the dynamic-programming methods, but it takes many more interactions to get there.

![Easy World – Q-Learning Optimal Policy Over Iterations](/images/project/machineLearning/reinforcement/easy-q-optimal-policy-maps.png)

### Hard World: More States, More Trouble

In the hard 20×20 grid, the same trends hold but are amplified:

- Bad choices are more costly because they often lead into long corridors of negative rewards.
- Higher ε means the agent is more likely to get “lost” for long stretches in punishing regions.
- Again, α = 0.1 and γ = 0.99 produced the most reliable learning. Lower γ values drastically undervalued the terminal reward and resulted in policies that barely tried to reach the goal.

Despite the difficulty, Q-Learning still discovers a reasonable path given enough iterations, showcasing its ability to learn **without ever seeing the model**.

---

## 📏 Scaling Up: Variable Grid Size

Finally, I looked at how the algorithms behave as the grid grows to n×n.

![Variable Grid Size – Steps, Rewards, and Timing](/images/project/machineLearning/reinforcement/variable-grid-size.png)

As expected:

- All methods require **more steps** to reach the goal as n increases.
- Negative rewards accumulate more easily because there are more ways to wander.
- For Q-Learning, reward curves drop sharply around **n = 40**, suggesting that naive exploration becomes insufficient in very large spaces.
- In terms of **time per iteration**:
  - Q-Learning is by far the **fastest** update step.
  - Value Iteration sits in the middle.
  - Policy Iteration is **slowest**, since each iteration performs a full policy evaluation sweep.

---

## 📝 Summary Table

From the experiments I summarized convergence and timing across algorithms:

| Algorithm        | World | Iterations to Converge | Converged Reward | Converged Steps | Time/Iter | Total Time |
|-----------------|-------|------------------------|------------------|-----------------|-----------|-----------|
| Value Iteration | Easy (γ=0.99) | **25** | 60 | 36 | 0.005621 | 0.140525 |
| Value Iteration | Hard (γ=0.99) | 37 | 16 | 60 | 0.01892  | 0.69934  |
| Policy Iteration | Easy (γ=0.99) | **10** | **60** | **36** | 0.033461 | 0.33461 |
| Policy Iteration | Hard (γ=0.99) | **12** | **60** | **60** | 0.107643 | 1.5266  |
| Q-Learning | Easy (α=0.1, ε=0.1, γ=0.99) | 154 | 60 | 36 | **0.000172** | **0.026488** |
| Q-Learning | Hard (α=0.1, ε=0.1, γ=0.99) | 880 | 45 | 75 | **0.000352** | **0.3098**  |

Best values are bolded. Q-Learning is by far the cheapest per update, but often needs many more updates to reach comparable performance.

---

## 🧩 Final Takeaways

**Value Iteration**

- Very stable and conceptually simple.
- Converges reliably without dramatic swings in value.
- In the hard world it ends up faster overall than Policy Iteration, thanks to cheaper iterations.

**Policy Iteration**

- Needs the **fewest iterations** to converge.
- Each iteration is expensive due to full policy evaluation.
- Produces slightly better final policies in some settings, especially when γ is high.

**Q-Learning**

- Most flexible: does not require a model of the environment.
- Fastest update step, but potentially many more updates.
- Highly sensitive to α, ε, and initialization.
- More prone to local minima and high variance early in training, especially in large or heavily penalized worlds.

---

## 🧠 Big Picture

Across these experiments, no single method dominates:

- **VI** is steady and dependable when you have a known model.
- **PI** can converge in fewer iterations but at a higher computational cost per sweep.
- **Q-Learning** shines in **model-free** settings, as long as its hyperparameters are tuned carefully.

This assignment is a concrete example of the **No Free Lunch Theorem** in reinforcement learning: the “best” algorithm depends on the environment, reward structure, and what information you have about the world. Understanding the domain is just as important as choosing the algorithm.

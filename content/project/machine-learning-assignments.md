---
title: Machine Learning Assignments
date: "2019-06"
slug: "machine-learning-assignments"
description: "A survey of machine learning topics including supervised, unsupervised, clustering and dimensionality reduction, and reinforcement learning"
previewImage: "/images/project/machineLearning/brain.png"
sourceCode: "https://github.com/rylew2/Machine-Learning-Assignments"
---

In the Machine Learning courses we explored various algorithms via experimental analysis on two datasets - I ended up choosing `white wine` and `abalone`. The following is a discussion of just the primary components about these machine learning algorithms.

## Choosing Datasets

The popular <ins><a href="https://archive.ics.uci.edu/ml/datasets/wine">wine quality score dataset</a></ins> I chose is based on a chemical analysis of wines grown in Italy - and the resulting user "quality" scores - scored from 0 to 10. Some of the wine dataset attributes include the amounts of: alcohol, malic acid, magnesium, phenols, and flavonoids. The idea of choosing a dataset like this is that it's a simple classification problem that's well suited for determining if chemical constituents of wine can predict quality scores.. The wine industry is worth billions in California alone, and if wine producers can find out what chemical constituents produce higher quality wines (at least in the mind of customers), then they likely will.

The other dataset I used was a modified version of the <ins><a href="https://archive.ics.uci.edu/ml/datasets/abalone">ablone age</a></ins> dataset - the idea being to predict the age of an abalone based on physical measurements such as: length, diameter, shucked weight, gender. The actual age of the animal is determined by counting the numbers of rings - however this is a time consuming process that requires a microscope. Therefore the goal of this dataset is to see if there's a better proxy attribute to use to count rings.

<figure class="image">
  <Image src="/images/project/machineLearning/wine-label-distribution.jpg" alt="high level view of GitHub browser">
  <figcaption>The distribution of wine quality scores and my specific binary classification (0 to 5 is 'bad', 6 to 9 is 'good')</figcaption>
</figure>

## Algorithm Analysis

The code itself is basically searching all possible `hyperparameters` of each algorithm to find optimal results. I used `sklearn`'s `GridSearchCV` function which search over a specified range of hyperparameters, finding the optimal hyperparameter combination. This code does a 70/30 train/test split of the data, normalizes the data to a standard scale, performs 5-fold cross validation on the 70% training data for each hyperparameter combination, and finally calculates the average cross validation score among the 5 folds. The best 5-fold cross validation score from our grid search lets us know what the optimal hyperparameters are.

With the optimal hyperparameters, I can use these settings on the 30% held out test set for each different supervised algorithm and determine which algorithm would perform the best for solving the central idea of each algorithm (predicting quality or predicting age).

## Supervised

In the supervised assignment I looked at K-Nearest Neighbors, Decision Trees, Artificial Neural Networks, Boosting, and Support Vector Machines.

### K-Nearest Neighbors (KNN)

KNN is a simple instance-based algorithm that simply looks at the `k` nearest points in feature space. For classification, this is simply a vote or choosing the mode of the neighbors classes, whereas in a regression setting this would be the weighted mean. Some of the hyperparameters chosen for KNN include `k`, distance functions (Manhatta, Euclidean, and Chebyshev), and whether we weight each neighbor equally or by its distance to the point.

<figure class="image">
  <Image src="/images/project/machineLearning/knn.png" alt="high level view of GitHub browser">
  <figcaption>Simple view of KNN classification</figcaption>
</figure>

As seen in one of the convergence curves where the train and test were plotted against our value of `k` - we can see the `**bias variance tradeoff**` at work. For low `k` values, we have a `high variance` situation with a highly complex model that only really works for training data - the model is not "general" enough. An intuitive way to think about this is if we have an outlier "good" wine classification in a normally "bad" wine region of space, if we have k=1, points around that outlier may be labelled incorrectly.

<figure class="image">
  <Image src="/images/project/machineLearning/wine-knn.png" alt="optimal k values for knn">
  <figcaption>Train and Test scores vs K - with an optimal k at about 25</figcaption>
</figure>

As we increase the value of `k` - it can be though of as smoothing out the decision surface - which will decrease variance and bias. Increasing `k` too far leads to the opposite scenario - a `high bias` situation. It's all about finding the right balance point.

### Decision Trees

In contrast to KNN, a decision tree is an eager learner as it builds the model on the training data first. Decision trees ask yes or no questions on features to determine which direction to branch. The final leaf node contains the prediction class. Decision trees work well with good splits of the data. In order to measure the quality of splits, I ran Entropy and Gini Index in the hyperparameter grid search. Some decision tree algorithms only look one move ahead to determine the current root of the tree - this is generally ok but usually not the most optimal. You usually want good splits at the top which leads to shorter trees.

In some of the max depth experiments run, increasing the max depth leads to overfitting. If the tree is allowed too many nodes it starts to exactly fit the training data - therefore it generalizes poorly for test data. Pruning or trimming nodes can help alleviate some of these overfitting issues. Error reduction pruning will attempt remove the subtree at nodes, make them leaf and re-assigning a class. If the resulting tree performs at least as good that prune is kept. In both datasets pruning boosted scores from about 75 to 80%.

<figure class="image">
  <Image src="/images/project/machineLearning/dt-pruning.jpg" alt="Decision tree pruning">
  <figcaption>Pruning can reduce overfitting</figcaption>
</figure>

### Artificial Neural Networks (ANN)

Artificial Neural Networks are learning algorithms modeled after brain neurons. The most basic unit is a `perceptron` that takes a weighted sum of inputs - if the sum is greater than some threshold (defined by the `activation function`) then that output is considered on or activated. ANN can tune the weight vectors (for each node connection) at each layer of the network by iteratively nudging them in small steps. The `perceptron training rule` will gaurantee convergence (appropriate score/error) in a finite number of iterations if the data is linearly separable. Data that's not linearly separable will use the `backpropagation` rule and gradient descent to iteratively step down the gradient of the cost function. Issues can still occure such as slow convergence or getting stuck in local minima..

<figure class="image">
  <Image src="/images/project/machineLearning/ann.png" alt="Decision tree pruning">
  <figcaption>An Ann typically consists of an input layer, any number of hidden layers, and an output layer</figcaption>
</figure>

In my experiments I used `sklearn`'s `MLPClassifier` which uses stochastic gradient descent - this looks at each training example individually to update weights, offering slightly better runtime than the alternative batch gardient descent.

Some of the experiments here including comparing some of the activation functions (logistic, relu, tanh, identity), comparing varying network dimensions (5, 10, 20 in the first layer versus 5, 10 or 20 in the second layer). Overall ANN needs the fewest number of tarining examples of all the supervised algorithms to converge.

<figure class="image">
  <Image src="/images/project/machineLearning/ann-learning-curve.jpg" alt="Decision tree pruning">
  <figcaption>Wine converging at about 340 trainig examples, while abalone taks about 1000</figcaption>
</figure>

### Boosting

Boosting is an `ensemble` method of learning - the idea being combining many simple learners leads to a complex system that improves performance. In a common boosting algorithm like `Adaboost` each individual learner gets a weighted (depending on its error rate) vote towards the final hypothesis. In addition, each training example is given a variable weight. If the example is modeled poorly in previous learners, its weight increases, if its modeled correctly it decreases. Therefore, even with weak learners, we are always gaining information with learners.

### Support Vector Machines

<blockquote> Future ML algorithms coming... </blockquote>
## Unsupervised - Randomized Optimization

## Unsupervised - Dimensionality reduction Algorithms

## Markov Decision Processes - Reinforcement Learning

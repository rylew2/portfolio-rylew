---
title: Machine Learning Assignments
date: "2019-06"
slug: "machine-learning-assignments"
description: "A survey of machine learning topics including supervised, unsupervised, clustering and dimensionality reduction, and reinforcement learning"
previewImage: "/images/project/machineLearning/brain.png"
sourceCode: "https://github.com/rylew2/Machine-Learning-Assignments"
tags:
  - python
  - sklearn
  - machine learning
  - omscs
---

In the primary Machine Learning course we explored various algorithms via experimental analysis on two datasets - `white wine` and `abalone`. The following is a high level discussion of some of the analysis I performed on supervised learning algorithms.

## Choosing Datasets

The popular <ins><a target="_blank" href="https://archive.ics.uci.edu/ml/datasets/wine">wine quality score dataset</a></ins> I chose is based on a chemical analysis of wines grown in Italy - and the resulting user "quality" scores - scored from 0 to 10. Some of the wine dataset attributes include the amounts of: <blockquote>alcohol, malic acid, magnesium, phenols, and flavonoids</blockquote>

The idea of choosing a dataset like this is that it's a simple classification problem that's well suited for determining if chemical constituents of wine can predict quality scores.. The wine industry is worth billions in California alone, and if wine producers can find out what chemical constituents produce higher quality wines (at least in the mind of customers), then they likely will.

The other dataset I used was a modified version of the <ins><a target="_blank" href="https://archive.ics.uci.edu/ml/datasets/abalone">ablone age</a></ins> dataset - the idea being to predict the age of an abalone based on physical measurements such as:

<blockquote>length, diameter, shucked weight, and gender </blockquote>

The actual age of the animal is determined by counting the numbers of rings - however this is a time consuming process that requires a microscope. Therefore the goal of this dataset is to see if there's a better proxy attribute to use to count rings.

<figure class="image">
  <Image src="/images/project/machineLearning/wine-label-distribution.jpg" alt="high level view of GitHub browser">
  <figcaption>The distribution of wine quality scores and my specific binary classification (0 to 5 is 'bad', 6 to 9 is 'good')</figcaption>
</figure><br />

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
</figure><br />

As seen in one of the convergence curves where the train and test were plotted against our value of `k` - we can see the `**bias variance tradeoff**` at work. For low `k` values, we have a `high variance` situation with a highly complex model that only really works for training data - the model is not "general" enough. An intuitive way to think about this is if we have an outlier "good" wine classification in a normally "bad" wine region of space, if we have k=1, points around that outlier may be labelled incorrectly.

<figure class="image">
  <Image src="/images/project/machineLearning/wine-knn.png" alt="optimal k values for knn">
  <figcaption>Train and Test scores vs K - with an optimal k at about 25</figcaption>
</figure>
<br />

As we increase the value of `k` - it can be though of as smoothing out the decision surface - which will decrease variance and increase bias. Increasing `k` too far leads to the opposite scenario - a `high bias` situation. It's all about finding the right balance point.

### Decision Trees

In contrast to KNN, a decision tree is an eager learner as it builds the model on the training data first. Decision trees ask yes or no questions on features to determine which direction to branch. The final leaf node contains the prediction class. Decision trees work well with good splits of the data. In order to measure the quality of splits, I ran Entropy and Gini Index in the hyperparameter grid search. Some decision tree algorithms only look one move ahead to determine the current root of the tree - this is generally ok but usually not the most optimal. You usually want good splits at the top which leads to shorter trees.

In some of the max depth experiments run, increasing the max depth leads to overfitting. If the tree is allowed too many nodes it starts to exactly fit the training data - therefore it generalizes poorly for test data. Pruning or trimming nodes can help alleviate some of these overfitting issues. Error reduction pruning will attempt remove the subtree at nodes, make them leaf and re-assigning a class. If the resulting tree performs at least as good that prune is kept. In both datasets pruning boosted scores from about 75 to 80%.

<figure class="image">
  <Image src="/images/project/machineLearning/dt-pruning.jpg" alt="Decision tree pruning">
  <figcaption>Pruning can reduce overfitting</figcaption>
</figure>
<br />

### Artificial Neural Networks (ANN)

Artificial Neural Networks are learning algorithms modeled after brain neurons. The most basic unit is a `perceptron` that takes a weighted sum of inputs - if the sum is greater than some threshold (defined by the `activation function`) then that output is considered on or activated. ANN can tune the weight vectors (for each node connection) at each layer of the network by iteratively nudging them in small steps. The `perceptron training rule` will gaurantee convergence (appropriate score/error) in a finite number of iterations if the data is linearly separable. Data that's not linearly separable will use the `backpropagation` rule and gradient descent to iteratively step down the gradient of the cost function. Issues can still occure such as slow convergence or getting stuck in local minima..

<figure class="image">
  <Image src="/images/project/machineLearning/ann.png" alt="Decision tree pruning">
  <figcaption>An Ann typically consists of an input layer, any number of hidden layers, and an output layer</figcaption>
</figure><br />

In my experiments I used `sklearn`'s `MLPClassifier` which uses stochastic gradient descent - this looks at each training example individually to update weights, offering slightly better runtime than the alternative batch gardient descent.

Some of the experiments here including comparing some of the activation functions (logistic, relu, tanh, identity), comparing varying network dimensions (5, 10, 20 in the first layer versus 5, 10 or 20 in the second layer). Overall ANN needs the fewest number of tarining examples of all the supervised algorithms to converge.

<figure class="image">
  <Image src="/images/project/machineLearning/ann-learning-curve.jpg" alt="ann learning curve">
  <figcaption>Wine converging at about 340 trainig examples, while abalone taks about 1000</figcaption>
</figure><br />

### Boosting

Boosting is an `ensemble` method of learning - the idea being combining many simple learners leads to a complex system that improves performance. In a common boosting algorithm like `Adaboost` each individual learner gets a weighted (depending on its error rate) vote towards the final hypothesis. In addition, each training example is given a variable weight. If the example is modeled poorly in previous learners, its weight increases, if its modeled correctly it decreases. Therefore, even with weak learners, we are always gaining information with learners. In general boosting will reduce the bias (model complexity) in a model that's too general, whereas a related but different method `bagging` will reduce reduce variance of a model that is too complex. Boosting can occasionally cause overfitting in a rare case where the first learner perfectly fits the training data causing weights to never be updated.

<figure class="image">
  <Image src="/images/project/machineLearning/boostingbagging.jpg" alt="boosting-vs-bagging">
  <figcaption>A parallel vs sequential method of ensemble learning</figcaption>
</figure>
<br />

The experiments run on Adaboost included varying number of estimators, varying learning rate, and comparing learning rate vs the number of estimators in 3d contour plots. Adaboost has default learning rate of 1 - however this will slow down the adaptation of the model to training data. A max Abalone score around 30 estimators and a learning rate of 0.04 indicates that estimators have an equal voting power.

<figure class="image">
  <Image src="/images/project/machineLearning/boostingLearningRate.jpg" alt="boostingLearningRate">
  <figcaption>A clear max score around 35 estimators and a learning rate of 0.04</figcaption>
</figure>
<br />

### Support Vector Machines (SVM)

Support vector machines attempts to draw an optimal boundary that maximizes the margin width between different classes. Gutter lines define the max margin and go through points closest to the boundary. While ANN tries to reduce the error cost function, an SVM tries to maximize the margin while still classifying properly.

<figure class="image">
  <Image src="/images/project/machineLearning/svm.jpg" alt="support vector machine">
  <figcaption>Suppor</figcaption>
</figure>
<br />

Using `sklearn`'s support vector classifier, I plotted various hyperparameters including `gamma` (complexity of decision boundary), `C` (another parameter for decision boundary complexity), and several `kernel functions` (linear, rbf, poly).

One of the plots including comparing `gamma` vs c on a contour plot with scores. Generally a high gamma (like a low `k` in KNN) gives closer points more influence and creating a more complicated decision boundary. `C` acts similarly - a large value of `C` indicates a more complicated decision boundary. Often times the contour plots perfectly met intuition or expectations, but when I started plotting contour plots it's sometimes tricky for them to exactly match expectations. That's true for the contour plot below - in general the high value of these hyperparameters represents overfit areas - while the opposite corner represents underfit.

<figure class="image">
  <Image src="/images/project/machineLearning/gamma-c-scores-svm.jpg" alt="support vector machine">
  <figcaption>Another example of bias-variance tradeoff - max scores around a `gamma` of 3 and a `C` of 10</figcaption>
</figure>
<br />

### Comparison and Conclusion of Supervised Algorithms

No final comparison is complete without consideration of both test performance and runtimes. Boosting was the clear winner and outperforms all other algorithms for both datasets. The only issue is if you look at time, AdaBoost performs the worst. KNN and Decision Trees run the fastest.

<figure class="image">
  <Image src="/images/project/machineLearning/supervised-test-perf.jpg" alt="support vector machine">
  <figcaption>Boosting takes the cake!</figcaption>
</figure>
<br />

One of the key takeaways in all this is the `no free lunch theorem` where an algorithm that works well for one problem may not work well for other problems. Each algorithm includes its own inductive biases and complexities. The only way to find the right tool for the job is to find the optimal hyperparameters and plot the performance - in addition to consider running time performance.

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#93a1a1;border-spacing:0;}
.tg td{background-color:#fdf6e3;border-color:#93a1a1;border-style:solid;border-width:1px;color:#002b36;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#657b83;border-color:#93a1a1;border-style:solid;border-width:1px;color:#fdf6e3;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-wmk8{background-color:#ffffff;border-color:inherit;color:#329a9d;font-weight:bold;text-align:left;vertical-align:top}
.tg .tg-8nwd{background-color:#eee8d5;border-color:inherit;font-weight:bold;text-align:left;vertical-align:top}
.tg .tg-fymr{border-color:inherit;font-weight:bold;text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-wmk8">   <br>    </th>
    <th class="tg-wmk8">   <br>Inductive Bias   </th>
    <th class="tg-wmk8">   <br>Pros   </th>
    <th class="tg-wmk8">   <br>Cons   </th>
    <th class="tg-wmk8">   <br>Good at   </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-8nwd">   <br>KNN   </td>
    <td class="tg-8nwd">   <br>-Classes are similar to nearest   points   </td>
    <td class="tg-8nwd">   <br>-Intuitive<br>   <br>-Fast runtime<br>   <br>-Less prone to overfitting<br>   <br>-Limited parameter tuning   </td>
    <td class="tg-8nwd">   <br>-Difficulty to model complex<br>   <br>-Lazy learner is slow to predict   new instances<br>   <br>-Poor on high dimensional   datasets   </td>
    <td class="tg-8nwd">   <br>-Low-dimensional datasets   </td>
  </tr>
  <tr>
    <td class="tg-fymr">   <br>Decision Trees   </td>
    <td class="tg-fymr">   <br>-Shorter trees preferred over longer trees<br>   <br>-High information gain splits at the top   </td>
    <td class="tg-fymr">   <br>-Fast runtime<br>   <br>-Robust to noise or missing values<br>   <br>-Visually intuitive<br>   <br>-Fast training and prediction   </td>
    <td class="tg-fymr">   <br>-Possible duplication within tree<br>   <br>-Complex trees difficult to interpret and easy to start   overfitting   </td>
    <td class="tg-fymr">   <br>-Medical diagnosis<br>   <br>-Credit risk analysis<br>   <br>    </td>
  </tr>
  <tr>
    <td class="tg-8nwd">   <br>Artificial Neural Networks   </td>
    <td class="tg-8nwd">   <br>-Smooth interpolation between   data points<br>   <br>-Bias towards minima via gradient   descent   </td>
    <td class="tg-8nwd">   <br>-Can model complex relationships<br>   <br>-Can separate signal from noise   </td>
    <td class="tg-8nwd">   <br>-Can overfit<br>   <br>-Potential for long training   times<br>   <br>-Black box<br>   <br>-Many parameters to tune   </td>
    <td class="tg-8nwd">   <br>-High dimensional datasets like   images<br>   <br>    </td>
  </tr>
  <tr>
    <td class="tg-fymr">   <br>Boosting (AdaBoost)   </td>
    <td class="tg-fymr">   <br>-Ensembles reduce the bias of individual learners   </td>
    <td class="tg-fymr">   <br>-Flexibility to choose any type of weak learner<br>   <br>-Provable effectively given it picks a weak learner<br>   <br>-Increases margin which improves margin with additional learners<br>   <br>-Reduces overfitting<br>   <br>    </td>
    <td class="tg-fymr">   <br>-Weak classifiers that are too complex lead to overfitting<br>   <br>-Vulnerable to noise<br>   <br>-Training is slow   </td>
    <td class="tg-fymr">   <br>-Problems with lack of performance due to individual model   instability   </td>
  </tr>
  <tr>
    <td class="tg-8nwd">   <br>Support Vector Machines   </td>
    <td class="tg-8nwd">   <br>-Classes separated by wide margins   </td>
    <td class="tg-8nwd">   <br>-Can model complex relationships<br>   <br>-Maximizing margins makes it   robust to noise   </td>
    <td class="tg-8nwd">   <br>-Parameters non-intuitive<br>   <br>-Long runtime<br>   <br>-Does not perform well for large   or imbalanced class datasets   </td>
    <td class="tg-8nwd">   <br>-Work well in complicated domains   with clear margin or separation.<br>   <br>    </td>
  </tr>
</tbody>
</table>

<blockquote> Future ML algorithm discussion coming... </blockquote>

## Unsupervised - Randomized Optimization

## Unsupervised - Dimensionality reduction Algorithms

## Markov Decision Processes - Reinforcement Learning

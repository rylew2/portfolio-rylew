---
title: "Machine Learning Part 3: Unsupervised Learning & Dimensionality Reduction"
date: "2019-06"
slug: "ml-part-3-unsupervised"
selectedWork: true
description: "Exploring clustering, Gaussian mixtures, and dimensionality reduction methods (PCA, ICA, RP, RF) on the Wine and Abalone datasets."
previewImage: "/images/project/machineLearning/unsupervised/cover.png"
sourceCode: "https://github.com/rylew2/Machine-Learning-Assignments"
tags:
  - python
  - sklearn
  - machine learning
  - clustering
  - dimensionality reduction
  - omscs
---

1️⃣ [Part 1: Supervised Learning & Neural Networks](/projects/ml-part-1-supervised)
2️⃣ [Part 2: Randomized Optimization](/projects/ml-part-2-unsupervised)
3️⃣ **Part 3: Unsupervised Learning & Dimensionality Reduction**
4️⃣ (Coming soon)

## Introduction

In this part of the Machine Learning series, I explored **unsupervised learning** through clustering algorithms and dimensionality reduction techniques.
The focus was on:

- **K-Means** and **Gaussian Mixture Models (GMM)**
- **PCA**, **ICA**, **Random Projection**, and **Random Forest feature selection**
- Evaluating model quality with:
  - **Silhouette score**
  - **Cluster label accuracy**
  - **Log likelihood**
- And finally, using **reduced-dimension features as inputs to a neural network**

Two datasets were used:
- **Wine Quality** (binary classification, chemical properties)
- **Abalone** (predicting shell age via physical measurements)

---

## Part 1: Baseline Clustering Performance

Before applying dimensionality reduction, I evaluated how K-Means and GMM behave on the raw datasets.
A key observation across all runs:
➡️ As cluster count increases, **silhouette scores decrease**, which is expected as cluster spacing compresses.

### Abalone Baseline Silhouette Scores
This plot shows how K-Means performance steadily declines with increasing cluster count.

![Abalone Silhouette Baseline](/images/project/machineLearning/unsupervised3/abalone-silhouette-base.png)

---

## Part 2: Dimensionality Reduction

Each dimensionality reduction technique transforms the feature space in a different way:

- **PCA:** Maximizes variance retention
- **ICA:** Extracts statistically independent components
- **Random Projection:** Compresses dimensions with Johnson–Lindenstrauss guarantees
- **Random Forest Selection:** Selects top features via Gini importance ranking

The goal was to see whether these transformations help clustering algorithms find more meaningful structure.

---

## Part 3: Clustering on Reduced Dimensions

### Wine – Silhouette Score Comparison
Random Projection surprisingly produces the most distinct clusters early on, likely due to breaking noisy correlations.

![Wine Silhouette](/images/project/machineLearning/unsupervised3/wine-silhouette.png)

### Wine – Cluster Label Accuracy (K-Means)
Random Forest feature selection slightly outperforms the other approaches, suggesting that filtering noisy features is more valuable than rotating or projecting them.

![Wine KMeans Accuracy](/images/project/machineLearning/unsupervised3/wine-kmeans-accuracy.png)

---

## Part 4: GMM Performance on Reduced Data

Gaussian Mixture Models reveal differences that K-Means can’t capture — particularly on the Wine dataset where clusters overlap.

### Wine – GMM Label Accuracy
RF again yields the best or near-best cluster labeling performance.

![Wine GMM Accuracy](/images/project/machineLearning/unsupervised3/wine-gmm-accuracy.png)

---

## Part 5: Abalone – DR Performance Highlights

While the Wine dataset benefited from dimensionality reduction, Abalone is noisier and lower dimensional.
Differences across methods were minimal, except ICA, which performed noticeably worse across all metrics.

### Abalone – Silhouette Comparison With DR
You can see ICA struggling to form meaningful clusters compared to PCA, RP, or RF.

!

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

- **Wine Quality** (binary classification from chemical properties)
- **Abalone** (predicting age from physical measurements)

---

## Part 1: Baseline Clustering Performance

Before applying dimensionality reduction, I evaluated how K-Means and GMM perform on the **raw datasets**.

A consistent pattern emerged:
As the number of clusters increases, **silhouette scores drop** — clusters naturally become more compressed.

### Abalone – Baseline Silhouette Scores

![Abalone Silhouette Baseline](/images/project/machineLearning/unsupervised/silhoette-baseline.png)

---

## Part 2: Dimensionality Reduction

Each dimensionality reduction method reshapes the feature space differently:

- **PCA** rotates the data to maximize variance retention
- **ICA** attempts to separate statistically independent signals
- **Random Projection (RP)** compresses dimensionality with JL guarantees
- **Random Forest (RF)** selects features based on importance (Gini)

The goal was to see whether these transforms help clustering uncover more meaningful patterns.

---

## Part 3: Clustering on Reduced Dimensions

### Wine – Silhouette Score Comparison

Random Projection surprisingly produces the most distinct clusters early on, likely because it breaks noisy feature correlations.

![Wine Silhouette](/images/project/machineLearning/unsupervised/wine-silhouette.png)

### Abalone – Silhouette Score Comparison

Abalone is noisier, so improvement is more modest, but ICA consistently underperforms.

![Abalone Silhouette](/images/project/machineLearning/unsupervised/abalone-silhouette.png)

---

### Wine – K-Means Cluster Label Accuracy

Random Forest feature selection slightly outperforms other DR methods, suggesting that filtering noisy features helps more than rotating or projecting them.

![Wine KMeans Accuracy](/images/project/machineLearning/unsupervised/wine-kmeans-accuracy.png)

---

## Part 4: GMM Performance on Reduced Data

Gaussian Mixture Models capture cluster shape better than K-Means, especially where clusters overlap — like in the Wine dataset.

### Wine – GMM Label Accuracy

RF again yields the strongest or near-strongest accuracy across cluster sizes.

![Wine GMM Accuracy](/images/project/machineLearning/unsupervised/wine-gmm-accuracy.png)

---

## Part 5: Abalone – DR Performance Highlights

While Wine benefits noticeably from DR, **Abalone is lower-dimensional and noisier**, meaning differences across DR methods were smaller.

The one clear takeaway:
**ICA consistently performs the worst**, both in silhouette and label accuracy.

### Abalone – Silhouette Comparison With DR

Visible struggle from ICA compared to PCA, RP, or RF.

![Abalone DR Silhouette](/images/project/machineLearning/unsupervised/abalone-dr-silhouette.png)

---

## Part 6: Neural Network Performance on DR + Cluster Features

Finally, I trained a small neural network using:

- **Original features**
- **PCA-reduced features**
- **ICA-reduced features**
- **RP-reduced features**
- **RF-selected features**
- **Cluster assignments as features (K-Means labels)**

Two key observations emerged:

1. **RF-selected features almost always gave the best NN test accuracy.**
   This aligns with the idea that removing noisy or irrelevant features is more valuable than transforming all features.

2. **Cluster labels as features** produce the **fastest runtime**, but **lower accuracy**, since cluster IDs alone lose too much information.

### Abalone – NN Performance on DR Feature Sets

![Abalone NN Performance](/images/project/machineLearning/unsupervised/abalone-nn-performance.png)

### Abalone – NN Mean Fit Time

![Abalone NN Fit Time](/images/project/machineLearning/unsupervised/abalone-nn-fit-time.png)

---

## Conclusion

Across both datasets, dimensionality reduction had **mixed but insightful effects**:

### 🔹 Wine Dataset

- **RF feature selection** provided the strongest performance for both K-Means and GMM.
- **Random Projection** produced the highest silhouette scores early on.
- Dimensionality reduction clearly improved cluster stability and separability.

### 🔹 Abalone Dataset

- Much **less improvement** across techniques — the dataset is noisy and nearly low-dimensional already.
- **ICA performed the worst** in every metric.
- RF and PCA were modestly better, but gains were small.

### 🔹 Neural Networks on Reduced Data

- **RF-selected features consistently produced the best test accuracy.**
- **Cluster labels as features** offered fast runtime but weaker predictive performance.

### 🧠 Final Takeaway

This part of the project reinforced the No Free Lunch Theorem:
 *No single dimensionality reduction technique is universally best.*

Performance depends heavily on dataset structure:

- Wine has correlated chemical signals → benefits from DR.
- Abalone is noisy and low-dimensional → DR offers limited gains.

Next steps could include exploring **UMAP**, **t-SNE**, or **autoencoders** to further reduce dimensionality in more expressive ways.

---
title: GitHub Browser
date: "2017-06"
slug: "github-browser"
selectedWork: true
description: "Dashboard to visualize GitHub repositories, code languages used, and connections to other repos."
previewImage: "/images/project/githubBrowser/githubBrowser.jpg"
liveSite: "http://rylew2.github.io/"
sourceCode: "https://github.com/rylew2/rylew2.github.io"
tags:
  - angular
  - javascript
  - d3
---

The GitHub browser is a simple single page app built in Angular that lets users search and visualize a breakdown of repositories for a given user. The idea was to explore developing single page apps in combination with a data-rich API like GitHub. The utility of creating a browser stems from the fact that repositories typically have multiple contributors, making navigation through different users' repositories straightforward to implement. This project used only a portion of the GitHub API data, and it still had a fair amount of data to visualize.

![High level view of GitHub Browser flow](/images/project/githubBrowser/githubBrowser-diagram.jpg)

As shown above, the actual API call is done on a lightweight Express server deployed to Heroku that proxies our requests from the client to the GitHub API. This intermediate server also allows us to safely store and use the OAuth App client ID and secret credentials.

## GitHub API Request Limit

API requests can be made directly from the browser to GitHub without encountering any Cross-Origin Resource Sharing (CORS) issues (the GitHub API returns `access-control-allow-origin: *`). The problem is both that there is an API call limit and that we can't store the OAuth credentials on the client — the only safe calls from the client would have to be unauthenticated — which would only let us view a couple of users or repos before hitting the limit (each route has multiple API calls). The [unauthenticated limit is 60 calls per hour](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#:~:text=For%20unauthenticated%20requests%2C%20the%20rate,has%20custom%20rate%20limit%20rules.&text=The%20maximum%20number%20of%20requests,permitted%20to%20make%20per%20hour.). We can actually see that limit shown in a returned HTTP header `X-RateLimit-Limit` and `X-RateLimit-Remaining`. Meanwhile the authenticated limit is 5,000 — plenty sufficient for a small project like this.

Passing just the clientID and clientSecret from the lightweight Express server to the GitHub API doesn't technically "authenticate" the calls — it simply identifies what OAuth application is being represented — which in turn increases our API rate limit. However, the docs indicate this is ok in server-to-server scenarios like this.

## The Browser

The browser simply lets you:

1. Search for a user's repo
2. View the code language breakdown for a given user's repo
3. View individual repo contributors and identify who the top contributors by file additions and deletions are

![Microsoft's repos and their language breakdowns](/images/project/githubBrowser/microsoft.png)

Given more time, I plan to refine the styling, potentially upgrading to Emotion or Styled Components. I'd also like to implement a proper client OAuth login authorization and access token flow — possibly in another post. Using this we might be able to have another route viewing data about the user's own repos, including private ones.

In addition there's plenty more GitHub API data — as can be seen from the hypermedia HATEOAS resource links that we get with high-level API requests to users and repos for example.

![An example HATEOAS hyperlinks to all the API endpoints](/images/project/githubBrowser/postmanExample.png)

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

The GitHub browser is a simple single page app built in Angular that lets users search and visualize a breakdown of repositories for a given user. The idea was to explore developing single page apps in combination with a data-rich API like GitHub. What makes the idea of creating a browser useful is the fact that repos usually have more than one contributor - so browsing to different user's repos was a breeze to setup. This project used only a portion of the Github API data, and it still had a fair amount of data visualize.

<figure class="image">
  <img src="/images/project/githubBrowser/githubBrowser-diagram.jpg" alt="high level view of GitHub browser">
  <figcaption>High level view of GitHub Browser flow </figcaption>
</figure>

As shown here, the actual API call is done on a lightweight Express server deployed to Heroku that proxies our requests from the client to the GitHub API. This intermediate server also allows us to safely store and use the OAuth App client ID and secret credentials.

## GitHub API Request Limit

API Requests can be made from the browser without any CORS issues (the GitHub API returns `access-control-allow-origin: *`). The problem is that we can't store the credentials on the client, therefore calls from the client would have to be unauthenticated. The <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#:~:text=For%20unauthenticated%20requests%2C%20the%20rate,has%20custom%20rate%20limit%20rules.&text=The%20maximum%20number%20of%20requests,permitted%20to%20make%20per%20hour." target="_blank">unauthenticated limit is 60 calls per hour</a> - which will show in a returned HTTP header `X-RateLimit-Limit` and `X-RateLimit-Remaining`. Meanwhile the authenticated limit is 5,000 - plenty sufficient for a small project like this.



## The Browser

The browser simply lets you:
  1. Search for a user's repo
  2. View the code language breakdown for a given user's repo
  3. View individual repo contributors and identify who the top contributors by file additions and deletions are

<figure class="image">
  <img src="/images/project/githubBrowser/microsoft.png" alt="high level view of GitHub browser">
  <figcaption>Microsoft's repos and their language breakdowns</figcaption>
</figure>


As more time allows I'd like to fix some of the styling - possibly upgrade to Emotion or Styled Components. I'd also liked to implement a proper client OAuth login and access token flow - possibly in another post. 

In addition there's plenty more GitHub API data - as can be seen from the hypermedia HATEOAS resource links that we get with high level API requests to users and repos for example.


<figure class="image">
  <img src="/images/project/githubBrowser/postmanExample.png" alt="high level view of GitHub browser">
  <figcaption>An example HATEOAS hyperlinks to all the addition resources</figcaption>
</figure>

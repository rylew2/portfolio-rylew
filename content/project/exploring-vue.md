---
title: Exploring VueJS
date: "2021-07"
slug: "exploring-vue"
selectedWork: false
description: "Foray into the world of Vue."
previewImage: "/images/project/githubBrowser/githubBrowser.jpg"
liveSite: "https://romantic-yonath-ba35e7.netlify.app/"
sourceCode: "https://github.com/rylew2/near-earth-objects-vue2"
tags:
  - vue
  - javascript
---

The GitHub browser is a simple single page app built in Angular that lets users search and visualize a breakdown of repositories for a given user. The idea was to explore developing single page apps in combination with a data-rich API like GitHub. What makes the idea of creating a browser useful is the fact that repos usually have more than one contributor - so browsing to different user's repos was a breeze to setup. This project used only a portion of the Github API data, and it still had a fair amount of data visualize.

<figure class="image">
  <Image src="/images/project/githubBrowser/githubBrowser-diagram.jpg" alt="high level view of GitHub browser">
  <figcaption>High level view of GitHub Browser flow </figcaption>
</figure>

As shown here, the actual API call is done on a lightweight Express server deployed to Heroku that proxies our requests from the client to the GitHub API. This intermediate server also allows us to safely store and use the OAuth App client ID and secret credentials.

## GitHub API Request Limit

API Requests can be made from the browser to GitHub without any CORS issues (the GitHub API returns `access-control-allow-origin: *`). The problem is both that there is an API call limit and that we can't store the OAuth credentials on the client - the only safe calls from the client would have to be unauthenticated - which would only let us view a couple of users or repos before hitting the limit (each route has multiple API calls). The <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#:~:text=For%20unauthenticated%20requests%2C%20the%20rate,has%20custom%20rate%20limit%20rules.&text=The%20maximum%20number%20of%20requests,permitted%20to%20make%20per%20hour." target="_blank">unauthenticated limit is 60 calls per hour</a>. We can actually see that limit shown in a returned HTTP header `X-RateLimit-Limit` and `X-RateLimit-Remaining`. Meanwhile the authenticated limit is 5,000 - plenty sufficient for a small project like this.

Passing just the clientID and clientSecret from the lightweight Express server to the GitHub API doesn't technically "authenticate" the calls - it simply identifies what OAuth application is being represented - which in turn increase our API rate limit. However, the docs indicate this is ok in server to server scenarios like this.

## The Browser

The browser simply lets you:

1. Search for a user's repo
2. View the code language breakdown for a given user's repo
3. View individual repo contributors and identify who the top contributors by file additions and deletions are

<figure class="image">
  <Image src="/images/project/githubBrowser/microsoft.png" alt="high level view of GitHub browser">
  <figcaption>Microsoft's repos and their language breakdowns</figcaption>
</figure>

As more time allows I'd like to fix some of the styling - possibly upgrade to Emotion or Styled Components. I'd also liked to implement a proper client OAuth login authorization and access token flow - possibly in another post. Using this we might be able to have another route viewing data about the user's own repos, including private ones.

In addition there's plenty more GitHub API data - as can be seen from the hypermedia HATEOAS resource links that we get with high level API requests to users and repos for example.

<figure class="image">
  <Image src="/images/project/githubBrowser/postmanExample.png" alt="high level view of GitHub browser">
  <figcaption>An example HATEOAS hyperlinks to all the API endpoints</figcaption>
</figure>

---
title: Building a React SharePoint starter kit
date: "2020-06"
slug: "sharepoint-react"
selectedWork: true
description: "Building a template to deploy React solutions built on top of SharePoint."
previewImage: "/images/project/sharepoint-cra-starter/react.png"
tags:
  - react
  - javascript
---

<blockquote>Coming soon... (March 2021)</blockquote>

Microsoft's enterprise content management platform `SharePoint` gives teams a space to collaborate on files, workflows, and general information sites. There are a multitude of different ways to extend the platform, depending on what version of SharePoint and type of site. Anything from a simple in-page Content Editor Web Part with HTML/CSS/JavaScript all the way up to the more modern React [SPFx development model.](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview) Often times we would allow users to manage their own data in one or more SharePoint Lists that would serve as the backend for a React UI front end. When deploying these types of apps I would often run into a couple situations where:

1.  We wanted to define the look and feel without having to adjust the Master Page / Page Layout
2.  We wanted to rapidly iterate on a single page app with React if SPFx development wasn't available. Or circumvent deploying through the app model entirely.
3.  We wanted to be able to deploy a Create React App build folder automatically to SharePoint from the command line

This led to the development of a starter kit based on Create React App (CRA) that we could quickly iterate on and deploy to SharePoint. Starting from the basic CRA template, I will walk through the some of the key configuration steps to achieve a more seamless SharePoint development workflow that is able to pull in data.

# Setting up the Proxy Server

In order to make requests from localhost to SharePoint (via the SharePoint API) and avoid CORS requests (usually disabled on IIS Web Front End Servers) - we need to a way to configure

This configuration here was largely based on the great work by [@koltyakov](https://github.com/koltyakov) setting up a [SharePoint API proxy server using his sp-rest-proxy package](https://www.linkedin.com/pulse/getting-started-react-local-development-sharepoint-andrew-koltyakov/) to allow for concurrent servers to run locally. Completing that guide would yield the following file:

<blockquote> <a href="[google.com](https://github.com/rylew2/sharepoint-cra-starter)">./proxyserver/api-server.js</a> </blockquote>
```js
const RestProxy = require('sp-rest-proxy');

const settings = {  
 port: 8081
};

const restProxy = new RestProxy(settings);  
restProxy.serve();

````


To

[insert image here]




### 2) Setting up the appropriate package.json config to be able to concurrently start the Webpack and the proxy server.
 In addition to all the dependences, [my package.json has some additional features ](https://github.com/rylew2/sharepoint-cra-starter/blob/master/package.json) that I'll touch on:
	 - Ensure homepage is set to the root so that the build folder (discussed later)
	 - Set the Webpack server to point to the proxy
```js
"homepage": "./",
"proxy": "http://localhost:8081",
"devDependencies": {
	"@rescripts/cli": "0.0.14",
	"gulp": "^4.0.2",
	"sppurge": "^2.2.0",
	"spsave": "^3.1.6"
}
````

- rescripts renaming files
- gulp to run automatic upload

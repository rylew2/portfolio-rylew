---
title: Building a starter kit template for iterating on a SharePoint Create-React-App solution
date: "2020-06"
slug: "sharepoint-react"
selectedWork: true
description: "Building a template to deploy React solutions built on top of SharePoint."
previewImage: "/images/project/cap/react.png"
---

<blockquote>Coming soon... (March 2021)</blockquote>

Microsoft's enterprise content management platform `SharePoint` - gives teams a space to collaborate on files, workflows, and general information websites . There are a multitude of different ways to extend the platform, depending on what version of SharePoint, from a simple in-page Content Editor Web Part with HTML/CSS/JavaScript all the way up to the more modern React [SPFx development model.](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview) Often times we would expose data for users to manage in one or more SharePoint Lists that the would serve as the backend for a React UI front end.  When deploying these types of apps I would often run into a couple situations:

 1. We wanted to define the look and feel without having to adjust the Master Page / Page Layout 
 2. We wanted to rapidly iterate on a single page app with React if SPFx development wasn't available 
	 2a) We wanted to circumvent deploying through the "app model entirely


This led to the development of a starter kit based on Create React App (CRA) that we could quickly iterate on and deploy to SharePoint. Starting from the basic CRA template, I will walk through the steps on settings this up. 

# Setting up the Proxy Server
In order to make requests from the localhost and avoid CORS requests (usually disabled on the IIS Web Front End Servers) - we need to  

 This was largely based on the great work by [@koltyakov](https://github.com/koltyakov) setting up a [CRA proxy using his sp-rest-proxy package](https://www.linkedin.com/pulse/getting-started-react-local-development-sharepoint-andrew-koltyakov/) to allow for concurrent servers to run locally. Following that guide achieves the following:
 
 1. Setting up the API Proxy Server through which API requests will be made ( `./proxyserver/api-server.js` in my repo)
```js
const RestProxy = require('sp-rest-proxy');

const settings = {  
  port: 8081
};

const restProxy = new RestProxy(settings);  
restProxy.serve();
```


 2. Setting up the appropriate package.json config to be able to concurrently start the webpack server and proxy server. My package.json has some additional features that I'll touch on:

```js
const RestProxy = require('sp-rest-proxy');

const settings = {  
  port: 8081
};

const restProxy = new RestProxy(settings);  
restProxy.serve();
```



 3. 

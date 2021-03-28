---
title: Building a React SharePoint starter kit
date: "2020-06"
slug: "sharepoint-react"
selectedWork: true
description: "Building a template to deploy React solutions built on top of SharePoint."
previewImage: "/images/project/sharepoint-cra-starter/react.png"
sourceCode: "https://github.com/rylew2/sharepoint-cra-starter"
tags:
  - react
  - javascript
---

<blockquote>Coming soon... (March 2021)</blockquote>

  
Microsoft's enterprise content management platform `SharePoint` gives teams a space to collaborate on files, workflows, and general resource sites. There are a multitude of different ways to extend the platform, depending on what version of SharePoint and type of site being used. Anything from a simple in-page Content Editor Web Part with HTML/CSS/JavaScript all the way up to the more modern React [SPFx development model.](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview) Often times we would allow users to manage their own data in one or more SharePoint Lists that would serve as the backend for a React UI front end. When deploying these types of apps I would often run into a couple situations where:

  
1. We wanted to define the look and feel without having to adjust the Master Page / Page Layout

2. We wanted to rapidly iterate on a single page app with React if SPFx development wasn't available. Or circumvent deploying through the app model entirely.

3. We wanted to be able to deploy a Create React App build folder automatically to SharePoint from the command line

This led to the development of a starter kit based on Create React App (CRA) that we could quickly iterate on and deploy to SharePoint. Starting from the basic CRA template, I will walk through the some of the key configuration steps to achieve a more seamless SharePoint development workflow that is able to pull in data.

  

## Setting up the Proxy Server

  
In order to make requests from localhost to SharePoint Lists (via the SharePoint API) and avoid cross-origin-resource-sharing issues (CORS is usually disabled on IIS Web Front End Servers) - we need to proxy API requests. 


The configuration here was largely based on the great work by [@koltyakov](https://github.com/koltyakov) setting up a [SharePoint API proxy server using his sp-rest-proxy package](https://www.linkedin.com/pulse/getting-started-react-local-development-sharepoint-andrew-koltyakov/). This allows a webpack dev server and a Proxy API Server to run concurrently. Completing that guide would yield the following file:

  

<blockquote>  <a  href="[https://github.com/rylew2/sharepoint-cra-starter/blob/master/package.json](https://github.com/rylew2/sharepoint-cra-starter)">./proxyserver/api-server.js</a>  </blockquote>

```js
const RestProxy = require('sp-rest-proxy');
const settings = {
	port: 8081
};
const restProxy = new RestProxy(settings);
restProxy.serve();
````

Once this is up - you can add the proxy line to your `devDependencies` and run `npm run proxy` to configure your credentials in `private.json`:
```js
	"proxy": "node ./proxyserver/api-server.js",
```
<blockquote>Be sure to include `./config/private.json`in your .gitignore!</blockquote>

 Now with the API Proxy server setup, the `concurrently`  package installed,  and the `startServers` command in the pacakge.json scripts section - we can run two servers simultaneously. The end result will look like this.

 
[insert  diagram image here]

With the proxy server setup - you can actually visit `localhost:8081` and type in URL relative API endpoints to verify its working.

## Making an API Call
To make an API call, we're simply using the `@pnp/sp` package  ( the documentation for <a href="https://pnp.github.io/pnpjs/sp/lists/">PnPJS accessing lists is pretty good.)<a/> 

There are a couple ways to approach the initial setup of the PnPJS package - but here I'm using the `sp.setup()` one-time call in my App component's `componentDidMount`- it could similarly be done in a Nav type component. 

```js
let  hostStr = "";
if (process.env.NODE_ENV === "development") {
//for local dev
	hostStr = process.env.REACT_APP_RELATIVE_URL;
} else  if (process.env.NODE_ENV === "production") {
	//for production build
	hostStr = process.env.REACT_APP_PROD;
}
sp.setup({
	ie11:  true, //required for legacy IE11 API calls
	sp: {
		headers: {
			Accept:  "appliation/json;odata=verbose", 
	     },
	 baseUrl:  hostStr,
	},
});
```
We can also set environment variables in our project in a `.env` file :
```bash
# UAT AND PROD will be root of site 
REACT_APP_UAT = http://my-sharepoint-uat.com/sites/mysite
REACT_APP_PROD = http://my-sharepoint-prod.com/sites/mysite
  
# Set a folder to upload to
REACT_APP_PROJECT_TITLE = sharepoint-cra-starter
  
# For PnP JS sp.setup() onetime call
REACT_APP_RELATIVE_URL = /sites/mysite
```

After the `sp.setup` call - we should be able to make List API calls anywhere in our app:
```js
let  spList = "MyTestList"; //rename to your own list
let  items = await  sp.web.lists
	.getByTitle(spList)
	.items.select("Id", "Title", "Description")
	.orderBy("Id")
	.get();
console.log(items ? items : "none");
```  
     
## Finalizing Configuration for Deployment
One of the pain points with deploying a single page app like this that exists, outside of the SharePoint app model, is that you normally would need to `npm run build` the CRA project, then *manually* upload the build folder to <**YourProjectFolder**> on the SharePoint site . This was a bit frustrating so I looked at writing a script to upload the build folder for us.

You can see that `upload.js` <a href="https://github.com/rylew2/sharepoint-cra-starter/blob/master/deploytools/upload.js">full script in my repo here</a> .  The code there performs the following two steps:

 1. Delete all files in the `/static/js` of the build folder on SharePoint (if it was previously uploaded). (using the `sppurge` package)
 2. Upload and overwrite the entire build folder on SharePoint (using the `spsave` package)

To run this upload script, we would need to add `gulp`, `spsave`, and `sppurge` to the `devDependencies`. Once those packages are in place, you should be able to at least attempt the upload to SharePoint with the following added to` package.json` scripts:
```js 
	"upload": "node ./deploytools/upload.js",
```

## Fixing Tilde in Files the Build Folder for SP2013
One of the catches here when working specifically with SP 2013 is that it does not allow filenames with tilde `~` characters to be uploaded to the site. To fix this we could eject CRA and try to configure ourselves - however I found it much easier to use a package to reconfigure. The more popular <a href="https://github.com/timarney/react-app-rewired#readme">`react-app-rewired`</a> or <a href="https://github.com/gsoft-inc/craco">`craco`</a> packages might have done the job here, however I ended up using <a href="https://github.com/harrysolovay/rescripts">`rescripts`</a>. 

When trying to upload the project, you might run into an issue like this:
<blockquote>```
The file or folder name \\\"MyProject/static/js/runtime~main.d653cc00.js\\\" contains invalid characters. Please use a different name. Common invalid characters include the following # % & * : < > ? / { | }
```</blockquote>


You therefore need to add the rescripts package to `devDependencies` and create a `./rescriptsrc.json` file:
```js 
	"@rescripts/cli": "0.0.14",
```
```js
module.exports = (config) => {
	config.optimization.splitChunks.automaticNameDelimiter = "_";
	if (config.optimization.runtimeChunk) {
		config.optimization.runtimeChunk = {
		name: (entrypoint) =>  `runtime_${entrypoint.name}`,
     };
   }
   return  config;
};
```
At this point, when we run `npm run upload` we should be able to successfully save/upload all files to our SharePoint specified folder

## Routing with the HashRouter
When we upload to SharePoint, the app needs to simply run for users from `./index.html` without a server.  Routing simply does not work like this out of the box. Therefore , we need to use <a href="https://reactrouter.com/web/api/HashRouter">`HashRouter`</a>   . This will add a `#` character to all of our routes. 

Assuming you have `react-router-dom` installed, the simple routing setup (which I've included in my repo) looks like the following:
```js
//index.js
import { HashRouter } from  "react-router-dom";
ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<App  />
		</HashRouter>
	</React.StrictMode>,
document.getElementById("root")
);
```
```js
//App.js
<Switch>
	<Route  exact  path="/"  component={Home}  />
	<Route  path="/sampleroute1"  component={SampleRoute1}  />
	<Route  path="/sampleroute2"  component={SampleRoute2}  />
</Switch>
```
The one final configuration HashRouter needs is to have the homepage specified in `package.json`:
```js
"homepage": "./",
```


## IE11 Legacy Support
If you'd like to support the older IE11 browser, one simple update would be to install the `react-app-polyfill` and include in `index.js` :

```js
//index.js
import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
```

## Summary
You can view the full list of packages in my <a href="https://github.com/rylew2/sharepoint-cra-starter/blob/master/package.json">package.json</a> . If everything is configured properly - you should have a Create React App application that can:

 1. Build and save/upload a React application to SharePoint
 2. Make API calls from both localhost, and the SharePoint deployed folder
 3.  Have Routing working in your build folder without the need for a http server

The end goal of this project was simply to be able to focus on building the React app that could leverage SharePoint List data - without having to deal with some of the out of the box traditional SharePoint development features that can be a bit of a hinderance. The end result for our team was being able to more rapidly iterate and deploy solutions - and ultimately being able to focus more on our clients needs.

There is probably additional work or possible improvements that could be made. Feel free to make pull requests or raise issues on the repo. I hope this guide has helped - it turned out to be quite useful in rapidly iterating on

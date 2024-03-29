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

`SharePoint`, Microsoft's enterprise content management platform, enables teams to collaborate on files, workflows, and resources. Its extensibility varies based on the SharePoint version and site type, ranging from simple in-page web parts to the React-based  <ins><a target="_blank" href="https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview">SPFx development model</a></ins>. Oftentimes we would allow users to manage their own data in one or more SharePoint Lists that would serve as the backend for a React UI front end. When deploying these types of apps I would often run into a couple situations where:

1. We wanted to define the look and feel without having to adjust the Master Page / Page Layout

2. We wanted to rapidly iterate on a single page app with React if SPFx development wasn't available. Or circumvent deploying through the app model entirely.

3. We wanted to be able to deploy a Create React App build folder automatically to SharePoint from the command line

This led to the development of a starter kit based on Create React App (CRA) that we used to quickly iterate on and deploy to SharePoint. Starting from the basic CRA template, I will walk through the some of the key configuration steps to achieve a more seamless SharePoint development workflow that is able to pull in data.

<figure class="image">
  <Image src="/images/project/sharepoint-cra-starter/deploy.jpeg" alt="Deployment model">
  <figcaption>High level view of what we will be setting up</figcaption>
</figure>
<br>

## Setting up the Proxy Server

In order to make requests from localhost to SharePoint Lists (via the SharePoint API) and avoid cross-originr resource sharing issues (CORS is usually disabled on IIS Web Front End Servers) - we need to proxy API requests.

The configuration here was largely based on the great work by <ins><a target="_blank" href="https://github.com/koltyakov">@koltyakov</a></ins> setting up a <ins><a target="_blank" href="https://www.linkedin.com/pulse/getting-started-react-local-development-sharepoint-andrew-koltyakov/">SharePoint API proxy server using his sp-rest-proxy package</a></ins>. This allows a webpack dev server and a Proxy API Server to run concurrently. I recommend completing that simple walkthrough first - once you have that setup you should have the following file:

<blockquote>  <ins><a target="_blank" href="https://github.com/rylew2/sharepoint-cra-starter/blob/master/package.json">./proxyserver/api-server.js</a></ins>  </blockquote>

```js
const RestProxy = require("sp-rest-proxy");
const settings = {
  port: 8081,
};
const restProxy = new RestProxy(settings);
restProxy.serve();
```

Once this is up - you can add the proxy line to your `devDependencies` and run `npm run proxy` to configure your credentials (as described in the linked guide above) in `private.json`:

```js
	"proxy": "node ./proxyserver/api-server.js",
```

<blockquote>Be sure to include ./config/private.json in your .gitignore!</blockquote>

Now with the API Proxy server setup, the `concurrently` package installed, and the `startServers` command in the `package.json` scripts section - we can run two servers simultaneously with `npm run startServers`.

<figure class="image">
  <Image src="/images/project/sharepoint-cra-starter/sharepoint-cra-starter.jpeg" alt="deployment model">
  <figcaption>Target state development and deployment model</figcaption>
</figure>
<br />

With the proxy server setup - you can actually run `npm run proxy` and visit `localhost:8081` and type in URL relative SharePoint API endpoints to verify its working.

## Making an API Call

To make an API call, we're simply using the `@pnp/sp` package ( the documentation for <ins><a target="_blank" href="https://pnp.github.io/pnpjs/sp/lists/">PnPJS accessing lists is pretty good.)</a></ins>

There are a couple of ways to approach the initial setup of the PnPJS package - but here I'm using the `sp.setup()` one-time call in my App `componentDidMount`- it could similarly be done in a Nav component.

```js
let hostStr = "";
if (process.env.NODE_ENV === "development") {
  //for local dev
  hostStr = process.env.REACT_APP_RELATIVE_URL;
} else if (process.env.NODE_ENV === "production") {
  //for production build
  hostStr = process.env.REACT_APP_PROD;
}
sp.setup({
  ie11: true, //required for legacy IE11 API calls
  sp: {
    headers: {
      Accept: "appliation/json;odata=verbose",
    },
    baseUrl: hostStr,
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
// App.js
let spList = "MyTestList"; //rename to your own list
let items = await sp.web.lists
  .getByTitle(spList)
  .items.select("Id", "Title", "Description")
  .orderBy("Id")
  .get();
console.log(items ? items : "none");
```

<br>

## Finalizing Configuration for Deployment

A pain point in deploying a single-page app like this, that exists outside of the SharePoint app model, is that you normally would need to `npm run build` the CRA project, then _manually_ upload the build folder to <**YourProjectFolder**> on the SharePoint site . This was a bit of a nuisance, so I looked at writing a script to upload the build folder for us.

You can see the result `upload.js` <ins><a target="_blank" href="https://github.com/rylew2/sharepoint-cra-starter/blob/master/deploytools/upload.js">as a full script in my repo here</a></ins> . The upload code performs the following two steps:

1.  Delete all files in the `/static/js` of the build folder on SharePoint (if it was previously uploaded). (using the `sppurge` package)
2.  Upload and overwrite the entire build folder on SharePoint (using the `spsave` package)

To run this upload script, we would need to add `gulp`, `spsave`, and `sppurge` to the `devDependencies`. Once those packages are in place, you should be able to at least attempt the upload to SharePoint with the following added to` package.json` scripts:

```js
	"upload": "node ./deploytools/upload.js",
	"uploadUAT": "node ./deploytools/uploadUAT.js",
```

You can optionally define a second upload script to point to your UAT site.
<br>

## Fixing Tilde in Build Folder Files for SP2013

One of the catches here when working specifically with SP 2013 is that it does not allow filenames with tilde `~` characters to be uploaded to the site. To address this, we could eject CRA and configure it manually, but using the 'rescripts' package was a simpler alternative. The more popular <ins><a target="_blank" href="https://github.com/timarney/react-app-rewired#readme">`react-app-rewired`</a></ins> or <ins><a target="_blank" href="https://github.com/gsoft-inc/craco">`craco`</a></ins> packages might have done the job here, however I ended up using <ins><a target="_blank" href="https://github.com/harrysolovay/rescripts">`rescripts`</a></ins>.

When trying to upload the project, you might run into an issue like this:

<blockquote>
The file or folder name \\\"MyProject/static/js/runtime~main.d653cc00.js\\\" contains invalid characters. Please use a different name. Common invalid characters include the following # % & * : < > ? / { | }
</blockquote>

You therefore need to add the rescripts package to `devDependencies` and create a `./rescriptsrc.json` file:

```js
	"@rescripts/cli": "0.0.14",
```

```js
// ./rescriptsrs.json
module.exports = (config) => {
  config.optimization.splitChunks.automaticNameDelimiter = "_";
  if (config.optimization.runtimeChunk) {
    config.optimization.runtimeChunk = {
      name: (entrypoint) => `runtime_${entrypoint.name}`,
    };
  }
  return config;
};
```

At this point, when we run `npm run upload` , we should be able to successfully save/upload all files to our SharePoint specified folder. You won't be able to view this uploaded folder through the traditional site contents - you'll need to view it using Sharepoint Designer - it should be sitting as a folder at the root of the site.

## Routing with the HashRouter

When we upload to SharePoint, the app needs to simply run for users from `./index.html` without a server. Routing simply does not work like this from the build folder out of the box. Therefore , we need to use <ins><a target="_blank" href="https://reactrouter.com/web/api/HashRouter">`HashRouter`</a></ins> . This will add a `#` character to all of our routes. The more traditional `BrowserRouter` uses the HTML5 History API and is the preferred route when using a server or server-side rendering.

Assuming you have `react-router-dom` installed, the simple routing setup (which I've included in my repo) looks like the following:

```js
//index.js
import { HashRouter } from "react-router-dom";
ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

```js
//App.js
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/sampleroute1" component={SampleRoute1} />
  <Route path="/sampleroute2" component={SampleRoute2} />
</Switch>
```

The final configuration step for HashRouter is to specify the homepage in `package.json`:

```js
"homepage": "./",
```

## IE11 Legacy Support

To support the older IE11 browser, simply install the `react-app-polyfill` packagee and include it in `index.js` :

```js
//index.js
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
```

## Deploying

With the all the primary configuration done, we can define our deploy scripts (UAT again is optional) in `package.json`:

```js
 "deploy": "npm run build-re && node ./deploytools/upload.js",
 "deployUAT": "npm run build-re && node ./deploytools/uploadUAT.js",
```

Then running `npm run deploy` will regenerate our `./build` folder, delete the old build folder on the SharePoint folder, and upload the new build folder files.

Users can them simply be given the URL to the index.html file, ie:

<blockquote>http://my-sharepoint-prod.com/sites/mysite/MyProjectFolder/index.html</blockquote>

Their permissions to the site will simply be set at the site level.

## Summary

You can view the full list of packages in my <ins><a target="_blank" href="https://github.com/rylew2/sharepoint-cra-starter/blob/master/package.json">package.json</a></ins> . If everything is configured properly - you should have a Create React App application that can:

1.  Build and save/upload a React application to a SharePoint site
2.  Make API calls from both localhost, and the SharePoint deployed folder
3.  Have Routing working in your build folder without the need for an http server

The project's aim was to focus on building a React app that leveraged SharePoint List data, avoiding traditional SharePoint development complexities. The end result for our team was being able to more rapidly iterate and deploy solutions - and ultimately being able to focus more on our clients needs.

There is probably additional work or possible improvements that could be made - such as converting to TypeScript, Dockerizing, integrating with other automations on a CI/CD tool. You might even include a suite of domain specific tests against SharePoint List data. Feel free to make pull requests or raise issues on the repo. I hope this guide has helped - it turned out to be quite useful for some of my work projects.

---
title: Exploring VueJS
date: "2021-07"
slug: "exploring-vue"
selectedWork: false
description: "Trying out VueJS with the Nasa API"
previewImage: "/images/project/exploringVue/vue.png"
liveSite: "https://romantic-yonath-ba35e7.netlify.app/"
sourceCode: "https://github.com/rylew2/near-earth-objects-vue2"
tags:
  - vue
  - javascript
---

I wanted to explore VueJS as it has been slowly growing in popularity and following a similar path as React - for example, providing options to scale using superhero frameworks like <a href="https://nuxtjs.org/">Nuxt.js</a> and state management <a href="https://vuex.vuejs.org/">Vuex</a>.

<figure class="image">
  <Image src="/images/project/exploringVue/comparison.png" alt="high level view of GitHub browser">
  <figcaption>State of JS 2020 usage of popular frameworks with VueJS still in third place - slowly climbing</figcaption>
</figure>
<br />

While the 2020 front end framework survey indicates React is still in the lead - if you look at Github stars, the Vue repo actually has the most love. React was likely able to make a big impact earlier due to Facebook's support - but given that Vue is not backed by a tech giant, it's done pretty well for itself.

## Building a simple NASA API Vue App

For this project I wanted to quickly build out a Vue app that would make a simple API call and display data in an easy to understand way. I ended up choosing the Near Earth Object Web Service from <a href="https://api.nasa.gov/">NASA's Open API</a>. This web service lets you search for asteroids based on their closest approach date to Earth - along with a bevy of metadata such as the size of the asteroid and whether or not its deemed hazardous. When first seeing the results from the API - it was amazing to see just how many near earth asteroids are out there - it really is a cosmic shooting gallery out in space.

The way I set up this project was first to chose the Vue version - with the newer Vue 3 supporting a new `Composition API`. While Vue 2 uses the `Options API` which utilizes the `data`, `methods`, and `mounted` function for example. <a href="https://markus.oberlehner.net/blog/vue-3-composition-api-vs-options-api/">Vue 3</a> utilizes a single `setup` hook that makes it <a href="https://markus.oberlehner.net/blog/vue-3-composition-api-vs-options-api/">easier to share code amongs components</a>.

Because this was a quick and dirty app and I wanted to focus on the Vue basics - I opted to go for Vue 2. Since I've used Bootstrap quite a bit before - I decided to opt for Vuetify - the Material Framework for Vue.

The `Home` route of the app simply has choices for the Start and End Date (which must be within 7 days of each other) - and displays a list of the identified near earth asteroids for that date range. The results are paginated in a Vuetify table.

<figure class="image">
  <Image src="/images/project/exploringVue/home.png" alt="high level view of GitHub browser">
  <figcaption>Displaying a set of near earth asteroids for a given date range</figcaption>
</figure>
<br />

You can browse to the `Detail` route if you click on any row in the table. The detail route includes the NASA Picture of the Day and a Vuetify vertical tab set that has some details such as the size of the asteroid and its closest approaches. While the data on the home route includes multiple asteroids from the NASA NEO Feed endpoint, the data generated in the Detail route includes info from a separate NEO Lookup endpoint.

<figure class="image">
  <Image src="/images/project/exploringVue/detail.png" alt="high level view of GitHub browser">
  <figcaption>Displaying a set of near earth asteroids for a given date range</figcaption>
</figure>
<br />

## Learning Vue - from a React perspective

Some of the design choices from React like lifting state up and keeping custom components at the top of the component hierarchy (putting your pure presentational components towards the leaves of the hierarchy) translate well to Vue. An example of that code is below:

```js
<template>
  <div>
    <v-row class="dateRow">
      <DatePicker
        @date-change="onDateChange"
        label="Start Date"
        id="startDate"
        :date="startDate"
      />
      <DatePicker
        @date-change="onDateChange"
        label="End Date"
        id="endDate"
        :date="endDate"
      />
    </v-row>
    <ResultHeader
      :neoLength="neo.length"
      :startDate="startDate"
      :endDate="endDate"
      :dataTableLoading="dataTableLoading"
    />
    <Loader
      color="blue"
      :size="70"
      :width="7"
      :dataTableLoading="dataTableLoading"
      :dateRange="dateRange"
    />
    <InvalidRange :dateRange="dateRange" />
    <DataTable
      :apiKey="apiKey"
      :neoAll="this.neo"
      :dataTableLoading="this.dataTableLoading"
      @dataTable-loaded="dataTableLoaded"
      :dateRange="dateRange"
    />
  </div>
</template>
});
```

  <figcaption>Home route component - primarily custom components in components like Home that are at the top of the component hierarchy</figcaption>

### Using Vue specific features

I only scratched the surface of framework specific Vue features - such as the `watch` method and emitting `$event`'s - these are not something you see in React.

I ended up using the `$event` emitter to pass events from child back up to parent components. Typically in React you might do this by passing a prop down as a function. And if this project was larger, you might consider using something like Vuex

Another feature I wish I had tried was `v-model` - which is quite similar to an Angular `ng-model`. Vue's (and Angular's) two way binding system is different than React's one-way binding - for example, in React you usually have to call an event handler for an input update to affect state - whereas with Vue, the framework's watchers take care of this behind the scenes.

### React vs Vue

There are a lot of similarities between the two here - such as the core libraries being complemented by separate companion libraries that handle routing and global state management. They both utilize a virtual DOM. They both promote modular reusable and composable components.

There are some nuanced differences though - they include:

- <u>Optimizing re-renders</u> <br /><br />
  React uses `PureComponent` or `shouldComponentUpdate` to prevent unneccessary re-renders - the downside being all child components are dependent on a parent with one of these optimizations. All Vue components have a `shouldComponentUpdate` equivalent - simplifying the nested component caveats. Vue says this removes the need for performance optimization concerns for Vue apps - allowing developers to focus on building the app itself.

- <u>React's JSX focus versus Vue templates</u><br /><br />
  React's JSX allows you to use the full power of JS (vars, flow control, tooling) in your view (render function). While Vue also has a render function and supports JSX - the template is deemed a simpler alternative - it is much easier to learn for those more familiar with HTML such as designers. Since Vue still allows for logical components that use JSX - Vue allows us to use both.

- <u>React `styled-components` versus Vue's single-file component "scoped" style</u><br /><br />
  Vue favors the default method using a simple `<style scoped>` tag in single-file components

- <u>The `Vue CLI` offers additional features over `create-react-app`</u><br /><br />
  `create-react-app` does not allow configuration during project setup while the Vue CLI does and it can be extended via plugins. Furthermore, the Vue CLI has the added feature of allowing a project to be defined from presets - a JSON object that has pre-defined options/plugins for a new project.

- <u>Vue doesn't favor/require ES6, JSX, or build-systems</u><br /><br />
  Vue can simply be run by including a script tag (`<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>`) and writing Vue code without the need for performance concerns. 
  Therefore - the docs suggest that Vue can scale both up and down - (React is more difficult for minimal deployments)

- <u>Vue native rendered support is still in its infacy</u><br /><br />
  While React Native still likely takes the cake here for its native rendering using the same React component model - Vue's <a href="https://github.com/alibaba/weex">`Weex`</a> cross-platform UI framework has been gaining momentum.

### Some testing sprinkled in

I did try out `vue-test-utils` - but I'd like to come back and revisit this after I take the Testing JavaScript course by Kent Dodds. Since `vue-test-utils` comes with both unit and e2e test folder structures out of the box I decided to write a few basic test cases.

This was the first time I had ever used Cypress and it's a pretty stellar tool. I like seeing visual representations of my work - therefore seeing the Cypress robot run is pretty satisfying and a good Selenium replacement. While Cypress only runs with JavaScript, has difficulty handling events like file uploads or hover, and doesn't support mobile testing - these disadvantages are outweighed by the good parts - snapshots, readable stack traces, ability to wait during test execution, and cross browser testing.

<figure class="image">
  <Image src="/images/project/exploringVue/cypress.png" alt="cypress">
  <figcaption>Cypress running through a set of tests</figcaption>
</figure>

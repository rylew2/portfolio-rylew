---
title: Exploring VueJS
date: '2021-07'
slug: 'exploring-vue'
selectedWork: true
description: 'Trying out VueJS with the NASA API'
previewImage: '/images/project/exploringVue/vue.png'
liveSite: 'https://romantic-yonath-ba35e7.netlify.app/'
sourceCode: 'https://github.com/rylew2/near-earth-objects-vue2'
tags:
  - vue
  - javascript
---

Exploring VueJS was intriguing, given its rising popularity and parallels with React's growth trajectory. Vue provides options to scale using superhero frameworks like [Nuxt.js](https://nuxtjs.org/) and state management tools like [Vuex](https://vuex.vuejs.org/).

![State of JS 2020 usage of popular frameworks with VueJS still in third place — slowly climbing](/images/project/exploringVue/comparison.png)

While the 2020 front-end framework survey indicates React is still in the lead, if you look at GitHub stars, the Vue repo actually has the most love. React was likely able to make a big impact earlier due to Facebook's support, but given that Vue is not backed by a tech giant, it's done remarkably well for itself.

## Building a simple NASA API Vue App

For this project, I wanted to quickly build out a Vue app that would make a simple API call and display data in an easy-to-understand way. I ended up choosing the Near Earth Object Web Service from [NASA's Open API](https://api.nasa.gov/). This web service lets you search for asteroids based on their closest approach date to Earth—along with a bevy of metadata such as the size of the asteroid and whether or not it’s deemed hazardous. When first seeing the results from the API, it was amazing to see just how many near-earth asteroids are out there—it really is a cosmic shooting gallery out in space.

The way I set up this project was first to choose the Vue version—with the newer Vue 3 supporting a new `Composition API`. While Vue 2 uses the `Options API`, which utilizes the `data`, `methods`, and `mounted` functions, for example, [Vue 3](https://markus.oberlehner.net/blog/vue-3-composition-api-vs-options-api/) utilizes a single `setup` hook that makes it [easier to share code among components](https://markus.oberlehner.net/blog/vue-3-composition-api-vs-options-api/).

Because this was a quick and dirty app and I wanted to focus on the Vue basics, I opted to go for Vue 2. Since I've used Bootstrap quite a bit before, I decided to opt for Vuetify—the Material Framework for Vue.

The `Home` route of the app simply has choices for the Start and End Date (which must be within 7 days of each other) and displays a list of the identified near-earth asteroids for that date range. The results are paginated in a Vuetify table.

![Displaying a set of near-earth asteroids for a given date range](/images/project/exploringVue/home.png)

You can browse to the `Detail` route if you click on any row in the table. The detail route includes the NASA Picture of the Day and a Vuetify vertical tab set that has some details such as the size of the asteroid and its closest approaches. While the data on the home route includes multiple asteroids from the NASA NEO Feed endpoint, the data generated in the Detail route includes info from a separate NEO Lookup endpoint.

![Displaying details for a selected asteroid](/images/project/exploringVue/detail.png)

## Learning Vue — from a React perspective

Some of the design choices from React—like lifting state up and keeping custom components at the top of the component hierarchy (putting your pure presentational components towards the leaves of the hierarchy)—translate well to Vue. An example of that code is below:

```js
// filepath: src/components/Home.vue
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
```

_Primarily custom components like Home are at the top of the component hierarchy._

### Using Vue-specific features

I only scratched the surface of framework-specific Vue features—such as the `watch` method and emitting `$event`s—these are not something you see in React.

I ended up using the `$event` emitter to pass events from child back up to parent components. Typically in React, you might do this by passing a prop down as a function. And if this project were larger, you might consider using something like Vuex.

Another feature I wish I had tried was `v-model`, which is quite similar to an Angular `ng-model`. Vue's (and Angular's) two-way binding system is different from React's one-way binding—for example, in React, you usually have to call an event handler for an input update to affect state, whereas with Vue, the framework's watchers take care of this behind the scenes.

### React vs Vue

There are a lot of similarities between the two—such as the core libraries being complemented by separate companion libraries that handle routing and global state management. They both utilize a virtual DOM. They both promote modular, reusable, and composable components.

There are some nuanced differences though—they include:

- **Optimizing re-renders**  
  React uses `PureComponent` or `shouldComponentUpdate` to prevent unnecessary re-renders—the downside being all child components are dependent on a parent with one of these optimizations. All Vue components have a `shouldComponentUpdate` equivalent—simplifying the nested component caveats. Vue says this removes the need for performance optimization concerns for Vue apps—allowing developers to focus on building the app itself.

- **React's JSX focus versus Vue templates**  
  React's JSX allows you to use the full power of JS (vars, flow control, tooling) in your view (render function). While Vue also has a render function and supports JSX, the template is deemed a simpler alternative—it is much easier to learn for those more familiar with HTML such as designers. Since Vue still allows for logical components that use JSX, Vue allows us to use both.

- **React `styled-components` versus Vue's single-file component "scoped" style**  
  Vue favors the default method using a simple `<style scoped>` tag in single-file components.

- **The `Vue CLI` offers additional features over `create-react-app`**  
  `create-react-app` does not allow configuration during project setup while the Vue CLI does, and it can be extended via plugins. Furthermore, the Vue CLI has the added feature of allowing a project to be defined from presets—a JSON object that has predefined options/plugins for a new project.

- **Vue doesn't favor/require ES6, JSX, or build-systems**  
  Vue can simply be run by including a script tag (`<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>`) and writing Vue code without the need for performance concerns. Therefore, the docs suggest that Vue can scale both up and down—React is more difficult for minimal deployments.

- **Vue native rendered support is still in its infancy**  
  While React Native still likely takes the cake here for its native rendering using the same React component model, Vue's [`Weex`](https://github.com/alibaba/weex) cross-platform UI framework has been gaining momentum.

### Some testing sprinkled in

I experimented with `vue-test-utils` and plan to revisit it after completing Kent Dodds' Testing JavaScript course. Since `vue-test-utils` comes with both unit and e2e test folder structures out of the box, I decided to write a few basic test cases.

This was the first time I had ever used Cypress, and it's a pretty stellar tool. I like seeing visual representations of my work—therefore seeing the Cypress robot run is pretty satisfying and a good Selenium replacement. While Cypress only runs with JavaScript, has difficulty handling events like file uploads or hover, and doesn't support mobile testing, these disadvantages are outweighed by the good parts: snapshots, readable stack traces, ability to wait during test execution, and cross-browser testing.

![Cypress running through a set of tests](/images/project/exploringVue/cypress.png)

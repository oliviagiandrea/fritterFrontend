<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <!-- <img src="../../public/logo.svg"> -->
    <h1 class="title">
      Fritter
    </h1>
    <section class="alerts">
      <article v-for="(status, alert, index) in $store.state.alerts" :key="index" :class="status">
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
  padding: 1vw 2vw;
  background-color: #F8F4E3;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.title {
  font-size: 32px;
  margin: 0 5px;
  width: 70%;
}

img {
  height: 32px;
}

.left {
  display: flex;
  align-items: center;
}

.alerts {
  width: 25%;
}

h1 {
 overflow: hidden;
 text-align: center;
 color: #433633;
}

h1:before,
h1:after {
 background-color: #433633;
 content: "";
 display: inline-block;
 height: 5px;
 position: relative;
 vertical-align: middle;
 width: 50%;
}

h1:before {
 right: 0.5em;
 margin-left: -50%;
}

h1:after {
 left: 0.5em;
 margin-right: -50%;
}
</style>

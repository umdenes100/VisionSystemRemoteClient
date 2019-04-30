<template>
  <div id="app" class="container-fluid">
    <div class="row" id="header">
        <div class="col-md-10">
          <h1 id="navHome" v-on:click="currentPage = 'RemoteClient'">
            {{ header }}
          </h1>
        </div>
        <div class="col-md-1">
          <h2 id="navPage" v-on:click="currentPage = 'Simulator'">
            Simulator
          </h2>
        </div>
        <div class="col-md-1">
          <h2 id="navPage" v-on:click="currentPage = 'Libraries'">
            Libraries
          </h2>
        </div>
    </div>
    <div class="row">
      <component id="page" v-bind:is="currentPage"></component>
    </div>
    <div class="row">
      <h1 id="secret"> LTF > UTF </h1>
    </div>
  </div>
</template>

<script>
  import RemoteClient from './components/RemoteClient.vue';
  import Simulator from './components/Simulator.vue';
  import Libraries from './components/Libraries.vue';

  export default {
    name: 'app',
    components: {
      RemoteClient,
      Simulator,
      Libraries
    },
    data() {
      return {
        currentPage: 'RemoteClient',
        header: 'ENES100 Vision System Remote'
      }
    },
    created() {
      if(Math.floor(Math.random() * 100) == 42) {
        this.$data.header = 'LTF > UTF';
      }
    },
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Fjalla+One|Lato');
  #header {
    padding: 20px;
    background-color: #f5f5ff;
    position: relative;
    z-index: 100;
    box-shadow: 0 0 20px #888888;
  }
  #page {
    padding: 20px;
    z-index: 99;
    background-color: #ddddff;
    border-bottom: 2px solid #bebebe;
  }
  #navHome {
    cursor: pointer;
    font-family: 'Lato';
    color: black;
    text-decoration: none;
    font-size: 24px;
  }
  #navPage {
    cursor: pointer;
    font-family: 'Lato';
    color: black;
    text-decoration: none;
    font-size: 20px;
    padding-top: 2px;  
  }
  #secret {
    font-family: 'Lato';
    color: #fdfdff;
    font-size: 40;
  }
</style>

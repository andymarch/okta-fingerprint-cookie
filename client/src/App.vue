<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/profile/implicit">Profile (implicit)</router-link> |
      <router-link to="/profile/authorization_code">Profile (pkce)</router-link>
      <span v-if="hasIdToken">
        | <router-link to="/logout">Logout</router-link>
      </span>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { getIdToken } from './auth';

export default {
  data() {
    return {
      hasIdToken: false
    }
  },
  updated: async function () {
    this.hasIdToken = await getIdToken();
  },
  mounted: async function () {
    this.hasIdToken = await getIdToken();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

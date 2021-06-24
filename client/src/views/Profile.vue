<template>
  <div>
    <h1>My Profile</h1>
    <p><strong>ID Token:</strong></p>
    <div class="wrapit">{{ idToken }}</div>
    <p><strong>Access Token:</strong></p>
    <div class="wrapit">{{ accessToken }}</div>
    <h2>Profile details:</h2>
    <ul>
      <li><strong>Name: </strong> {{ claims.name }} </li>
      <li><strong>App Username: </strong>{{ claims.preferred_username }} </li>
      <li><strong>App ID: </strong> {{ claims.aud }} </li>
      <li><strong>SSO provided by: </strong> {{ claims.iss }} </li>
      <li><strong>Session Start: </strong> {{ tokenIssued }} </li>
      <li><strong>Session Timeout: </strong> {{ tokenExpiry }} </li>
      <li><strong>Fingerprint: </strong> {{ fingerprint }} </li>
      <li><button v-on:click="test()">test</button></li>
    </ul>
  </div>
</template>

<script>
import { getIdToken, getAccessToken } from '../auth'
import axios from 'axios'

export default {
  data() {
    return {
      accessToken: '',
      idToken: '',
      claims: '',
      tokenIssued: '',
      tokenExpiry: '',
      fingerprint: ''
    }
  },
  mounted() {
    getAccessToken().then(token => {
      this.accessToken = token.accessToken
      //TODO fix this
      this.fingerprint = token.claims.fingerprint
      });
    getIdToken().then(token => {
      this.idToken = token.idToken;
      this.claims = token.claims;
      this.tokenIssued = new Date(this.claims.iat * 1000).toString();
      this.tokenExpiry = new Date(this.claims.exp * 1000).toString();
    });
  },
  methods:{
    test: function(){
      axios.get('http://localhost:3333/test', 
      {
        //TODO fix this as axios won't send both
        //headers: {"Authorization" : `Bearer ${this.accessToken}`},
        withCredentials: true,
      });
    }
  }
}
</script>
<style>
.wrapit {
    overflow-wrap: break-word;
    word-wrap: break-word;
}
ul {
    list-style-type: none;
}
</style>

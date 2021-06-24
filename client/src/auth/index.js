import OktaAuth from '@okta/okta-auth-js';
import router from '../router';
import crypto from 'isomorphic-webcrypto'
import 'whatwg-fetch'
import axios from 'axios'

const ISSUER = process.env.VUE_APP_OKTA_CLIENT_ORGURL + '/oauth2/default';
const CLIENT_ID = process.env.VUE_APP_OKTA_OAUTH2_CLIENT_ID_SPA;
const REDIRECT_URL = window.location.origin + '/authorization-code/callback';

const AUTH_CODE_GRANT_TYPE = 'authorization_code';
const IMPLICIT_GRANT_TYPE = 'implicit';

const responseTypes = {};
responseTypes[AUTH_CODE_GRANT_TYPE] = 'code';
responseTypes[IMPLICIT_GRANT_TYPE] =  ['id_token', 'token'];

const oktaAuth = new OktaAuth({
    issuer: ISSUER,
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URL
});

console.log("polyfill checking")
if (!Object.is) {
    // eslint-disable-next-line no-extend-native
    Object.is = function is(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      }
      return x !== x && y !== y; // eslint-disable-line no-self-compare
    };
  }
if (!Array.prototype.includes) {
    console.log("Array Polyfill was required")
    // eslint-disable-next-line no-extend-native
    Array.prototype.includes = function includes(value) {
        console.log("polyfill fired")
      for (let i = 0; i < this.length; i += 1) {
        if (Object.is(this[i], value)) {
          return true;
        }
      }
      return false;
    };
  }
  else{
      console.log("no array polyfill required")
  }

  if (!String.prototype.includes) {
    console.log("String Polyfill was required")
    String.prototype.includes = function(search, start) {
      'use strict';
  
      if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
      } 
      if (start === undefined) { start = 0; }
      return this.indexOf(search, start) !== -1;
    };
  }  else{
    console.log("no string polyfill required")
}
  

export function validateAccess(to, from, next) {
    if(!oktaAuth.features.isPKCESupported()){
        console.log("No browser PKCE support")
    }
    else{
        console.log("Browser supports PKCE")
    }
    isTokenVerifySupported()
    getIdToken()
    .then(function(token) {
        if (token) {
            next();
        } else {
            oktaAuth.tokenManager.clear();
            // implicit or pkce?
            var grantParam = to.path.substring(to.path.lastIndexOf('/') + 1);
            var grantType = (responseTypes[grantParam]) ? grantParam : AUTH_CODE_GRANT_TYPE
            loginOkta(grantType);
        }          
    })
    .catch(console.error);
}

export function isTokenVerifySupported () {
    if(typeof crypto !== 'undefined')
    {
        console.log("typof crypto undef")
    }
    if(crypto.subtle){
        console.log("Crypto.subtle")
    }
    if(typeof Uint8Array !== 'undefined'){
        console.log("typof Uint8Array undef")
    }
}

export async function loginOkta(grantType) {
    var response = await axios.get('http://localhost:3333/fingerprint', {withCredentials: true});
    console.log("setting verifier: "+response.data.verifier)
    oktaAuth.options.grantType = grantType;
    oktaAuth.token.getWithRedirect({
        responseType: responseTypes[grantType],
        pkce: true,
        scopes: ['openid', 'profile', 'email'],
        codeVerifier: response.data.verifier
    });
}

export function logout() {
    getIdToken()
    .then(function (token) {
        if (token) {
            var idToken = token.idToken;
            oktaAuth.tokenManager.clear();
            window.location.href = ISSUER + '/v1/logout?client_id=' + CLIENT_ID + 
                '&id_token_hint=' + idToken + '&post_logout_redirect_uri=' + window.location.origin 
        } else {
            router.push('/');
        }
    })
}

export function callback() {
    // detect code
    var grantType = (window.location.href.indexOf('code=') > 0) ? 
        AUTH_CODE_GRANT_TYPE : IMPLICIT_GRANT_TYPE;
    oktaAuth.token.parseFromUrl()
    .then((tokens) => {
        tokens.forEach((token) => {
            if (token.idToken) {
                oktaAuth.tokenManager.add('id_token', token);
            } else if (token.accessToken) {
                oktaAuth.tokenManager.add('access_token', token);
            }
        });
        router.push('/profile/' + grantType);
    })
    .catch(console.error);
}

export function getIdToken() {
    return oktaAuth.tokenManager.get('id_token');
}
  
export function getAccessToken() {
    return oktaAuth.tokenManager.get('access_token');
}
  
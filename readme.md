# Okta with cookie fingerprinting

This repo represents a implementation of the token sidejacking mitigation proposed by the [OWASP JWT cheatsheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.md#token-sidejacking).

This repo consists of three parts:
* A client which is the SPA with which the user interacts.
* The server component which fingerprints the user and sets the cookie.
* The hook which Okta calls when the user authenticates to inject the fingerprint hash into the token.

## Setup

* Create a new SPA in Okta, with the redirect URI 'http://localhost:8080/authorization-code/callback' and copy the clientid
* Create a .env file in the /client directory with copy the structure form env.example. Replace the client id with the one you just created and enter your okta org url.
* The client can now be started with 'npm run serve'

* Open the server folder and start the project with 'npm run start'

* In the Okta admin console select workflow -> Inline Hooks then press "Add inline Hook" then select Token.
* Name the hook Fingerprint and give it the address "https://andymarch-hooks-demo.glitch.me/" and click save. Open this addres in a browser tab (this starts the dormant process)
    * This is a running example of the code in the hook folder, it requires no environment.
* Select Security -> API and select the default authorization server (/oauth2/default)
* Select Access Policies, then "Add New Access Policy", name it and assign to just the SPA you created.
* Press Add Rule, name the rule and accept the defaults other than where "use this inline hook" select your fingerprint hook and press Update Rule.

You are now ready to test.

* Open your browser to the SPA [localhost link](http://localhost:8080). 
* Select Profile (pkce), you will be redirect to Okta to login
* When you are redirected back you will have a cookie of "__Secure-fingerprint" with the cleartext value set by the serverside
* Copying the access token to your JWT parser of choice such as [token.dev](https://token.dev/) you should see the claim of fingerprint.

The the value in the token is the SHA256 hash of the cleartext in the cookie.

## Limitations

This implementation currently uses the PKCE verifier and code challenge to transport the hash. This is probably not ideal
 as it requires sending the verifier in the clear between the serverside and the SPA. Minor tweaks would allow the value to be sent either 
 as state or as a query parameter meaning the serverside could return the hashed value.

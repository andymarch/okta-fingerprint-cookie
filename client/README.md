This repo let's you see the OAuth 2.0 Implicit flow and the Authorization Code with PKCE flow in action.

The Implicit flow is effectively deprecated and should no longer be used.

## Quick Start: Automatic Setup with Heroku

You need a [Heroku](https://signup.heroku.com/) account to follow these instructions.

You can create a free Okta Developer org and deploy this app directly to Heroku by clicking the purple button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

After you deploy the app, click on **View** on the result screen to navigate to the newly deployed app.

Open your browser's developer tools view and choose the **Network** tab.

Click **Profile (pkce)** at the top of the app. You are redirected to your Okta org to authenticate. BUT, you won't yet know the credentials.

Back on the result tab from the deployment, click on **Manage App**. This brings you to the Heroku dashboard for the app. Click **Settings** and then **Reveal Config Vars**. Here, you see values for `OKTA_ADMIN_EMAIL` and `OKTA_ADMIN_PASSWORD`. You can use these values to login to the app on the other tab.

After you login, you'll see an `ID Token`, `Access Token` and profile details.

### Digging into PKCE

You should see both the `/authorize` and the `/token` calls in the call list from the `Network` tab on your browser.

In the `auth/index.js` file, there's a function named `callback`. In this function, you'll find this line:

```
...
oktaAuth.token.parseFromUrl()
...
```

The `parseFromUrl()` function detects when an *authorization code* has been returned as the result of the Authorization Code with PKCE flow. In this case, it automatically exchanges the *authorization code* for a set of tokens by posting to the `/token` endpoint.

### The Implicit Flow and Why We Hate It

Click **Logout** link in the navbar.

Click **Profile (implicit)**. In your browser's developer tools, you'll see an error:

```
The response type is not supported by the authorization server.
```

This is because, the SPA app that's automatically set up in your Okta org is configured to *not* allow the inmplicit flow. This is the best current practice. But, for demonstration purposes, we want to allow this flow.

Jump back to the tab in your browser that has the Heroku dashboard. Click `okta` to Single Sign-On (SSO) to your Okta organization. Click **Applications**. Click **Heroku Created OIDC App - browser**. Click **General**.

Click the **Edit** button, click the **Implicit** checkbox, click the **Allow Access Token with implicit grant type**, scroll down and click the **Save** button.

Now, when you click the **Profile (implicit)** link in the app, you'll be redirected to authenticate as before. In your browser developer tools view, you'll see a call to the `/redirect` endpoint. If you look at the `Location` header in the list of Response headers, you'll see something like this:

```
http://localhost:8080/authorization-code/callback#id_token=eyJraWQiOiJiRE9pQkFmbklEYWVqX2hkVENNcFBReS1QNThmc2Z4TEdaZUNYX0ppWk9RIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHUxb2djNWoxYXRMZWVXQTM1NyIsIm5hbWUiOiJTVVBFUiBBRE1JTiIsImVtYWlsIjoiZWNiZTg0MWQtYTFiMS00NWQzLTkyYjUtMjZiMDZkZjM4NDM0QGhlcm9rdS5va3RhLmNvbSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9kZXYtMzUzODAwLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiMG9hMW9nY3gzbVhYc2JLRzkzNTciLCJpYXQiOjE1NzIyMzcyMTYsImV4cCI6MTU3MjI0MDgxNiwianRpIjoiSUQuSEx0dDVwa25YR290ajRHVEF5LVpFQUV0YmpZVW5LWlRoMUtiVEY2R1pTUSIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvMW9nY2Q4aGRpc2RmU2YzNTciLCJub25jZSI6IjB4SVRSSUZhTFJ6M0NEdFVPV1dvSVFsRkw0bzFkSENFRDBXd0tQSlVjNjREUUVmMVd5eE8ycUNPMGcyRTFTVGEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJlY2JlODQxZC1hMWIxLTQ1ZDMtOTJiNS0yNmIwNmRmMzg0MzRAaGVyb2t1Lm9rdGEuY29tIiwiYXV0aF90aW1lIjoxNTcyMjM3MjE2LCJhdF9oYXNoIjoiX2o1U3lIT2p5WThlNE5PbllVYU9pUSJ9.oTdZmHtV6DJFlWFHXnxJ4Nl2olR3TcbUcvZ_OT8NITVKMPv0EZWVs_TGkawy3EHFxzlqKKYXxSXRdwU8r2ZKiTbe9BkDjP9AUtRCWbWcNIxGRtU6rqsVT4JFNvmO-6BGl72v7Yq6ANOHFoYHhXVEAZyl_Azq4Il0Nnarwwp6GKhAe9T1IS0_VLooLRQMlMHAX03ZNNk-o2cEJIBzxdJDBusLP462ZhSlWSqGy0Etaf9bG4Pi9rFIQnVZ6HKg_yQ9Ka2O3b7xjyYHNQLrHu5y5RP0hbdmI3dnWPygy-z_BCbI9QOvQcmDc7FvPC0Fj1WNNgkDbJ7v0Mqvz3N-cw4h-g&access_token=eyJraWQiOiJiRE9pQkFmbklEYWVqX2hkVENNcFBReS1QNThmc2Z4TEdaZUNYX0ppWk9RIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULkpVS3FRYWNNOW9TYkhXbHJWV285aFNBZk9Lc2ctcUFyUXFRdDRJQ0djUkkiLCJpc3MiOiJodHRwczovL2Rldi0zNTM4MDAub2t0YS5jb20vb2F1dGgyL2RlZmF1bHQiLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNTcyMjM3MjE2LCJleHAiOjE1NzIyNDA4MTYsImNpZCI6IjBvYTFvZ2N4M21YWHNiS0c5MzU3IiwidWlkIjoiMDB1MW9nYzVqMWF0TGVlV0EzNTciLCJzY3AiOlsiZW1haWwiLCJvcGVuaWQiLCJwcm9maWxlIl0sInN1YiI6ImVjYmU4NDFkLWExYjEtNDVkMy05MmI1LTI2YjA2ZGYzODQzNEBoZXJva3Uub2t0YS5jb20ifQ.bvv9yyCT7yFkkbfDuiiIeCrFLkSbeo2B69onOb4r6YiHMnr3pLibH0o7YIHWc8OzaSp1qZycNJw5NzDkD9d0--9d9NfqFINrcqUM3Kh99Dcy1NTfwE-5aqKcZ8QBU8JVyXVmieAbMOqAtTcoYig7Ny2ltBW9n2a6fI9-WeOjoPMoi3cjYx1kYTlq5qTr_DxNSxsYJ1GXnjKr4-U8Rrp1PyGq7DD493BFhkv3X23n88XCjO79vm2pu6e1Azy_sFmlvCgLXJNjYCT8_Q_aHqhiLWb-W7yW5b6zol-xWK8NnkIGAwa6xlD0Yh-SOCmJkbjOGGKAmGk9gz2Bp1CokTRhYg&token_type=Bearer&expires_in=3600&scope=email+openid+profile&state=wGLZoQdoVjp5Fd9yt97jPYvnXh186QOoUO0zrydve2qsr1ObORsrufIREVPsL8xx
```

Unlike the PKCE flow from earlier, this response has the tokens right on the url of the redirect. This is problematic since anything that passes thtough your browser's address bar could be intercepted or altered (if you had malware, a virus or a malicious browser extension, for instance).

This is why the Authorization Code Flow with PKCE Flow is a superior alternative to the Implicit Flow. The temporary authorization code is exchanged for tokens using a `POST` request, which does *not* pass through your browser's address bar.


## Quick Start: Manual Setup

You need a free [Okta Developer Org](https://developer.okta.com/signup) to get started.

In the admin console of your Okta org, Navigate to: **Applications**

- Click the green **Add Application** button 
- Select **Single-Page App** application, and click **Next**
- Give the app a **Name**.
- Change the value for **Login redirect URIs**  to `http://localhost:8080/authorization-code/callback`
- Check **Authorization Code** (and leave **Implicit** checked)
- Add `http://localhost:8080` to **Logout redirect URIs**
- Click **Done**

Take note of the **Client ID** at the bottom of the page.

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
OKTA_CLIENT_ORGURL=<your Okta org> OKTA_OAUTH2_CLIENT_ID_SPA=<client id> npm run serve
```

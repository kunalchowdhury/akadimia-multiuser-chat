const okta = require("@okta/okta-sdk-nodejs");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;


// Define an Okta client so any user management tasks can be performed
const oktaClient = new okta.Client({
  orgUrl: "https://dev-182311.okta.com",
  token: "00QnWqSlb6MKt1qXfAaVqQ3B3WcH9n4twsNsRadNOI"
});

// Define the OpenID Connect client
const oidc = new ExpressOIDC({
  issuer: "https://dev-182311.okta.com",
  client_id: "0oaps5l0b4ih2oqV54x6",
  client_secret: "JclHxrVNo3aI1wMbD-rIMti7-6D2mIMp-VhkzmMR",
  redirect_uri: process.env.OKTA_CALLBACK_URI || "http://192.168.1.3:4050/users/callback",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    callback: {
      path: "/users/callback",
      defaultRedirect: "/dashboard"
    }
  }
});


module.exports = { oidc, oktaClient };

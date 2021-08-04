let redirect;
let scope;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  redirect = "http://localhost:3000";
  scope = "api://3f33e374-7dc0-4521-9745-787dfd79cd9b/Users.View.All";
} else {
  redirect = "https://okrtesting.azurewebsites.net";
  scope = "api://56bbec98-83aa-409d-9890-a1828125c1ca/Users.View.All";
}

export const msalConfig = {
  auth: {
    clientId: "4fb1d85a-649b-4d25-9e57-9f44e3a4226c",
    authority: "https://login.microsoftonline.com/okrapp.onmicrosoft.com",
    redirectUri: redirect,
  },
  cache: {
    cacheLocation: "localStorage"
  }
}




export const authorityScopes = [
  scope
]
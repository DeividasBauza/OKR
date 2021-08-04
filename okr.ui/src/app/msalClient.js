import { msalConfig, authorityScopes } from "../constants/activeDirectoryConfig";
import { PublicClientApplication } from "@azure/msal-browser";


export const msalClient = new PublicClientApplication(msalConfig);

export function currentAccount() {
  return msalClient.getAllAccounts()[0];
}

export function acquireToken() {
  const request = {
    scopes: authorityScopes,
    account: currentAccount()
  }

  return msalClient.acquireTokenSilent(request);
}
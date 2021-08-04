let backendUrl;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    backendUrl = "https://localhost:5001";
} else {
    backendUrl = "https://okrapi.azurewebsites.net";
}
export const BACKEND_URL = backendUrl;
export const FRONTEND_URL = "http://localhost:3000";

export const OBJECTIVES_ENDPOINT = `${BACKEND_URL}/objectives`;
export const AZURE_USERS_ENDPOINT = `${BACKEND_URL}/users`;
export const FAVORITE_USERS_ENDPOINT = `${BACKEND_URL}/favoriteusers`;
export const PROGRESS_TABLE_ENDPOINT = `${BACKEND_URL}/progresstable`;
export const CHECKIN_TABLE_ENDPOINT = `${BACKEND_URL}/checkintable`;

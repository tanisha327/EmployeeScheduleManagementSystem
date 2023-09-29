let BASE_URL = "http://shiftninja.canadacentral.cloudapp.azure.com:8080";

export const API_URLS = {
    login: `${BASE_URL}/users/login`,
    signup: `${BASE_URL}/users/signup`,
    myShifts: `${BASE_URL}/all-events`,
    availableShifts: `${BASE_URL}/postSomething`,
    postShifts: `${BASE_URL}/events`,
    schedule: `${BASE_URL}/events`,
    approve: `${BASE_URL}/events/approve`,
    update: `${BASE_URL}/events/update/`
    // You can add more URLs here...
};


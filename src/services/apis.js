const BASE_URL = process.env.REACT_APP_BASE_URL

export const endPoints = {
    SENDOTP_API : BASE_URL + "/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
}

export const categories = {
    CATEGORIES_API : BASE_URL + '/course/showAllCategories',
}
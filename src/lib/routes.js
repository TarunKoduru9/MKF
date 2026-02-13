export const API_ROUTES = {
    AUTH: {
        SIGNUP: "/api/auth/signup",
        LOGIN_INIT: "/api/auth/login-init",
        VERIFY_2FA: "/api/auth/verify-2fa",
        PHONE_LOGIN: "/api/auth/phone-login",
        ME: "/api/auth/me",
        LOGOUT: "/api/auth/logout",
        FORGOT_PASSWORD: {
            INIT: "/api/auth/forgot-password/init",
            CONFIRM: "/api/auth/forgot-password/confirm",
        },
    },
    ADMIN: {
        AUTH: {
            LOGIN: "/api/admin/auth/login",
        },
        STATS: "/api/admin/stats",
        USERS: "/api/admin/users",
        DONATIONS: "/api/admin/donations",
        AUDIT_LOGS: "/api/admin/audit-logs",
        GALLERY: {
            ADD: "/api/admin/gallery/add",
            DELETE: "/api/admin/gallery/delete",
        },
    },
    DONATION: {
        CREATE: "/api/donations",
        VERIFY: "/api/donations/verify",
    },
    GALLERY: {
        GET: "/api/gallery",
    },
    CONTACT: "/api/contact",
    NEWSLETTER: "/api/newsletter",
    USER: "/api/user",
    UPLOAD: "/api/upload",
};

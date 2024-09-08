import { CONFIRM_RESET_PASSWORD, USER_FORGOT_PASSWORD, USER_LOGIN, USER_LOGOUT, USER_REGISTER, USER_VERIFICATION } from "../constants/api/user"

export const login = async (body) => {
    return fetch(USER_LOGIN, {
        method: 'POST',
        body: JSON.stringify(body),
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const register = async (body) => {
    return fetch(USER_REGISTER, {
        method: 'POST',
        body: JSON.stringify(body),
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const verification = async (token) => {
    return fetch(`${USER_VERIFICATION}?token=${token}`
    ).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}

export const logout = async () => {
    return fetch(`${USER_LOGOUT}`)
        .then(resp => {
            return resp;
        }).catch(e => {
            throw e;
        })
}

export const forgotPassword = async (body) => {
    return fetch(`${USER_FORGOT_PASSWORD}`, {
        body: JSON.stringify(body),
        method: 'POST',
    })
        .then(resp => {
            return resp;
        }).catch(e => {
            throw e;
        })
}

export const confirmResetPassword = async body => {
    return fetch(CONFIRM_RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(body)
    }).then(resp => {
        return resp;
    }).catch(e => {
        throw e;
    })
}
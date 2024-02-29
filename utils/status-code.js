const statusCode = {
    ERROR_500: (msg, data) => {
        return {
            code: 500,
            msg,
            data
        }
    },
    ERROR_401: (msg) => {
        return {
            code: 401,
            msg
        }
    },

    ERROR_403: (msg) => {
        return {
            code: 403,
            msg
        }
    },

    ERROR_404: (msg) => {
        return {
            code: 404,
            msg
        }
    },

    ERROR_412: (msg) => {
        return {
            code: 412,
            msg
        }
    },

    ERROR_413: (msg) => {
        return {
            code: 413,
            msg
        }
    },

    SUCCESS_200: (msg, data) => {
        return {
            code: 200,
            msg,
            data,
        }
    }
}

module.exports = statusCode
const handleResultWhenJavascriptError = require('../interceptor/javascriptError')
const handleResultWhenHttpRequest = require('../interceptor/httpRequest')
const handleResultWhenResourceError = require('../interceptor/resourceError')

module.exports = {
    handleResultWhenJavascriptError, handleResultWhenHttpRequest, handleResultWhenResourceError
}
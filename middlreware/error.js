
module.exports = function () {
    return async function (ctx, next) {
        await next();
    }
}

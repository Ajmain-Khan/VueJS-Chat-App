let moment = require('moment');
function handleMessage(username, msg) {
    return {
        username,
        msg,
        time: moment().format('h:mm a')

    }
}
module.exports = handleMessage;
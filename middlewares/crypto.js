const crypto = require('crypto');
function md5Crypto(str) {
    let md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}
module.exports = {
    md5Crypto: md5Crypto
};
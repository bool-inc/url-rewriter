var Hashids = require('hashids');

var shortlink = function(url) {
    hashids = new Hashids(url, 8);
    return hashids.encrypt(1);
}

exports.shortlink = shortlink;

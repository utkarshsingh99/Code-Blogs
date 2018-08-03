const crypto = require('crypto');

const secret = 'dontchangethis';

var password = 'fdfgrfbgnh'

const hash = crypto.createHmac('sha256', password).update(secret).digest('bin');

console.log(hash);

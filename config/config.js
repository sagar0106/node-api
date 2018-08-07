process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
    module.exports = require('./env/' + process.env.NODE_ENV + '.js');
} catch (e) {
    console.log("Environment File does not exist or Check spelling." + e);
    return false;
}
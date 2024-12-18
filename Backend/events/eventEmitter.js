// eventEmitter.js
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Increase max listeners to avoid the warning
eventEmitter.setMaxListeners(20);  // Adjust this number according to your needs

module.exports = eventEmitter;

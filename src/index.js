/* eslint-disable no-console */
const app = require('./app');
const handleListen = require('./handleListen');

const HTTP_PORT = process.env.HTTP_PORT || 3000;

app.listen(HTTP_PORT, handleListen(console.log, HTTP_PORT));
app.p2pServer.listen();

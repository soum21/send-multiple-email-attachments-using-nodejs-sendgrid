const express = require('express');
const cors = require('cors');
const http = require('http');
const logger = require('morgan');
const bodyParser = require('body-parser');
const port = parseInt(process.env.PORT, 10) || 5100;

const app = express();
app.use(logger('dev'));
app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
var publicDir = require('path').join(__dirname,'./views');
app.use(express.static(publicDir));

app.set('view engine', 'hjs');
app.set('views', './views');

app.set('port', port);
const server = http.createServer(app);

app.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of Email Attachments.',
}));

app.use('/email', require('./app/email/email'));

server.listen(port, () => {
    console.log(`server started at http://localhost: ${port}`)
});
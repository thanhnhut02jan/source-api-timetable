const express = require('express');
const bodyParser = require('body-parser');

const initRoute = require('./routes/init.route');

const  app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3001, () => console.log(`Server listening at port 3001`));

initRoute(app);

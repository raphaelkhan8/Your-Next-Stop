const express = require('express');
const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.static(__dirname + '/dist/your-next-stop'));

app.get('*', (req, res) => res.sendFile(__dirname + '/dist/your-next-stop/index.html'));

app.listen(PORT, () => console.log('server started on ' + PORT));
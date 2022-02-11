require('dotenv').config() // Read .env file

const app = require('./app/config/config');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server ON on Port ${PORT} mode!`);
});
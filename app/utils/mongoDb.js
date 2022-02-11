// Make sure you have loaded .env file configurations
function getMongoDbConnectionUrl(){
  return `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`
}

module.exports = {
  getMongoDbConnectionUrl
}
require('dotenv').config() // Load .env file configurations

const { getMongoDbConnectionUrl } = require('./app/utils/mongoDb')
const { MongoClient } = require('mongodb');

const deleteDatabase = async () => {
  const mongoUri = getMongoDbConnectionUrl()
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();

    const database = client.db(process.env.MONGO_DB_COLLECTION);

    const collections = (await database.listCollections().toArray()).map(c => c.name)

    if(collections.includes("articles")){
      const articlesDb = database.collection("articles");
      await articlesDb.drop()
      console.log('Collection "articles" Deleted')
    }
    else{
      console.log('Collection "articles" doesn\'t exists')
    }
  }
  catch(e){
    console.log(e)
  }
  finally {
    await client.close();
  }
}

deleteDatabase()
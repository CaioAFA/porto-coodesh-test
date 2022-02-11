require('dotenv').config() // Load .env file configurations

const { getMongoDbConnectionUrl } = require('./app/utils/mongoDb')
const { MongoClient } = require('mongodb');
const { sendMail } = require('./app/utils/email')
const axios = require('axios')
axios.defaults.baseURL = process.env.SPACE_FLIGHT_API_URL

const { getYesterdayAt9HoursInISOString, getTodayAt9HoursInISOString } = require('./app/utils/date')

const getArticlesFromApi = async() => {
  return new Promise((resolve, reject) => {
    axios.get('/articles', { params: {
      publishedAt_gte: getYesterdayAt9HoursInISOString(),
      publishedAt_lte: getTodayAt9HoursInISOString(),
    }}).then(response => {
      const { data } = response
      resolve(data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

const getArticlesIdsFromDatabase = () => {
  const client = new MongoClient(getMongoDbConnectionUrl())

  return new Promise(async (resolve, reject) => {
    let articles = [{}]

    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      articles = await articlesDb.find({
        publishedAt: {
          $gte: getYesterdayAt9HoursInISOString(),
          $lte: getTodayAt9HoursInISOString()
        }
      })
      .project({ id: 1 })
      .toArray()
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(articles.map((a) => a.id))
    }
  })
}

const getArticlesIdsToInsert = (articlesFromApi, articlesIdsFromDatabase) => {  
  return articlesFromApi
    .filter(a => !articlesIdsFromDatabase.includes(a.id))
    .map((a) => a.id)
}

const insertArticles = (articlesFromApi, articlesIdsToInsert) => {
  return new Promise(async (resolve, reject) => {
    articlesFromApi = await articlesFromApi.filter((a) => articlesIdsToInsert.includes(a.id))

    if(!articlesFromApi.length){
      console.log('No articles to insert')
      return resolve()
    }

    const client = new MongoClient(getMongoDbConnectionUrl())

    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      const query = {id: articlesFromApi.map((a) => a.id)}
      const deleteResult = await articlesDb.deleteMany(query)

      console.log('Inserting news:')
      articlesFromApi.forEach((a) => {
        console.log(a.title)
      })

      const options = { ordered: true };
      const insertResult = await articlesDb.insertMany(articlesFromApi, options);
      console.log(`Inserted ${insertResult.insertedCount} articles.`)
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve()
    }
  })
}

const main = async () => {
  try{
    const articlesFromApi = await getArticlesFromApi()
    const articlesIdsFromDatabase = await getArticlesIdsFromDatabase()
    const articlesIdsToInsert = await getArticlesIdsToInsert(articlesFromApi, articlesIdsFromDatabase)
    await insertArticles(articlesFromApi, articlesIdsToInsert)
  }
  catch(e){
    console.log(e)
    sendMail('Error at cron articles sync', e.message)
  }
}

main()

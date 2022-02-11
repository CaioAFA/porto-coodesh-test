require('dotenv').config() // Load .env file configurations

const { getMongoDbConnectionUrl } = require('./app/utils/mongoDb')
const { MongoClient } = require('mongodb');
const { sendMail } = require('./app/utils/email')
const axios = require('axios')
axios.defaults.baseURL = process.env.SPACE_FLIGHT_API_URL

// Numbers of registers to get by request
const BATCH_SIZE = 100

const getArticlesCount = async() => {
  return new Promise((resolve, reject) => {
    axios.get('/articles/count').then(response => {
      resolve(response.data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

const getBatchArticles = async(page) => {
  return new Promise((resolve, reject) => {
    axios.get('/articles', { params: {
      _limit: BATCH_SIZE,
      _start: BATCH_SIZE * page
    }}).then(response => {
      const { data } = response
      resolve(data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

const insertArticlesInDatabase = (articles) => {
  const mongoUri = getMongoDbConnectionUrl()
  const client = new MongoClient(mongoUri);

  return new Promise(async (resolve, reject) => {
    try {
      await client.connect();

      const database = client.db(process.env.MONGO_DB_COLLECTION);
      const articlesDb = database.collection("articles");

      const options = { ordered: true };
      const result = await articlesDb.insertMany(articles, options);
    }
    catch(e){
      await client.close();
      reject(e)
    }
    finally {
      await client.close();
      resolve()
    }
  })
}

const getArticles = async () => {
  const articlesCount = await getArticlesCount()

  console.log(`Total registers: ${articlesCount}`)

  for(let i = 0; i * BATCH_SIZE < articlesCount; i++){
    try{
      const articles = await getBatchArticles(i)
      await insertArticlesInDatabase(articles)

      const insertedArticles = (i + 1) * BATCH_SIZE > articlesCount ? articlesCount : (i + 1) * BATCH_SIZE
      console.log(`Inserted ${insertedArticles} articles.`)
    }
    catch(e){
      console.log('Error at inserting documents into MongoDB:')
      console.log(e.message)
      sendMail('Error at inserting documents into MongoDB', e.message)
    }

    console.log('------------------------------------')
  }  
}

getArticles()
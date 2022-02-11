const { MongoClient } = require('mongodb')
const { getMongoDbConnectionUrl } = require('../utils/mongoDb')
const { getNowInISOString } = require('../utils/date')

const getArticlesByPage = (page, pageSize) => {
  const client = new MongoClient(getMongoDbConnectionUrl())

  return new Promise(async (resolve, reject) => {
    let articles = [{}]

    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      articles = await articlesDb.find({}, {
          skip: (page - 1) * pageSize
        })
        .sort({ id: -1 })
        .limit(pageSize)
        .toArray()
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(articles)
    }
  })
}

const getArticleById = async (id) => {
  const client = new MongoClient(getMongoDbConnectionUrl())

  return new Promise(async (resolve, reject) => {
    let article = {}

    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      const query = {
        id
      }

      article = await articlesDb.findOne(query)
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(article)
    }
  })
}

const insertArticle = async article => {
  const maxInsertedId = await getMaxInsertedId()
  article.id = maxInsertedId + 1

  const mongoUri = getMongoDbConnectionUrl()
  const client = new MongoClient(mongoUri)

  const nowInISOString = getNowInISOString()
  article.publishedAt = nowInISOString
  article.updatedAt = nowInISOString

  return new Promise(async (resolve, reject) => {
    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      const result = await articlesDb.insertOne(article)
      article._id = result.insertedId
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(article)
    }
  })
}

const deleteArticleById = async articleId => {
  const client = new MongoClient(getMongoDbConnectionUrl())

  let deletedCount = 0
  return new Promise(async (resolve, reject) => {
    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      const query = {
        id: articleId
      }

      const result = await articlesDb.deleteOne(query)
      deletedCount = result.deletedCount
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(deletedCount)
    }
  })
}

const updateArticle = async (id, article) => {
  const mongoUri = getMongoDbConnectionUrl()
  const client = new MongoClient(mongoUri)

  const nowInISOString = getNowInISOString()
  article.updatedAt = nowInISOString

  return new Promise(async (resolve, reject) => {
    let updated = null

    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")
      const query = { id: id }
      const values = { $set: article }

      const result = await articlesDb.updateOne(query, values)

      if(result.modifiedCount != 0){
        updated = await getArticleById(id)
      }
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(updated)
    }
  })
}

const getMaxInsertedId = async () => {
  const client = new MongoClient(getMongoDbConnectionUrl())

  let maxId = 0

  return new Promise(async (resolve, reject) => {
    try {
      await client.connect()

      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")

      const result = await articlesDb.find({}).sort({ id: -1 }).limit(1).toArray()
      if(result.length){
        maxId = result[0].id
      }
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close()
      resolve(parseInt(maxId))
    }
  })
}

const getArticlesCount = () => {
  return new Promise(async (resolve, reject) => {
    let count = 0

    const client = new MongoClient(getMongoDbConnectionUrl())

    try {
      await client.connect()
  
      const database = client.db(process.env.MONGO_DB_COLLECTION)
      const articlesDb = database.collection("articles")
  
      count = await articlesDb.estimatedDocumentCount();
    }
    catch(e){
      await client.close()
      reject(e)
    }
    finally {
      await client.close();
      resolve(count)
    }
  })
}

module.exports = {
  getArticleById,
  getMaxInsertedId,
  insertArticle,
  deleteArticleById,
  updateArticle,
  getArticlesByPage,
  getArticlesCount
}
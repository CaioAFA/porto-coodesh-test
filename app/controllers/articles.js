const mongoRepository = require('../repository/articles')
const { payloadHasErrors, removeUnusedFields } = require('../utils/inputValidation')

const index = (app, req, res) => {
  res.send('Back-end Challenge 2021 🏅 - Space Flight News')
}

const getArticles = async (app, req, res) => {
  const queryParams = req.query
  const page = queryParams.page ? parseInt(queryParams.page) : 1
  const pageSize = 20

  try {
    const articlesCount = await mongoRepository.getArticlesCount()
    const articles = await mongoRepository.getArticlesByPage(page, pageSize)
    
    const lastPage = Math.ceil(articlesCount / pageSize)

    const result = {
      data: articles,
      articlesCount,
      currentPage: page,
      lastPage,
      pageSize
    }

    res.json(result)
  }
  catch (e) {
    console.log(e)
    res.status(500).json(null)
  }
}

const getArticleById = async (app, req, res) => {
  let id = parseInt(req.params.id)

  try {
    const article = await mongoRepository.getArticleById(id)
    
    if(!article){
      return res.status(404).send()
    }

    res.json(article)
  }
  catch (e) {
    console.log(e)
    res.status(500).json(null)
  }
}

const createArticle = async (app, req, res) => {
  const article = req.body

  removeUnusedFields(article)
  const errors = payloadHasErrors(article, false)

  if(errors) return res.status(400).send(errors)

  try{
    const insertedArticle = await mongoRepository.insertArticle(article)
    res.send(insertedArticle)
  }
  catch(e){
    res.status(500).json({})
  }
}

const updateArticle = async (app, req, res) => {
  const article = req.body
  let id = parseInt(req.params.id)

  removeUnusedFields(article, true)

  try{
    const updatedArticle = await mongoRepository.updateArticle(id, article)

    if(!updatedArticle){
      return res.status(404).send()
    }

    res.send(updatedArticle)
  }
  catch(e){
    console.log(e)
    res.status(500).json({})
  }
}

const deleteArticle = async (app, req, res) => {
  let id = parseInt(req.params.id)

  try {
    const deletedCount = await mongoRepository.deleteArticleById(id)

    if(!deletedCount){
      return res.status(404).json()
    }

    res.json()
  }
  catch (e) {
    console.log(e)
    res.status(500).json()
  }
}

module.exports = {
  index,
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  updateArticle
}
const controller = require('../controllers/articles')

const configureRoutes = (app) => {
  app.get('/', (req, res) => {
    controller.index(app, req, res)
  })

  app.get('/articles', (req, res) => {
    controller.getArticles(app, req, res)
  })

  app.get('/articles/:id', (req, res) => {
    controller.getArticleById(app, req, res)
  })

  app.post('/articles', (req, res) => {
    controller.createArticle(app, req, res)
  })

  app.delete('/articles/:id', (req, res) => {
    controller.deleteArticle(app, req, res)
  })

  app.put('/articles/:id', (req, res) => {
    controller.updateArticle(app, req, res)
  })
}

module.exports = {
  configureRoutes
}
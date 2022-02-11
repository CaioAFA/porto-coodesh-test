# Back-end Challenge 🏅 2021 - Space Flight News
Desafio para Desenvolvedores Backend.

>  This is a challenge by [Coodesh](https://coodesh.com/)

## Observações

## Tecnologias Utilizadas
- NodeJS
- MongoDB
- Docker / Docker-Compose
- Postman

## Executando o Projeto
Primeiramente, edite o parâmetro SEND_EMAIL_TO do arquivo .env. Insira seu e-mail para que seja enviada uma notificação caso haja problemas com o Cron ou com o processo de população do Banco de Dados.

```bash
# Limpando banco de dados (com Docker / Docker-Compose)
npm run docker-delete-collection

# Alimentando banco de dados (com Docker / Docker-Compose)
npm run docker-feed-database

# Iniciando a API (com Docker / Docker-Compose)
npm run docker-start

# Rodando o Cron (com Docker / Docker-Compose)
npm run docker-cron
```

## Rotas da API
Abra o arquivo "postman_collection.json" no Postman ou confira abaixo:

- `[GET]/:` Retornar "Back-end Challenge 2021 🏅 - Space Flight News"

- `[GET]/articles?page=1:` Listar artigos da base de dados (altere a página de acordo com o parâmetro na URL)

- `[GET]/articles/{id}:` Obter a informação somente de um artigo baseado no `id`

- `[DELETE]/articles/{id}:` Remover um artigo baseado no `id`

- `[POST]/articles/:` Adicionar um novo artigo. Payload:
```
{
  "title": "Astronauta Caio Arabal embarca em nova missão para ir à Lua",
  "url": "https://www.youtube.com/watch?v=ZzKCb-szZpc",
  "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvGl5Owy-a9TVgGU3-sqBORAhKxbPZmBM6-eQ3MnmDkEEYFoWzRgMNxzUssXP-FsQKeII&usqp=CAU",
  "newsSite": "Arrabal News",
  "summary": "Algum Summary",
  "featured": false,
  "launches": [
    {
      "id": "998",
      "provider": "Caio Arrabal"
    },
    {
      "id": "999",
      "provider": "Astolfo Arrabal"
    }
  ],
  "events": [
    {
      "id": "1000",
      "provider": "José Arrabal"
    },
    {
      "id": "1001",
      "provider": "Marinaldo Arrabal"
    }
  ]
}
```

- `[PUT]/articles/{id}:` Atualizar um artigo baseado no `id`. Payload (você pode atualizar somente os campos necessários):
```
{
  "title": "Astronauta Atualizado",
  "url": "url atualizado",
  "imageUrl": "image url atualizado",
  "newsSite": "Arrabal Atualizado",
  "summary": "Algum Atualizado",
  "featured": true,
  "launches": [
    {
      "id": "998",
      "provider": "Caio Arrabal Atualizado"
    },
    {
      "id": "999",
      "provider": "Astolfo Arrabal Atualizado"
    }
  ],
  "events": [
    {
      "id": "1000",
      "provider": "José Arrabal Atualizado"
    },
    {
      "id": "1001",
      "provider": "Marinaldo Arrabal Atualizado"
    }
  ]
}
```

## Instalando o Cron
Para isso, utilize a expressão `0 9 * * *` e execute o comando desejado:

```
# Com docker:
npm run docker-cron

# Com node:
npm run cron
```
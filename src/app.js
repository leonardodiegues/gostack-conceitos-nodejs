const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  next();
}

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateRepositoryId)

const repositories = [];

app.get("/repositories", (request, response) => {
  /**
   * 1. Rota que lista todos os repositórios;
   *
   * 2. Para que esse teste passe, sua aplicação deve permitir que seja
   *    retornado um array com todos os repositórios que foram criados
   *    até o momento.
   */
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  /**
   * 1. A rota deve receber title, url e techs dentro do corpo da requisição,
   *    sendo a URL o link para o github desse repositório. Ao cadastrar um
   *    novo projeto, ele deve ser armazenado dentro de um objeto no seguinte
   *    formato:
   *      {
   *        id: "uuid",
   *        title: 'Desafio Node.js',
   *        url: 'http://github.com/...',
   *        techs: ["Node.js", "..."],
   *        likes: 0
   *      };
   *    Certifique-se que o ID seja um UUID, e de sempre iniciar os likes
   *    como 0.
   *
   * 2. Para que esse teste passe, sua aplicação deve permitir que um
   *    repositório seja criado, e retorne um json com o projeto criado.
   */
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  /**
   * 1. A rota deve alterar apenas o title, a url e as techs do repositório
   *    que possua o id igual ao id presente nos parâmetros da rota;
   *
   * 2. Para que esse teste passe, sua aplicação deve permitir que sejam
   *    alterados apenas os campos url, title e techs
   *
   * 3. Para que esse teste passe, você deve validar na sua rota de update se o
   *    id do repositório enviado pela url existe ou não. Caso não exista,
   *    retornar um erro com status 400
   *
   * 4. Para que esse teste passe, você não deve permitir que sua rota de update
   *    altere diretamente os likes desse repositório, mantendo o mesmo número de
   *    likes que o repositório já possuia antes da atualização. Isso porque o
   *    único lugar que deve atualizar essa informação é a rota responsável por
   *    aumentar o número de likes.
   */
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  /**
   * 1. A rota deve deletar o repositório com o id presente nos parâmetros
   *    da rota;
   *
   * 2. Para que esse teste passe, você deve permitir que a sua rota de delete
   *    exclua um projeto, e ao fazer a exclusão, ele retorne uma resposta
   *    vazia, com status 204.
   */
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  /**
   * 1. A rota deve aumentar o número de likes do repositório específico
   *    escolhido através do id presente nos parâmetros da rota, a cada
   *    chamada dessa rota, o número de likes deve ser aumentado em 1;
   *
   * 2. Para que esse teste passe, sua aplicação deve permitir que um
   *    repositório com o id informado possa receber likes. O valor de likes
   *    deve ser incrementado em 1 a cada requisição, e como resultado,
   *    retornar um json contendo o repositório com o número de likes
   *    atualizado.
   *
   * 3. Para que esse teste passe, você deve validar na sua rota de like se o
   *    id do repositório enviado pela url existe ou não. Caso não exista,
   *    retornar um erro com status 400.
   */
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;

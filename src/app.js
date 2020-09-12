const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
//const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const recourse = "/repositories";
const repositories = [];

app.get(recourse, (_, res) => {
  return res.json(repositories);
});

app.post(recourse, (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);

  return res.json(repository);
});

app.put(`${recourse}/:id`, (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: "Repository does not found." });
  }

  const repository = {
    ...repositories[repositoryIndex],
    title,
    url,
    techs,
  };
  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: "Repository does not exists!" });
  }
  repositories.splice(repositoryIndex, 1);
  return res.status(204).send();
});

app.post(`${recourse}/:id/like`, (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (repositoryIndex < 0) {
    return res.status(400).json({ error: "Repository does not exists!" });
  }

  const likes = repositories[repositoryIndex].likes + 1;

  const repository = {
    ...repositories[repositoryIndex],
    likes,
  };
  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

module.exports = app;

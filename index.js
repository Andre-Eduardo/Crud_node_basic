const express = require("express"); // importa o express
const server = express(); // instacia o express

server.use(express.json()); // processar informaçoes no formato json do body da requisiçao

var project = [];
var contador = 0;
//Middlewares
function checkId(req, res, next) {
  let ok = false;
  const { id } = req.params;
  project.map((proj, index) => {
    if (proj.id == id) {
      req.index = index;
      ok = true;
      return next();
    }
  });
  if (!ok) {
    return res.status(400).json({ erro: "id does not exists" });
  }
}
// conta as requisiçoes
function contReq(req, res, next) {
  contador += 1;
  console.log(contador);
  return next();
}

//  ======= CRUD ===========

//Create

server.post("/projects", contReq, (req, res) => {
  const { id, title, tasks } = req.body;
  const local = { id, title, tasks };
  project.push(local);
  return res.json(project);
});

//lista todos os projetos
server.get("/projects", contReq, (req, res) => {
  return res.json(project);
});

// atualiza dados
server.put("/projects/:id", checkId, contReq, (req, res) => {
  const { title } = req.body;
  const index = req.index;
  project[index].title = title;
  return res.json(project);
});

//deleta projeto

server.delete("/projects/:id", checkId, contReq, (req, res) => {
  const index = req.index;
  project.splice(index, 1);
  return res.json(project);
});
//adicionar tarefa
server.post("/projects/:id/tasks", checkId, contReq, (req, res) => {
  const { title } = req.body;
  const index = req.index;
  project[index].tasks.push(title);
  return res.json(project);
});

//porta do servido
server.listen(3000);

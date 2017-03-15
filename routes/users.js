module.exports = app => {
  const Users = app.db.models.Users;

  app.route("/user")
  .all(app.auth.authenticate())
  /**
   * @api {get} /user Exibe usuário autenticado
   * @apiGroup Usuario
   * @apiHeader {String} Authorization Token de Usuário
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccess {Number} id Id de Registro
   * @apiSuccess {String} name Nome do usuário
   * @apiSuccess {String} email Email do Usuário
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "John Connor",
   *      "email": "john@connor.net"
   *    }
   * @apiErrorExample {json} Erro de consulta
   *    HTTP/1.1 412 Precondition Failed
   */
  .get((req, res) => {
      Users.findById(req.user.id, {
        attributes: ["id", "name", "email"]
      })
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
    })
  /**
   * @api {delete} /user Exclui usuário autenticado
   * @apiGroup Usuario
   * @apiHeader {String} Authorization Token de Usuário
   * @apiHeaderExample {json} Header
   *    {"Authorization": "JWT xyz.abc.123.hgf"}
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 204 No Content
   * @apiErrorExample {json} Erro na exclusão
   *    HTTP/1.1 412 Precondition Failed
   */
  .delete((req, res) => {
      Users.destroy({where: {id: req.user.id}})
        .then(result => {
          res.sendStatus(204);
        })
        .catch(error => {
          res.status(412).json({msg: error.message});
        });
    });
  /**
   * @api {post} /users Cadastra novo usuário
   * @apiGroup Usuario
   * @apiParam {String} name Nome
   * @apiParam {String} email Email
   * @apiParam {String} password Senha
   * @apiParamExample {json} Entrada
   *    {
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "123456"
   *    }
   * @apiSuccess {Number} id Id de Registro
   * @apiSuccess {String} name Nome
   * @apiSuccess {String} email Email
   * @apiSuccess {String} password Senha criptografada
   * @apiSuccess {Date} updated_at Data de Atualização
   * @apiSuccess {Date} created_at Data de cadastro
   * @apiSuccessExample {json} Sucesso
   *    HTTP/1.1 200 OK
   *    {
   *      "id": 1,
   *      "name": "John Connor",
   *      "email": "john@connor.net",
   *      "password": "$as%64&*",
   *      "updated_at": "2017-01-01T13:15:40.778Z",
   *      "created_at": "2017-01-01T13:15:40.778Z"
   *    }
   * @apiErrorExample {json} Erro no cadastro
   *    HTTP/1.1 412 Precondition Failed
   */
  app.post("/users", (req, res) => {
    Users.create(req.body)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        res.status(412).json({msg: error.message});
      });
  });
}

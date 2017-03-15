import jwt from "jwt-simple"

describe("Routes: Users", () => {
  const Users = app.db.models.Users
  const jwtSecret = app.libs.config.jwtSecret

  let token

  beforeEach(done => {
    Users
      .create({
            name: "John",
            email: "john@mail.net",
            password: "12345"
          })
      .then(user => {
          token = jwt.encode({id: user.id}, jwtSecret)
          done()
      })
  })

  afterEach(done => {
    Users.destroy({where: {}})
    .then(done())
  })

  describe("GET /user", () => {
    describe("status 200", () => {
      it("returns an authenticated user", done => {
        request.get("/user")
        .set("Authorization", `JWT ${token}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.eql("John")
          expect(res.body.email).to.eql("john@mail.net")
          done(err)
        })
      })
    })
  })

  describe("POST /users/", () => {
    describe("status 200", () => {
      it("creates a new user", done => {
        request.post("/users")
        .set("Authorization", `JWT ${token}`)
        .send({
          name: "Emerson",
          email: "emerchalegre@gmail.com",
          password: "123"
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.eql("Emerson")
          expect(res.body.email).to.eql("emerchalegre@gmail.com")
          done(err)
        })
      })
    })
  })

  describe("DELETE /user", () => {
    describe("status 204", () => {
      it("delete an authenticated user", done => {
        request.delete("/user")
        .set("Authorization", `JWT ${token}`)
        .expect(204)
        .end((err, res) => done(err))
      })
    })
  })

})

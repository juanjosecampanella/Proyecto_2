import supertest from "supertest";
import app from "../../app";

const mail = "abcdefgh@ddddd.com";
const cont = "gw1234";
describe("User Endpoints ", () => {
  let token;
  describe("Se llama a la creacion de usuario", () => {
    test("funciona cuando debe funcionar?:", async () => {
      const response = await supertest(app).post("/Users/createuser").send({
        name: "Michelle",
        password: cont,
        email: mail,
      });
      expect(response.status).toBe(201);
    });

    test("No funciona cuando no debe funcionar?:", async () => {
      const response = await supertest(app).post("/Users/createuser").send({
        name: "Juan",
        password: "123456",
        phone: "1",
        address: "casa",
      });
      expect(response.status).toBe(500);
    });
  });
  describe("Se llama a la creacion de JWT", () => {
    test("funciona cuando debe funcionar?:", async () => {
      const response = await supertest(app).get("/Users/finduserJWT").send({
        email: mail,
        password: cont,
      });
      token = response.body.token;
      console.log(token);
      expect(response.status).toBe(200);
    });
    test("No funciona cuando no debe funcionar?:", async () => {
      const response = await supertest(app).get("/Users/finduserJWT").send({
        email: "1@1",
        password: "123456",
      });
      expect(response.status).toBe(404);
    });
  });

  describe("Se llama al retorno de los datos de un usuario", () => {
    test("funciona cuando debe funcionar?:", async () => {
      const response = await supertest(app).get(
        "/Users/finduser/" + "6472ffd7c3f6cf774a88f833"
      );
      expect(response.status).toBe(200);
    });
    test("No funciona cuando no debe funcionar?:", async () => {
      const response = await supertest(app).get(
        "/Users/finduser/" + "6472ffd7c3f6cf774a88f835"
      );
      expect(response.status).toBe(404);
    });
  });

  describe("Se llama a la modificacion de los datos de un usuario", () => {
    test("funciona cuando debe funcionar?:", async () => {
      const response = await supertest(app)
        .patch("/Users/updateuser")
        .set("Authorization", token);
      expect(response.status).toBe(200);
    });
    test("No funciona cuando no debe funcionar?:", async () => {
      const response = await supertest(app)
        .patch("/Users/updateuser")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcyZmZkN2MzZjZjZjc3NGE4OGY4MzMiLCJpYXQiOjE2ODUyNTg3MjN9.yr6hs-3TLcgLBRATQ4sdV4JB6RCmOUMr1B6fUfEa-wQ"
        );
      expect(response.status).toBe(401);
    });
  });

  describe("Se llama a la inhabilitacion de un usuario", () => {
    test("funciona cuando debe funcionar?:", async () => {
      const response = await supertest(app)
        .delete("/Users/deleteuser")
        .set("Authorization", token);
      expect(response.status).toBe(200);
    });
    test("No funciona cuando no debe funcionar?:", async () => {
      const response = await supertest(app)
        .delete("/Users/deleteuser")
        .set(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcyZmZkN2MzZjZjZjc3NGE4OGY4MzMiLCJpYXQiOjE2ODUyNTg3MjN9.yr6hs-3TLcgLBRATQ4sdV4JB6RCmOUMr1B6fUfEa-wQ"
        );
      expect(response.status).toBe(401);
    });
  });
});

describe("User Controllers ", () => {
  let tk = "";
  describe("Se llama a la creacion de usuario", () => {
    test("Crear usuario", async () => {
      const test_body = {
        name: "Oscar",
        password: "moon",
        email: "mrknight@gmail.com",
      };

      const { _body: body } = await supertest(app)
        .post("/Users/createuser")
        .send(test_body);

      expect(body).toBeDefined();
      expect(body).toStrictEqual(
        expect.objectContaining({
          email: test_body.email,
          isDisable: false,
          name: test_body.name,
          password: test_body.password,
        })
      );
    });
  });

  describe("Se llama a la busqueda por id", () => {
    test("Buscar por id", async () => {
      const test_id = "6472ffd7c3f6cf774a88f833";

      const { _body: body } = await supertest(app).get(
        "/Users/finduser/" + test_id
      );

      expect(body).toBeDefined();
      expect(body).toStrictEqual(
        expect.objectContaining({
          _id: test_id,
        })
      );
    });
  });
  //Mail + Password
  describe("Se llama a la busqueda por email y clave", () => {
    test("Buscar por email y clave", async () => {
      const test_body = {
        email: "jdcastro@gmail.com",
        password: "131345",
      };

      const { _body: body } = await supertest(app)
        .get("/Users/finduserJWT")
        .send(test_body);

      tk = body.token;

      expect(body).toBeDefined();
      expect(body).toStrictEqual(
        expect.objectContaining({
          token: tk,
        })
      );
    });
  });

  describe("Se llama al update de usuario", () => {
    test("Actualizar usuario", async () => {
      const test_token = tk;
      const test_body = {
        name: "Elizabeth",
        password: "eli123456",
        email: "elizabethjason@gmail.com",
      };

      const response = await supertest(app)
        .patch("/Users/updateuser")
        .send(test_body)
        .set("Authorization", test_token);

      expect(response.body).toBe("changes applied");
    });
  });

  //DELETE / Delete
  describe("Se llama al delete de usuario", () => {
    test("Borrar usuario", async () => {
      const test_token = tk;

      const response = await supertest(app)
        .delete("/Users/deleteuser")
        .set("Authorization", test_token);

      expect(response.body).toBe("changes applied");
    });
  });
});
import { DataSource } from "typeorm";

// export default new DataSource({
//   type: "sqlite",
//   database: "./demo.sqlite",
//   synchronize: true,
//   entities: ["src/entities/*.ts"],
//   logging: ["query", "error"],
// });


export default new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "root",
  password: "root",
  database: "db",
  synchronize: true, //en dev, en prod on préfera utiliser les migrations
  logging: ["query", "error"],
  entities: ["src/entities/*.ts"],
});

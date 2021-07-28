import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: "lilreddit",
  entities: [Post],
  driverOptions: PostgreSqlDriver,
  type: "postgresql",
  debug: !__prod__,
  user: "postgres",
  password: "123456789",
} as Parameters<typeof MikroORM.init>[0];

import mysql from "serverless-mysql";
import { SQLStatement } from "sql-template-strings";

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: Number.parseInt(process.env.MYSQL_PORT, 10),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    typeCast: (field, next) => {
      if (
        field.name === "reviewers" ||
        field.name === "reviewees" ||
        field.name === "answers"
      ) {
        return JSON.parse(field.string());
      }
      return next();
    },
  },
});

export default async function excuteQuery<Response>(
  query: string | SQLStatement
) {
  try {
    const results = await db.query<Response>(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}

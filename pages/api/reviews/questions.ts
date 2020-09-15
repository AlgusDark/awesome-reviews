import query from "lib/db";
import SQL from "sql-template-strings";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const questions = await query(SQL`SELECT * FROM questions;`);

    res.status(200).json(questions);
  }
};

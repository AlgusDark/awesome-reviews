import { NextApiRequest, NextApiResponse } from "next";
import query from "lib/db";
import SQL from "sql-template-strings";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const results = await query(
      SQL`SELECT id, firstName, lastName, email FROM users WHERE id = ${id}`
    );

    res.status(200).json(results[0]);
  }

  if (req.method === "PUT") {
    const {
      query: { id },
    } = req;

    const { firstName, lastName, email } = req.body;

    const results = await query(
      SQL`UPDATE users 
      SET 
          firstName = ${firstName},
          lastName = ${lastName},
          email = ${email}
      WHERE
          id = ${id};`
    );
    res.status(200).end();
  }

  if (req.method === "DELETE") {
    const {
      query: { id },
    } = req;

    const results = await query(SQL`DELETE FROM users WHERE id = ${id};`);

    res.status(200).end();
  }
};

import { NextApiRequest, NextApiResponse } from "next";
import query from "lib/db";
import SQL from "sql-template-strings";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const user = await query(
      SQL`SELECT u.id, u.firstName, u.lastName, u.email, r.title role
      FROM users u
      INNER JOIN roles r
      ON u.roleId = r.id
      WHERE u.email = ${email} AND u.password = ${password}`
    );

    if (user[0]) {
      res.status(200).json(user[0]);
    } else {
      res.status(401).json({ error: "there is an error" });
    }
  } else {
    res.status(401).json({});
  }
};

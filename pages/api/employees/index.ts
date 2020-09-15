import query from "lib/db";
import SQL from "sql-template-strings";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const users = await query(
      "SELECT id, firstName, lastName, email FROM users WHERE roleID = 2"
    );

    res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { firstName, lastName, email } = req.body;

    const user = (await query(
      SQL`
      INSERT INTO users(roleId, firstName, lastName, email, password)
      VALUES(2, ${firstName}, ${lastName}, ${email}, '1234');
      `
    )) as { insertId: number };

    res.status(200).json({
      id: user.insertId,
      firstName,
      lastName,
      email,
    });
  }
};

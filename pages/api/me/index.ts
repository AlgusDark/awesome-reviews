import query from "lib/db";
import SQL from "sql-template-strings";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  if (req.method === "POST") {
    const results = await query(SQL`
    SELECT 
    CONCAT(
      '[',
      GROUP_CONCAT(
        JSON_OBJECT(
          'reviewId',
          r.id,
          'employeeId',
          reviewee.id,
          'firstName',
          reviewee.firstName,
          'lastName',
          reviewee.lastName,
          'active',
          r.active
        )
      ),
      ']'
    ) AS reviewees
    FROM reviews r
      INNER JOIN users reviewee ON reviewee.id = r.revieweeId
      INNER JOIN users reviewer ON reviewer.id = r.reviewerId
    WHERE r.reviewerId = ${id}
    GROUP BY r.reviewerId  
    `);

    res.status(200).json(results?.[0]?.reviewees || []);
  }
};

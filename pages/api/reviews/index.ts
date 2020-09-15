import query from "lib/db";
import SQL from "sql-template-strings";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const reviews = await query(SQL`
    SELECT r.revieweeId employeeId,
    reviewee.firstName,
    reviewee.lastName,
    CONCAT(
      '[',
      GROUP_CONCAT(
        JSON_OBJECT(
          'reviewId',
          r.id,
          'employeeId',
          reviewer.id,
          'firstName',
          reviewer.firstName,
          'lastName',
          reviewer.lastName,
          'active',
          r.active
        )
      ),
      ']'
    ) AS reviewers
    FROM reviews r
      INNER JOIN users reviewee ON reviewee.id = r.revieweeId
      INNER JOIN users reviewer ON reviewer.id = r.reviewerId
    GROUP BY r.revieweeId;
    `);

    res.status(200).json(reviews);
  }

  if (req.method === "POST") {
    const { revieweeId, reviewers } = req.body;

    for (let review of reviewers as []) {
      const results = await query(SQL`
        INSERT INTO reviews(reviewerId, revieweeId, active)
        VALUES(${review}, ${revieweeId} ,1);
      `);
    }

    res.status(200).end();
  }
};

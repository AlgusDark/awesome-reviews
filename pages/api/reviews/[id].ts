import { NextApiRequest, NextApiResponse } from "next";
import query from "lib/db";
import SQL from "sql-template-strings";

/**
 * Return the items to remove or insert
 */
function getChanges(
  before: Array<string | number>,
  after: Array<string | number>
) {
  for (let index = before.length - 1; index >= 0; index--) {
    let element = before[index];
    element =
      typeof element === "string" ? Number.parseInt(element, 10) : element;

    const exists = after.findIndex((value) => {
      value = typeof value === "string" ? Number.parseInt(value, 10) : value;

      return value === element;
    });

    if (exists >= 0) {
      before.splice(index, 1);
      after.splice(exists, 1);
    }
  }

  return {
    toRemove: before,
    toInsert: after,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const results = await query(SQL`
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
    WHERE r.revieweeId = ${id}
    GROUP BY r.revieweeId;
    `);

    res.status(200).json(results[0]);
  }

  if (req.method === "PUT") {
    const {
      query: { id },
    } = req;

    const { reviewers } = req.body;

    const beforeReviewers = await query(SQL`
    SELECT CONCAT(
      '[',
      GROUP_CONCAT(
        r.reviewerId
      ),
      ']'
    ) AS reviewers
    FROM reviews r
      INNER JOIN users reviewee ON reviewee.id = r.revieweeId
      INNER JOIN users reviewer ON reviewer.id = r.reviewerId
    WHERE r.revieweeId = ${id}
    GROUP BY r.revieweeId;
    `);

    const { toInsert, toRemove } = getChanges(
      beforeReviewers[0].reviewers,
      reviewers
    );

    if (toInsert.length > 0) {
      await query(
        SQL`
        INSERT INTO reviews (reviewerId, revieweeId)
        VALUES
        `.append(
          toInsert.reduce(
            (prev, reviewerId, currentIndex) =>
              prev
                .append(currentIndex === 0 ? "" : ",")
                .append(SQL`(${reviewerId}, ${id})`),
            SQL``
          )
        )
      );
    }

    if (toRemove.length > 0) {
      const results = await query(
        SQL`
        DELETE FROM reviews
        WHERE revieweeId = ${id}
        AND reviewerId IN (`
          .append(
            toRemove.reduce(
              (prev, reviewerId, currentIndex) =>
                prev
                  .append(currentIndex === 0 ? "" : ",")
                  .append(SQL`${reviewerId}`),
              SQL``
            )
          )
          .append(")")
      );
    }

    res.status(200).end();
  }

  if (req.method === "DELETE") {
    const {
      query: { id },
    } = req;

    await query(SQL`DELETE FROM reviews WHERE revieweeId = ${id};`);

    res.status(200).end();
  }
};

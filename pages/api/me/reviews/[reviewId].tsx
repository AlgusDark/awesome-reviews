import query from "lib/db";
import SQL from "sql-template-strings";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { reviewId } = req.query;

  if (req.method === "GET") {
    const results = await query(SQL`
    SELECT r.id reviewId, r.active, u.id employeeId, u.firstName, u.lastName,
    CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            'question',
            q.title,
            'id',
            q.id,
            'answer',
            f.answer
          )
        ),
        ']'
      ) AS answers
      FROM reviews r
      INNER JOIN users u ON r.revieweeId = u.id
      LEFT JOIN feedbacks f ON f.reviewId = r.id
      LEFT JOIN questions q ON q.id = f.questionId
    WHERE r.id = ${reviewId}
    `);

    res.status(200).json({
      ...results[0],
      answers: results[0].answers.filter((answer) => answer.id),
    });
  }

  if (req.method === "POST") {
    const { answers } = req.body;

    await query(
      SQL`
      INSERT INTO feedbacks (reviewId, questionId, answer)
      VALUES
      `.append(
        answers.reduce(
          (prev, feedback, currentIndex) =>
            prev
              .append(currentIndex === 0 ? "" : ",")
              .append(SQL`(${reviewId}, ${feedback.id}, ${feedback.answer})`),
          SQL``
        )
      )
    );

    await query(
      SQL`
      UPDATE reviews 
      SET 
        active = 0
      WHERE
        id = ${reviewId};
    `
    );

    res.status(200).end();
  }
};

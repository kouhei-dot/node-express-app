SELECT
  rev.id,
  user.id as 'user_id',
  user.name as 'user_name',
  rev.score,
  rev.visit,
  rev.post,
  rev.description
FROM
  t_review rev
LEFT OUTER JOIN
  t_user user
ON rev.user_id = user.id
WHERE rev.shop_id = ?

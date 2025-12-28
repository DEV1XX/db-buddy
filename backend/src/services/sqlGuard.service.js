// Blocks write queries
export function isReadOnlyQuery(sql) {
  const forbidden = ["insert", "update", "delete", "drop", "alter", "truncate"];
  const lowered = sql.toLowerCase();
  return !forbidden.some(word => lowered.includes(word));
}

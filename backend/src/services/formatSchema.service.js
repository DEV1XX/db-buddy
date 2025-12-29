// src/services/formatSchema.service.js

export async function formatSchema(rows) {
  const formattedSchema = {};

  for (const row of rows) {
    const tableName = row.table_name || row.TABLE_NAME;
    const columnName = row.column_name || row.COLUMN_NAME;
    const dataType = row.data_type || row.DATA_TYPE;

    if (!formattedSchema[tableName]) {
      formattedSchema[tableName] = [];
    }

    formattedSchema[tableName].push({
      column: columnName,
      type: dataType,
    });
  }

  return formattedSchema;
}

export function compressSchema(formattedSchema) {
  const compressedSchema = {};

  for (const [table, columns] of Object.entries(formattedSchema)) {
    compressedSchema[table] = columns.map(col => col.column);
  }

  return compressedSchema;
}

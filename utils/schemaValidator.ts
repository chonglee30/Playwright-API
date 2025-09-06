import fs from 'fs/promises'
import path from 'path'

const SCHEMA_BASE_PATH = './response-schemas'

async function readSchema(schemaPath:string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
  } catch (error) {
    throw new Error(`Failed to read the schema from the file: ${error.message}`)
  }
}

// Validate for the Schema and add path
export async function validateSchema(dirName: string, fileName: string) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
  const schema = await readSchema(schemaPath)
  console.log(schema)
}

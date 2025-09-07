import fs from 'fs/promises'
import path from 'path'
import Ajv from 'ajv'
import { createSchema } from 'genson-js';
import addFormats from "ajv-formats"

const SCHEMA_BASE_PATH = './response-schemas'
const ajv = new Ajv({allErrors: true})
addFormats(ajv)

async function readSchema(schemaPath:string) {
  try {
    const schemaContent = await fs.readFile(schemaPath, 'utf-8')
    return JSON.parse(schemaContent)
  } catch (error) {
    throw new Error(`Failed to read the schema from the file: ${error.message}`)
  }
}

// Validate for the Schema and add path
export async function validateSchema(dirName: string, fileName: string, responseBody: object, createSchemaFlag: boolean = false) {
  const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
  
  if (createSchemaFlag) {
    await generateNewSchema(responseBody, schemaPath) 
  }
  
  const schema = await readSchema(schemaPath)
  const validate = ajv.compile(schema) // compile schema to have actual validate function
                                       // ajv validation against schema and continue schema validation even if error.
  const validSchema = validate(responseBody) // validate schema against actual JSon Object
  if (!validSchema) 
    throw new Error(`Schema Validation ${fileName}_schema.json failed:\n
                  ${JSON.stringify(validate.errors)} \n`+
                `Actual Response Body: \n 
                ${JSON.stringify(responseBody)}`)
  console.log(validate.errors)
}

async function generateNewSchema(responseBody: object, schemaPath: string) {
  try {
    const generatedSchema = createSchema(responseBody);
    await fs.mkdir(path.dirname(schemaPath), {recursive: true})
    await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
  } catch (error) {
    throw new Error(`Failed to create new schema: ${error.message}`)
  }
}
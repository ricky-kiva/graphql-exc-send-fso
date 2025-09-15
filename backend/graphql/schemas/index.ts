import { readFileSync, readdirSync } from "fs";
import path from 'path';

const gqlSchemaFiles = readdirSync(__dirname).filter(file => file.endsWith(".graphql"));
const typeDefs = gqlSchemaFiles.map(f => readFileSync(path.join(__dirname, f), "utf-8"));

export default typeDefs;

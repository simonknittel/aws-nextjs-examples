import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';

if (!process.env.AWS_ACCESS_KEY_ID) { console.error('AWS_ACCESS_KEY_ID is missing!'); process.exit(1) }
if (!process.env.AWS_SECRET_ACCESS_KEY) { console.error('AWS_SECRET_ACCESS_KEY is missing!'); process.exit(1) }

const config: DynamoDBClientConfig = { region: 'eu-central-1' }

export const ddbClient = new DynamoDBClient(config)

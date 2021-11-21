import { BatchGetItemCommand, BatchGetItemCommandInput, BatchWriteItemCommand, BatchWriteItemCommandInput, ScanCommand, ScanCommandInput, WriteRequest } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dynamodb'
import { v4 as uuidv4 } from 'uuid'

const TABLE_NAME = 'User'

interface User {
  id: string;
  name: string;
}

interface CreateItem {
  name: User['name'];
}

class UserService {
  public async create(items: CreateItem[]) {
    const requests: WriteRequest[] = items.map(item => {
      return {
        PutRequest: {
          Item: {
            Id: { S: uuidv4() },
            Name: { S: item.name }
          }
        }
      }
    })

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [TABLE_NAME]: requests
      }
    }

    const command = new BatchWriteItemCommand(input)

    try {
      await ddbClient.send(command)
    } catch (error) {
      console.error(error)
    }
  }

  public async findAll(): Promise<User[]> {
    /**
     * @TODO: Implement pagination
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html
     * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
     */

    const input: ScanCommandInput = {
      TableName: TABLE_NAME,
      AttributesToGet: [
        'Id', 'Name'
      ]
    }

    const command = new ScanCommand(input)

    try {
      const response = await ddbClient.send(command)
      return response.Items!.map(user => {
        return {
          id: user.Id.S!,
          name: user.Name.S!,
        }
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }

  public async findById(ids: User['id'][]): Promise<User[]> {
    const keys = ids.map(id => {
      return {
        Id: { S: id }
      }
    })

    const input: BatchGetItemCommandInput = {
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
          AttributesToGet: [
            'Id', 'Name'
          ]
        }
      },
    }

    const command = new BatchGetItemCommand(input)

    try {
      const response = await ddbClient.send(command)
      return response.Responses![TABLE_NAME].map(user => {
        return {
          id: user.Id.S!,
          name: user.Name.S!,
        }
      })
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

const userService = new UserService()
export { userService }

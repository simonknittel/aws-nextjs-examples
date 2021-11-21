import { BatchGetItemCommand, BatchGetItemCommandInput, BatchWriteItemCommand, BatchWriteItemCommandInput, WriteRequest } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dynamodb'

const TABLE_NAME = 'Users'

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
      const response = await ddbClient.send(command)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  public async findAll(): Promise<User[]> {
    return []
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

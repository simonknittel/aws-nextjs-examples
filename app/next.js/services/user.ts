import { BatchGetItemCommand, BatchGetItemCommandInput, BatchWriteItemCommand, BatchWriteItemCommandInput, ScanCommand, ScanCommandInput, UpdateItemCommand, UpdateItemCommandInput, WriteRequest } from '@aws-sdk/client-dynamodb'
import { ddbClient } from './dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { CreateItem, DeleteItem, UserServiceInterface, User, PatchItem } from './interfaces/user'

class UserService implements UserServiceInterface {
  private TABLE_NAME = 'User'

  private ATTRIBUTES = [
    'Id', // S
    'Name', // S
    'CreationDate', // N
    'Creator', // S
    'LastEditDate', // N
  ]

  public async create(items: CreateItem[]) {
    const requests: WriteRequest[] = items.map(item => {
      return {
        PutRequest: {
          Item: {
            Id: { S: uuidv4() },
            Name: { S: item.name },
            CreationDate: { N: Date.now().toString() },
          }
        }
      }
    })

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.TABLE_NAME]: requests
      }
    }

    const command = new BatchWriteItemCommand(input)

    try {
      await ddbClient.send(command)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async findAll(): Promise<User[]> {
    /**
     * @TODO: Implement pagination
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html
     * https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html
     */

    const input: ScanCommandInput = {
      TableName: this.TABLE_NAME,
      AttributesToGet: this.ATTRIBUTES
    }

    const command = new ScanCommand(input)

    try {
      const response = await ddbClient.send(command)
      return response.Items!.map(this.mapper)
    } catch (error) {
      console.error(error)
      throw error
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
        [this.TABLE_NAME]: {
          Keys: keys,
          AttributesToGet: this.ATTRIBUTES
        }
      },
    }

    const command = new BatchGetItemCommand(input)

    try {
      const response = await ddbClient.send(command)
      return response.Responses![this.TABLE_NAME].map(this.mapper)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async update(id: User['id'], patch: PatchItem) {
    let updateExpression: UpdateItemCommandInput['UpdateExpression'] = ''
    const attributeNames: UpdateItemCommandInput['ExpressionAttributeNames'] = {}
    const attributeValues: UpdateItemCommandInput['ExpressionAttributeValues'] = {}

    updateExpression += `#a = :a`
    attributeNames['#a'] = 'LastEditDate'
    attributeValues[':a'] = { N: Date.now().toString() }

    if (patch.name) {
      updateExpression += `, #b = :b`
      attributeNames['#b'] = 'Name'
      attributeValues[':b'] = { S: patch.name }
    }

    const input: UpdateItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        Id: { S: id },
      },
      UpdateExpression: `SET ${ updateExpression }`,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    }

    const command = new UpdateItemCommand(input)

    try {
      await ddbClient.send(command)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async delete(items: DeleteItem[]) {
    const requests: WriteRequest[] = items.map(item => {
      return {
        DeleteRequest: {
          Key: {
            Id: { S: item.id },
          }
        }
      }
    })

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.TABLE_NAME]: requests
      }
    }

    const command = new BatchWriteItemCommand(input)

    try {
      await ddbClient.send(command)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private mapper(user: any) {
    const rtn: User = {
      id: user.Id.S!,
      name: user.Name.S!,
      creationDate: parseInt(user.CreationDate.N!),
    }

    if (user.Creator?.S) rtn.creator = user.Creator.S
    if (user.LastEditDate?.N) rtn.lastEditDate = parseInt(user.LastEditDate.N)

    return rtn
  }
}

const userService = new UserService()
export { userService }

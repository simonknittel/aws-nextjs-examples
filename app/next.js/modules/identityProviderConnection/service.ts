import { BatchGetItemCommand, BatchGetItemCommandInput, BatchWriteItemCommand, BatchWriteItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput, WriteRequest } from '@aws-sdk/client-dynamodb'
import { ddbClient } from '../../utils/ddbClient'
import { CreateItem, DeleteItem, IdentityProviderConnectionServiceInterface, IdentityProviderConnection, FindByProviderIdItem } from './types'

class IdentityProviderConnectionService implements IdentityProviderConnectionServiceInterface {
  private TABLE_NAME = 'IdentityProviderConnection'

  private ATTRIBUTES = [
    'UserId', // S
    'Provider', // S
    'ProviderId', // S
    'ProviderEmail', // S
  ]

  public async create(items: CreateItem[]) {
    const requests: WriteRequest[] = items.map(item => {
      return {
        PutRequest: {
          Item: {
            UserId: { S: item.userId },
            Provider: { S: item.provider },
            ProviderId: { S: item.providerId },
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

  public async findByProviderId(items: FindByProviderIdItem[]): Promise<IdentityProviderConnection[]> {
    const keys = items.map(({ provider, providerId }) => {
      return {
        Provider: { S: provider },
        ProviderId: { S: providerId },
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

  public async findByUserId(userId: string): Promise<IdentityProviderConnection[]> {
    const input: QueryCommandInput = {
      TableName: this.TABLE_NAME,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: '#a = :a',
      ExpressionAttributeNames: { '#a': 'UserId' },
      ExpressionAttributeValues: { ':a': { S: userId } },
      Select: 'ALL_ATTRIBUTES'
    }

    const command = new QueryCommand(input)

    try {
      const response = await ddbClient.send(command)
      return response.Items!.map(this.mapper)
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
            Provider: { S: item.provider },
            ProviderId: { S: item.providerId },
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

  private mapper(identityConnection: any) {
    const rtn: IdentityProviderConnection = {
      userId: identityConnection.UserId.S!,
      provider: identityConnection.Provider.S!,
      providerId: identityConnection.ProviderId.S!,
    }

    if (identityConnection.ProviderEmail?.S) rtn.providerEmail = identityConnection.ProviderEmail.S

    return rtn
  }
}

const identityProviderConnectionService = new IdentityProviderConnectionService()
export { identityProviderConnectionService }

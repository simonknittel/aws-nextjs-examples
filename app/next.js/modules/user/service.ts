import {
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  ScanCommand,
  ScanCommandInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../../utils/ddbClient";
import { v4 as uuidv4 } from "uuid";
import {
  CreateItem,
  DeleteItem,
  UserServiceInterface,
  User,
  PatchItem,
} from "./types";

class UserService implements UserServiceInterface {
  private TABLE_NAME = process.env.DYNAMODB_USER_TABLE!;

  private ATTRIBUTES = [
    "Id", // S
    "Name", // S
    "CreationDate", // N
    "Creator", // S
    "LastEditDate", // N
    "ArchivedDate", // N
  ];

  public async create(items: CreateItem[]): Promise<User[]> {
    const requests: WriteRequest[] = items.map((item) => {
      return {
        PutRequest: {
          Item: {
            Id: { S: uuidv4() },
            Name: { S: item.name },
            CreationDate: { N: Date.now().toString() },
          },
        },
      };
    });

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.TABLE_NAME]: requests,
      },
    };

    const command = new BatchWriteItemCommand(input);

    try {
      await ddbClient.send(command);
      return requests.map((item) => {
        return {
          id: item.PutRequest!.Item!.Id!.S!,
          name: item.PutRequest!.Item!.Name!.S!,
          creationDate: parseInt(item.PutRequest!.Item!.CreationDate!.N!),
        };
      });
    } catch (error) {
      console.error(error);
      throw error;
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
      AttributesToGet: this.ATTRIBUTES,
    };

    const command = new ScanCommand(input);

    try {
      const response = await ddbClient.send(command);
      return response.Items!.map(this.mapper);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findById(ids: User["id"][]): Promise<User[]> {
    const keys = ids.map((id) => {
      return {
        Id: { S: id },
      };
    });

    const input: BatchGetItemCommandInput = {
      RequestItems: {
        [this.TABLE_NAME]: {
          Keys: keys,
          AttributesToGet: this.ATTRIBUTES,
        },
      },
    };

    const command = new BatchGetItemCommand(input);

    try {
      const response = await ddbClient.send(command);
      return response.Responses![this.TABLE_NAME].map(this.mapper);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async update(id: User["id"], patch: PatchItem) {
    let setExpression: UpdateItemCommandInput["UpdateExpression"] = "";
    let removeExpression: UpdateItemCommandInput["UpdateExpression"] = "";
    const attributeNames: UpdateItemCommandInput["ExpressionAttributeNames"] =
      {};
    const attributeValues: UpdateItemCommandInput["ExpressionAttributeValues"] =
      {};

    setExpression += `#a = :a`;
    attributeNames["#a"] = "LastEditDate";
    attributeValues[":a"] = { N: Date.now().toString() };

    if (patch.name) {
      setExpression += `, #b = :b`;
      attributeNames["#b"] = "Name";
      attributeValues[":b"] = { S: patch.name };
    }

    if (typeof patch.archivedDate === "string") {
      setExpression += `, #c = :c`;
      attributeNames["#c"] = "ArchivedDate";
      attributeValues[":c"] = { N: patch.archivedDate };
    }

    if (patch.archivedDate === null) {
      removeExpression += "#d";
      attributeNames["#d"] = "ArchivedDate";
    }

    const input: UpdateItemCommandInput = {
      TableName: this.TABLE_NAME,
      Key: {
        Id: { S: id },
      },
      UpdateExpression: `SET ${setExpression} ${
        removeExpression ? "REMOVE " + removeExpression : ""
      }`,
      ExpressionAttributeNames: attributeNames,
      ExpressionAttributeValues: attributeValues,
    };

    const command = new UpdateItemCommand(input);

    try {
      await ddbClient.send(command);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async delete(items: DeleteItem[]) {
    const requests: WriteRequest[] = items.map((item) => {
      return {
        DeleteRequest: {
          Key: {
            Id: { S: item.id },
          },
        },
      };
    });

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.TABLE_NAME]: requests,
      },
    };

    const command = new BatchWriteItemCommand(input);

    try {
      await ddbClient.send(command);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private mapper(user: any) {
    const rtn: User = {
      id: user.Id.S!,
      name: user.Name.S!,
      creationDate: parseInt(user.CreationDate.N!),
    };

    if (user.Creator?.S) rtn.creator = user.Creator.S;
    if (user.LastEditDate?.N) rtn.lastEditDate = parseInt(user.LastEditDate.N);
    if (user.ArchivedDate?.N) rtn.archivedDate = parseInt(user.ArchivedDate.N);

    return rtn;
  }
}

const userService = new UserService();
export { userService };

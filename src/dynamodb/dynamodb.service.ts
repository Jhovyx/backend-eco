import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamodbService {

    private readonly dynamoClient: DynamoDBDocumentClient;

    constructor(){
        const client = new DynamoDBClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: 'AKIA4T4OBY2MDTLRSNIY',
                secretAccessKey: '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'
            }
        })
        this.dynamoClient = DynamoDBDocumentClient.from(client);
    }

    get dynamoCliente(){
        return this.dynamoClient
    }

}

import { IsNotEmpty, IsString } from 'class-validator';

export class BaseAwsConfig {
    /**
     * Base URL for AWS services
     * @example
     * "http://localhost:4566"
     * "https://sqs.us-east1.amazonaws.com"
     */
    @IsString()
    AWS_BASE_URL!: string;

    /**
     * Account ID for AWS services, should be 000000000000 with localstack
     *  @example "123456789012"
     */
    @IsNotEmpty()
    @IsString()
    AWS_ACCESS_KEY_ID!: string;

    /**
     * When deployed to EKS, the credentials need to be pulled
     * from the "identity token file" that is mounted on the container
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_provider_node.html
     */
    @IsString()
    AWS_WEB_IDENTITY_TOKEN_FILE!: string;

    @IsString()
    AWS_REGION!: string;
}

export class BaseUserCacheConfig {
    /**
     * Prefix for SQS queue names for this app
     * @example "ix-local-example"
     */
    @IsNotEmpty()
    @IsString()
    AWS_SQS_USER_UPDATED_NAME!: string;
}

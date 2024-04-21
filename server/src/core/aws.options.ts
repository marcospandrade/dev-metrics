import { ClientDefaults } from '@aws-sdk/client-s3';
import { getDefaultRoleAssumerWithWebIdentity } from '@aws-sdk/client-sts';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseAppConfig } from './config/config.module';

@Injectable()
export class AwsOptions<AwsClientConfig extends ClientDefaults = ClientDefaults> {
    constructor(config: AwsClientConfig, configService: ConfigService<BaseAppConfig>) {
        // when deployed to EKS, the credentials need to be pulled from the "identity token file" that is mounted on the container
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_provider_node.html
        const AWS_WEB_IDENTITY_TOKEN_FILE = configService.get('AWS_WEB_IDENTITY_TOKEN_FILE', { infer: true });
        if (AWS_WEB_IDENTITY_TOKEN_FILE) {
            config.credentialDefaultProvider = () => {
                return defaultProvider({
                    roleAssumerWithWebIdentity: getDefaultRoleAssumerWithWebIdentity(),
                });
            };
        }
    }
}

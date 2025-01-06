package com.myportfolio.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;

@Configuration
public class AwsConfig {
    @Bean
    public SesClient sesClient() {
        Dotenv dotenv = Dotenv.load();

        String accessKey = dotenv.get("AWS_SES_ACCESS_KEY");
        String secretKey = dotenv.get("AWS_SES_SECRET_KEY");
        String region = dotenv.get("AWS_REGION");

        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

        return SesClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}

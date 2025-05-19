package com.phoneaccessories.favorites.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger configuration.
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:/api/v1}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .servers(List.of(new Server().url(contextPath)))
                .info(new Info()
                        .title("Favorites Service API")
                        .description("Microservice for managing user favorites in phone accessories e-commerce platform")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Phone Accessories Team")
                                .email("team@phoneaccessories.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
//
// /**
//  * This configuration class sets up OpenAPI documentation for the Favorites Service.
//  * It includes metadata such as title, description, version, and contact information.
//  */
// @Configuration
// public class OpenApiConfig {
//
//     @Value("${server.servlet.context-path:/api/v1}")
//     private String contextPath;
//
//     @Bean
//     public OpenAPI customOpenAPI() {
//         return new OpenAPI()
//                 .servers(List.of(new Server().url(contextPath)))
//                 .info(new Info()
//                         .title("Favorites Service API")
//                         .description("Microservice for managing user favorites in phone accessories e-commerce platform")
//                         .version("1.0.0")
//                         .contact(new Contact()
//                                 .name("Phone Accessories Team")
//                                 .email("

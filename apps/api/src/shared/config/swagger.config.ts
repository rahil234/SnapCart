import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const SWAGGER_CONSTANTS = {
  TITLE: 'Snapcart API',
  DESCRIPTION: 'API documentation for the Snapcart Quick e-Commerce platform',
  VERSION: '1.0',
  DOCS_PATH: 'api/docs',
  JSON_PATH: 'api/docs-json',
};

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_CONSTANTS.TITLE)
    .setDescription(SWAGGER_CONSTANTS.DESCRIPTION)
    .setVersion(SWAGGER_CONSTANTS.VERSION)
    .addServer('http://localhost:4000', 'Local Server')
    .setContact(
      'Rahil K',
      'https://www.linkedin.com/in/rahil234/',
      'rahilsardar234@gmail.com',
    )
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_CONSTANTS.DOCS_PATH, app, document);
  SwaggerModule.setup(SWAGGER_CONSTANTS.JSON_PATH, app, document, {
    ui: false,
  });
}

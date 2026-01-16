import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Simple Storage dApp API")
    .setDescription(`
Nama Lengkap : Fadilah
NIM          : 231011403362

Backend Web3 API – Simple Storage dApp
`)
    .setVersion("1.0")
    .addTag("blockchain")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(3000);
}
bootstrap();

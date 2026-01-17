import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ WAJIB: Enable CORS agar frontend bisa akses
  app.enableCors({
    origin: "*", // untuk dev (aman untuk demo)
  });

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

  // ✅ WAJIB: gunakan PORT dari env
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();

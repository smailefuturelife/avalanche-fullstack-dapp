"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: "*",
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Simple Storage dApp API")
        .setDescription(`
Nama Lengkap : Fadilah
NIM          : 231011403362

Backend Web3 API – Simple Storage dApp
`)
        .setVersion("1.0")
        .addTag("blockchain")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
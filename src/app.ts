import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { middleware } from './app.middleware';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth';
import { RolesGuard } from './auth/guards/roles.guard';
import { helpers } from './shared/utils/handlebars.util';
import * as hbs from 'express-handlebars';
import * as bodyParser from 'body-parser';

async function bootstrap(): Promise<string> {
  const isProduction = process.env.NODE_ENV === 'production';
  // for http
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  if (isProduction) {
    app.enable('trust proxy');
  }
  // Express Middleware
  middleware(app);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));
  app.setGlobalPrefix('api/v1');
  // handble bars
  app.setBaseViewsDir(join(__dirname, './shared/templates'));
  const handlebars = hbs.create({
    layoutsDir: join(__dirname, './shared/templates'),
    defaultLayout: false,
    extname: 'hbs',
    helpers,
  });
  app.engine('hbs', handlebars.engine);
  app.setViewEngine('hbs');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(process.env.PORT || 3000);
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(url, 'Bootstrap');
  } catch (error) {
    NestLogger.error(error, 'Bootstrap');
  }
})();

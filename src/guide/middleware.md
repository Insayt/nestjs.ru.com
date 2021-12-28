# Middleware

Middleware - это функция, которая вызывается **перед** обработчиком маршрута. Middleware-функции имеют доступ 
к объектам [request](https://expressjs.com/en/4x/api.html#req) и [response](https://expressjs.com/en/4x/api.html#res), 
а также к промежуточной функции `next()` в цикле запрос-ответ приложения. Функция промежуточного ПО **next** обычно 
обозначается переменной с именем `next`.

<img src="/Middlewares_1.png" />

Nest middleware по умолчанию эквивалентны [express](https://expressjs.com/en/guide/using-middleware.html) middleware. 
Следующее описание из официальной документации express описывает возможности промежуточного ПО:

Функции Middleware могут выполнять следующие задачи:
<ul>
<li>выполнять любой код.</li>
<li>вносить изменения в объекты запроса и ответа.</li>
<li>завершить цикл запрос-ответ.</li>
<li>вызов следующей промежуточной (next) функции в стеке.</li>
<li>если текущая middleware функция не завершает цикл запрос-ответ, она должна вызвать <code>next()</code>, чтобы
  передать управление следующей middleware функции. В противном случае запрос будет оставлен в подвешенном состоянии.</li>
</ul>

Вы реализуете пользовательские middleware Nest либо в функции, либо в классе с декоратором `@Injectable()`. 
Класс должен реализовывать интерфейс `NestMiddleware`, в то время как к функции не предъявляется никаких особых требований. 
Давайте начнем с реализации простой middleware функции с помощью метода класса.

<div class="filename">logger.middleware.ts</div>

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

## Внедрение зависимостей (Dependency injection)

Nest middleware полностью поддерживает Dependency Injection. Как в случае с провайдерами и контроллерами, 
они могут **инжектировать зависимости**, доступные в пределах одного модуля. Как обычно, это делается через `constructor`.

## Применение middleware

В декораторе `@Module()` нет места для middleware. Вместо этого мы устанавливаем 
их с помощью метода `configure()` класса модуля. Модули, включающие middleware, должны реализовывать интерфейс 
`NestModule`. Давайте настроим `LoggerMiddleware` на уровне `AppModule`.

<div class="filename">app.module.ts</div>

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}
```

В приведенном выше примере мы установили `LoggerMiddleware` для обработчиков маршрутов `/cats`, которые были ранее 
определены внутри `CatsController`. Мы также можем дополнительно ограничить middleware определенным методом 
запроса, передав объект, содержащий маршрут `path` и запрос `method`, в метод `forRoutes()` при настройке
middleware. В примере ниже обратите внимание, что мы импортируем перечисление (enum) `RequestMethod` для ссылки 
на нужный тип метода запроса.

<div class="filename">app.module.ts</div>

```typescript
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```
> Метод `configure()` можно сделать асинхронным с помощью `async/await` (например, можно `дождаться` завершения 
> асинхронной операции внутри тела метода `configure()`).

## Шаблоны маршрутов

Также поддерживаются маршруты, основанные на шаблонах. Например, звездочка используется как **шаблон**, 
и будет соответствовать любой комбинации символов:

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

Маршрут `'ab*cd'` будет соответствовать `abcd`, `ab_cd`, `abecd` и так далее. Символы `?`, `+`, `*` и `()` могут 
использоваться в маршрутном пути и являются подмножествами своих аналогов регулярных выражений. Дефис ( `-`) и точка (`.`) 
интерпретируются буквально в строковых путях.

> Пакет `fastify` использует последнюю версию пакета `path-to-regexp`, который больше не поддерживает подстановочные 
> звездочки `*`. Вместо них необходимо использовать параметры (например, `(.*)`, `:splat*`).

## Middleware Consumer

Класс `MiddlewareConsumer` является вспомогательным классом. Он предоставляет несколько встроенных методов для управления
middleware. Все они могут быть просто **сцеплены (chained)** в [fluent style](https://en.wikipedia.org/wiki/Fluent_interface). 
Метод `forRoutes()` может принимать одну строку, несколько строк, объект `RouteInfo`, класс контроллера и даже несколько 
классов контроллеров. В большинстве случаев вы, вероятно, просто передадите список **контроллеров**, разделенных запятыми. 
Ниже приведен пример с одним контроллером:

<div class="filename">app.module.ts</div>

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller.ts';
@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
```

> Метод `apply()` может принимать либо один middleware, либо несколько аргументов для 
> указания <a href="/middleware#multiple-middleware">множественных middleware</a>.

## Исключение маршрутов

Иногда мы хотим **исключить** определенные маршруты из применения middleware. Мы можем легко исключить определенные 
маршруты с помощью метода `exclude()`. Этот метод может принимать одну строку, несколько строк или объект `RouteInfo`, 
определяющий маршруты, которые необходимо исключить, как показано ниже:

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
```

> Метод `exclude()` поддерживает шаблоны с помощью пакета 
> [path-to-regexp](https://github.com/pillarjs/path-to-regexp#parameters).

В приведенном примере `LoggerMiddleware` будет привязан ко всем маршрутам, определенным внутри `CatsController` 
**за исключением** трех, переданных в метод `exclude()`.

## Функциональные middleware

Класс `LoggerMiddleware`, который мы использовали, довольно прост. У него нет не дополнительных методов, 
ни зависимостей. Почему мы не можем определить его в простой функции, а не в классе? На самом деле, мы можем. 
Такой тип middleware называется **функциональным middleware**. Давайте преобразуем `LoggerMiddleware` из основанного 
на классах в функциональный middleware, чтобы проиллюстрировать разницу:

<div class="filename">logger.middleware.ts</div>

```typescript
import { Request, Response, NextFunction } from 'express';
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};
```

И используем его внутри `AppModule`:

<div class="filename">app.module.ts</div>

```typescript
consumer
  .apply(logger)
  .forRoutes(CatsController);
```

> Рассмотрите возможность использования более простой альтернативы **функциональных middleware** в тех случаях, 
> когда ваш middleware не нуждается в зависимостях.

## Множественные middleware

Как упоминалось выше, чтобы связать несколько middleware, которые выполняются последовательно, просто 
предоставьте список через запятую внутри метода `apply()`:

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## Глобальные middleware

Если мы хотим привязать middleware сразу к каждому зарегистрированному маршруту, мы можем использовать 
метод `use()`, который предоставляется экземпляром `INestApplication`:

<div class="filename">main.ts</div>

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```
> Доступ к DI-контейнеру в глобальных middleware невозможен. Вместо этого вы можете использовать 
> [функциональный middleware](/guide/middleware.html#функциональные-middleware) при использовании `app.use()`. В качестве альтернативы, 
> вы можете сделать middleware класс и использовать его с помощью `.forRoutes('*')` внутри `AppModule` 
> (или любого другого модуля).

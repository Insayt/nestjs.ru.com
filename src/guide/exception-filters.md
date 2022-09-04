# Фильтры исключений

Nest поставляется со встроенным **слоем исключений**, который отвечает за обработку всех необработанных исключений 
в приложении. Когда исключение не обрабатывается кодом вашего приложения, оно перехватывается этим слоем, который затем 
автоматически отправляет соответствующий ответ, удобный для пользователя.

<img src="/Filter_1.png" />

Из коробки, это действие выполняется встроенным **глобальным фильтром исключений**, который обрабатывает исключения 
типа `HttpException` (и его подклассы). Если исключение **нераспознано** (не является ни `HttpException`, ни классом, 
наследующим от `HttpException`), встроенный фильтр исключений генерирует следующий ответ JSON по умолчанию:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

> Глобальный фильтр исключений частично поддерживает библиотеку `http-errors`. В основном, любое брошенное исключение, 
> содержащее свойства `statusCode` и `message`, будет правильно распознано и отправлено обратно в качестве ответа 
> (вместо стандартного `InternalServerErrorException` для нераспознанных исключений).

## Выбрасывание стандартных исключений

Nest предоставляет встроенный класс `HttpException` из пакета `@nestjs/common`. Для типичных приложений, 
основанных на HTTP REST/GraphQL API, наилучшей практикой является отправка стандартных объектов HTTP-ответа при 
возникновении определенных условий ошибки.

Например, в `CatsController` у нас есть метод `findAll()` (обработчик маршрута `GET`). Предположим, что этот обработчик 
маршрута по какой-то причине выбрасывает исключение. Чтобы продемонстрировать это, мы напишем следующее:

<div class="filename">cats.controller.ts</div>

```typescript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

> Здесь мы использовали `HttpStatus`. Это вспомогательное перечисление (enum), импортированное из пакета `@nestjs/common`.
> Когда клиент вызывает этот url, ответ выглядит следующим образом:

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

Конструктор `HttpException` принимает два необходимых аргумента, которые определяют
`response``:

- Аргумент `response` определяет тело ответа в формате JSON. Это может быть `string`
  или `object`, как описано ниже.
- Аргумент `status` определяет [код состояния HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

По умолчанию тело ответа JSON содержит два свойства:

- `statusCode`: по умолчанию соответствует коду статуса HTTP, указанному в аргументе `status`.
- `message`: краткое описание ошибки HTTP на основе `status`.

Чтобы переопределить только часть сообщения в теле ответа JSON, передайте строку
в аргументе `response`. Чтобы переопределить все тело ответа JSON, передайте объект в аргументе `response`. 
Nest сериализует объект и вернет его в качестве тела ответа JSON.

Второй аргумент конструктора - `status` - должен быть действительным кодом статуса HTTP.
Лучше всего использовать перечисление `HttpStatus`, импортированное из `@nestjs/common`.

Вот пример переопределения всего тела ответа:

<div class="filename">cats.controller.ts</div>

```typescript
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}
```

Вот как будет выглядеть ответ:

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```

## Пользовательские исключения

Во многих случаях вам не потребуется писать пользовательские исключения, и вы можете использовать встроенное исключение 
Nest HTTP, как описано в следующем разделе. Если вам необходимо создать пользовательские исключения, хорошей практикой 
будет создание собственной иерархии **исключений**, в которой ваши пользовательские исключения наследуются от базового 
класса `HttpException`. При таком подходе Nest распознает ваши исключения и автоматически позаботится об ответах на ошибки. 
Давайте реализуем такое пользовательское исключение:

<div class="filename">forbidden.exception.ts</div>

```typescript
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

Поскольку `ForbiddenException` расширяет базовый `HttpException`, он будет работать без проблем со встроенным 
обработчиком исключений, и поэтому мы можем использовать его внутри метода `findAll()`.

<div class="filename">cats.controller.ts</div>

```typescript
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

## Встроенные исключения HTTP

Nest предоставляет набор стандартных исключений, которые наследуются от базового `HttpException`. Они импортируются 
из пакета `@nestjs/common` и представляют большинство наиболее распространенных исключений HTTP:

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

## Фильтры исключений

Хотя базовый (встроенный) фильтр исключений может автоматически обрабатывать многие случаи за вас, вам может понадобиться 
**полный контроль** над уровнем исключений. Например, вам понадобится добавить логирование или использовать другую 
схему JSON, основанную на некоторых динамических факторах. **Фильтры исключений** предназначены именно для этого. 
Они позволяют вам контролировать поток управления и содержание ответа, отправляемого обратно клиенту.

Давайте создадим фильтр исключений, который будет отвечать за перехват исключений, являющихся экземплярами класса 
`HttpException`, и реализацию для них пользовательской логики ответа. Для этого нам понадобится доступ к базовым 
объектам платформы `Request` и `Response`. Мы получим доступ к объекту `Request`, чтобы мы могли извлечь исходный 
`url` и включить его в информацию логгирования. Мы будем использовать объект `Response`, чтобы получить прямой 
контроль над отправляемым ответом, используя метод `response.json()`.

<div class="filename">http-exception.filter.ts</div>

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```
> Все фильтры исключений должны реализовывать общий интерфейс `ExceptionFilter<T>`. Для этого необходимо предоставить 
> метод `catch(exception: T, host: ArgumentsHost)` с указанной сигнатурой. `T` указывает на тип исключения.

Декоратор `@Catch(HttpException)` привязывает необходимые метаданные к фильтру исключений, сообщая Nest, что данный 
конкретный фильтр ищет исключения типа `HttpException` и ничего другого. Декоратор `@Catch()` может принимать один 
параметр или список, разделенный запятыми. Это позволяет настроить фильтр сразу для нескольких типов исключений.

## Аргументы хоста

Давайте рассмотрим параметры метода `catch()`. Параметр `exception` - это объект исключения, который обрабатывается 
в данный момент. Параметр `host` - это объект `ArgumentsHost`. `ArgumentsHost` - это мощный полезный объект, который 
мы рассмотрим далее в главе [Контекст выполнения](/guide/fundamentals/execution-context.html). В данном примере кода мы 
используем его для получения ссылки на объекты `Request` и `Response`, которые передаются оригинальному обработчику 
запроса (в контроллере, где возникло исключение).

Причина такого уровня абстракции заключается в том, что `ArgumentsHost` функционирует во всех контекстах 
(например, в контексте HTTP-сервера, с которым мы сейчас работаем, а также микросервисов и WebSockets). 
В главе о контексте выполнения мы увидим, как с помощью `ArgumentsHost` и его вспомогательных функций можно 
получить доступ к соответствующим [базовым аргументам](/guide/fundamentals/execution-context.html#host-methods) для любого контекста выполнения.
Это позволит нам писать универсальные фильтры исключений, которые работают во всех контекстах.

<demo-component></demo-component>

## Привязка фильтров

Давайте привяжем наш новый `HttpExceptionFilter` к методу `create()` контроллера `CatsController`.

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> Декоратор `@UseFilters()` импортируется из пакета `@nestjs/common`.

Здесь мы использовали декоратор `@UseFilters()`, как и `@Catch()`, он может принимать один экземпляр фильтра 
или список экземпляров фильтра, разделенных запятыми. Здесь мы создали экземпляр `HttpExceptionFilter` на месте. 
В качестве альтернативы вы можете передать класс (вместо экземпляра), оставив ответственность за инстанцирование 
фреймворку и включив **инъекцию зависимостей (dependency injection)**.

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> По возможности предпочитайте применять фильтры, используя классы, а не экземпляры. Это снижает **затраты памяти**, 
> поскольку Nest может легко повторно использовать экземпляры одного и того же класса во всем модуле.

В примере выше фильтр `HttpExceptionFilter` применяется только к единственному обработчику маршрута `create()`. 
Фильтры исключений могут быть использованы по-разному: на методах, 
на контроллерах или глобально. Например, чтобы настроить фильтр на контроллер, 
вы должны сделать следующее:

<div class="filename">cats.controller.ts</div>

```typescript
@UseFilters(new HttpExceptionFilter())
export class CatsController {}
```

Эта конструкция устанавливает `HttpExceptionFilter` для каждого обработчика маршрутов, определенного внутри `CatsController`.

Чтобы создать глобальный фильтр, вы должны сделать следующее:

<div class="filename">main.ts</div>

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

> Метод `useGlobalFilters()` не устанавливает фильтры для шлюзов или гибридных приложений.

Глобальные фильтры используются во всем приложении, для каждого контроллера и каждого обработчика маршрутов. 
С точки зрения инъекции зависимостей, глобальные фильтры, зарегистрированные вне модуля (с помощью `useGlobalFilters()`, 
как в примере выше), не могут использовать зависимости, поскольку это делается вне контекста любого модуля. Чтобы 
решить эту проблему, вы можете зарегистрировать глобальный фильтр **непосредственно из любого модуля**, используя 
следующую конструкцию:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

> При использовании этого подхода для выполнения инъекции зависимостей для фильтра, обратите внимание, 
> что независимо от модуля, в котором используется эта конструкция, фильтр, по сути, является глобальным. Где это должно 
> быть сделано? Выберите модуль, в котором определен фильтр (`HttpExceptionFilter` в примере выше). Кроме того, 
> `useClass` - не единственный способ работы с регистрацией пользовательских провайдеров. Узнайте больше 
> [здесь](/guide/fundamentals/custom-providers.html).

С помощью этой техники можно добавить столько фильтров, сколько необходимо; просто добавьте каждый из них в массив `providers`.

## Ловим все исключения

Чтобы поймать **каждое** необработанное исключение (независимо от типа исключения), оставьте список параметров 
декоратора `@Catch()` пустым, например, `@Catch()`.

В примере ниже мы имеем код, который является платформо-независимым, поскольку использует 
[HTTP-адаптер](./faq/http-adapter) для доставки ответа, и не использует никаких специфических для платформы 
объектов (`Request` и `Response`) напрямую:

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    // В определенных ситуациях `httpAdapter` может быть недоступен в
    // методе конструктора, поэтому мы должны достать его здесь.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
```

## Наследование

Как правило, вы создаете полностью индивидуальные фильтры исключений, отвечающие требованиям вашего приложения. Однако 
могут быть случаи, когда вы хотите просто расширить встроенный по умолчанию **глобальный фильтр исключений** и переопределить 
его поведение в зависимости от определенных факторов.

Чтобы делегировать обработку исключений базовому фильтру, вам нужно расширить `BaseExceptionFilter` и вызвать 
унаследованный метод `catch()`.

<div class="filename">all-exceptions.filter.ts</div>

```typescript
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

> Фильтры с методами и фильтры с контроллерами, расширяющие `BaseExceptionFilter`, 
> не должны инстанцироваться с помощью `new`. Вместо этого позвольте фреймворку инстанцировать их автоматически.

Приведенная выше реализация является лишь оболочкой, демонстрирующей подход. Ваша реализация расширенного фильтра 
исключений будет включать вашу **бизнес** логику (например, обработку различных условий).

Глобальные фильтры **могут** расширять базовый фильтр. Это может быть сделано одним из двух способов.

Первый способ заключается в инъекции ссылки `HttpServer` при инстанцировании пользовательского глобального фильтра:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(3000);
}
bootstrap();
```

Второй способ заключается в использовании токена `APP_FILTER` [как показано здесь](/guide/exception-filters.html#привязка-фильтров).

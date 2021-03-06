# Guards

Guard - это класс, аннотированный декоратором `@Injectable()`. Guards должны реализовывать интерфейс `CanActivate`.

<img src="/Guards_1.png" />

У guards есть **единственная ответственность**. Они определяют, будет ли данный запрос обработан обработчиком 
маршрута или нет, в зависимости от определенных условий (таких как разрешения, роли, ACL и т.д.), существующих во время 
выполнения. Это часто называют **авторизацией**. Авторизация (и ее родственник, **аутентификация**, с которой она обычно 
взаимодействует) обрабатывается через [middleware](/guide/middleware) в традиционных приложениях Express.
Middleware - отличный выбор для аутентификации, поскольку такие вещи, как проверка токенов и прикрепление 
свойств к объекту `request`, не сильно связаны с конкретным контекстом маршрута (и его метаданными).

Но middleware, по своей природе, тупой 😀. Он не знает, какой обработчик будет выполнен после вызова функции 
`next()`. С другой стороны, **Guards** имеют доступ к экземпляру `ExecutionContext`, и поэтому точно знают, 
что будет выполнено следующим. Они, как и фильтры исключений, pipes и interceptors, предназначены для того, 
чтобы вы могли вмешаться в логику обработки в нужный момент цикла запроса/ответа, причем сделать это декларативно. 
Это помогает сохранить ваш код цельным и декларативным.

> Guard выполняется **после** каждого middleware, но **до** любого interceptor или pipe.

## Guard авторизации

Как уже упоминалось, **авторизация** является отличным примером использования guards, поскольку определенные маршруты 
должны быть доступны только тогда, когда вызывающая сторона (обычно определенный аутентифицированный пользователь) имеет 
достаточные полномочия. В `AuthGuard`, который мы сейчас построим, предполагается, что пользователь аутентифицирован 
(и что, следовательно, к заголовкам запроса прикреплен токен). Он будет извлекать и проверять токен, и использовать 
извлеченную информацию для определения того, может ли запрос продолжаться или нет.

<div class="filename">auth.guard.ts</div>

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

> Если вы ищете реальный пример того, как реализовать механизм аутентификации в вашем приложении, 
> посетите [эту главу](/guide/security/authentication.html). Аналогично, более сложный пример авторизации можно найти 
> на [этой странице](/guide/security/authorization.html).

Логика внутри функции `validateRequest()` может быть настолько простой или сложной, насколько это необходимо. Главное 
в этом примере - показать, как *guards* вписываются в цикл запрос/ответ.

Каждый guard должен реализовать функцию `canActivate()`. Эта функция должна возвращать булево значение, указывающее, 
разрешен ли текущий запрос или нет. Она может возвращать ответ как синхронно, так и асинхронно (через `Promise` 
или `Observable`). Nest использует возвращаемое значение для управления следующим действием:

- если возвращает `true`, запрос будет обработан.
- если возвращает `false`, Nest отклонит запрос.

<demo-component></demo-component>

## Контекст исполнения

Функция `canActivate()` принимает единственный аргумент, экземпляр `ExecutionContext`. Контекст исполнения наследуется 
от `ArgumentsHost`. Мы рассматривали `ArgumentsHost` ранее в главе о фильтрах исключений. В приведенном примере мы просто 
используем те же вспомогательные методы, определенные на `ArgumentsHost`, которые мы использовали ранее, чтобы получить 
ссылку на объект `Request`. Вы можете обратиться к разделу **аргументы хоста** главы 
[фильтры исключений](/guide/exception-filters.html#аргументы-хоста) для получения дополнительной информации по этой теме.

Расширяя `ArgumentsHost`, `ExecutionContext` также добавляет несколько новых вспомогательных методов, которые 
предоставляют дополнительные подробности о текущем процессе выполнения. Эти подробности могут быть полезны при 
создании более общих guards, которые могут работать с широким набором контроллеров, методов и контекстов выполнения. 
Подробнее о `ExecutionContext` [здесь](/guide/fundamentals/execution-context.html).

## Аутентификация на основе ролей

Давайте построим более функциональную защиту, которая разрешает доступ только пользователям с определенной ролью. 
Мы начнем с базового шаблона guard и будем развивать его в следующих разделах. Пока что он позволяет выполнять все запросы:

<div class="filename">roles.guard.ts</div>

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## Привязка guards

Подобно pipes и фильтрам исключений, guards могут быть **привязаны к контроллеру**, методу или быть глобальными. 
Ниже мы установим guard, привязанный к контроллеру, с помощью декоратора `@UseGuards()`. Этот декоратор может принимать 
один аргумент или список аргументов, разделенных запятыми. Это позволяет легко применять соответствующий набор guards 
с помощью одного объявления.

```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

> Декоратор `@UseGuards()` импортируется из пакета `@nestjs/common`.

Выше мы передали тип `RolesGuard` (вместо экземпляра), оставив ответственность за инстанцирование фреймворку 
и включив инъекцию зависимостей. Как и в случае с pipes и фильтрами исключений, мы также можем передавать экземпляр на месте:

```typescript
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}
```

Приведенная выше конструкция прикрепляет guard к каждому обработчику, объявленному этим контроллером. Если мы хотим, 
чтобы guard применялся только к одному методу, мы применяем декоратор `@UseGuards()` на уровне **метода**.

Чтобы установить глобальный guard, используйте метод `useGlobalGuards()` экземпляра приложения Nest:

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

> В случае гибридных приложений метод `useGlobalGuards()` по умолчанию не устанавливает guards для шлюзов и микросервисов 
> (см. [Hybrid application](/guide/faq/hybrid-application.html) для информации о том, как изменить это поведение). 
> Для "стандартных" (негибридных) микросервисных приложений функция `useGlobalGuards()` устанавливает guards глобально.

Глобальные guards используются во всем приложении, для каждого контроллера и каждого обработчика маршрутов. Что касается 
инъекции зависимостей, глобальные guards, зарегистрированные вне модуля (с помощью `useGlobalGuards()`, как в примере выше), 
не могут инъектировать зависимости, поскольку это делается вне контекста какого-либо модуля. Чтобы решить эту проблему, 
вы можете установить guard непосредственно из любого модуля, используя следующую конструкцию:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

> При использовании этого подхода для выполнения инъекции зависимостей для guard, обратите внимание, что независимо от того, в каком
> модуле используется эта конструкция, guard, по сути, является глобальным. Где это должно быть сделано? Выберите модуль
> где определен guard (`RolesGuard` в примере выше). Кроме того, `useClass` - не единственный способ работы с
> регистрацией пользовательских провайдеров. Узнайте больше [здесь](/guide/fundamentals/custom-providers.html).

## Установка ролей для каждого обработчика

Наш `RolesGuard` работает, но он еще не очень умен. Мы пока не используем самую важную особенность guard'а - 
[контекст выполнения](/guide/fundamentals/execution-context.html). Он еще не знает о ролях и о том, какие роли разрешены 
для каждого обработчика. Например, `CatsController` может иметь различные схемы разрешений для различных маршрутов. 
Некоторые могут быть доступны только для пользователя admin, а другие могут быть открыты для всех. Как мы можем сопоставить 
роли с маршрутами гибким и многократно используемым способом?

Здесь в игру вступают **настраиваемые метаданные** (подробнее [здесь](/guide/fundamentals/execution-context.html#reflection-and-metadata)). 
Nest предоставляет возможность прикреплять пользовательские **метаданные** к обработчикам маршрутов с помощью декоратора 
`@SetMetadata()`. Эти метаданные предоставляют нам недостающие данные о `роли`, которые нужны умному guard для принятия решений. 
Давайте рассмотрим использование `@SetMetadata()`:

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

> Декоратор `@SetMetadata()` импортируется из пакета `@nestjs/common`.

В приведенной выше конструкции мы присоединили метаданные `roles` (`roles` - это ключ, а `['admin']` - конкретное значение) 
к методу `create()`. Хотя это работает, не стоит использовать `@SetMetadata()` непосредственно в маршрутах. 
Вместо этого создайте свои собственные декораторы, как показано ниже:

<div class="filename">roles.decorator.ts</div>

```typescript
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

Этот подход намного чище и читабельнее, а также является сильно типизированным. Теперь, когда у нас есть 
пользовательский декоратор `@Roles()`, мы можем использовать его для декорирования метода `create()`.

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## Собираем все вместе

Давайте теперь вернемся и свяжем это вместе с нашим `RolesGuard`. В настоящее время он просто возвращает `true` 
во всех случаях, позволяя каждому запросу продолжить работу. Мы хотим сделать возвращаемое значение условным, 
основанным на сравнении **ролей, назначенных текущему пользователю**, с реальными ролями, требуемыми текущим 
обрабатываемым маршрутом. Чтобы получить доступ к роли (ролям) маршрута (пользовательским метаданным), мы воспользуемся 
вспомогательным классом `Reflector`, который предоставляется фреймворком из коробки и импортируется из пакета `@nestjs/core`.

<div class="filename">roles.guard.ts</div>

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

> В мире node.js принято прикреплять авторизованного пользователя к объекту `request`. В нашем примере кода выше 
> мы предполагаем, что `request.user` содержит экземпляр пользователя и разрешенные роли.
> В вашем приложении вы, вероятно, создадите эту ассоциацию в вашем пользовательском **guard аутентификации** (или middleware). 
> Подробнее об этом читайте в [этой главе](/guide/security/authentication.html).

> Логика внутри функции `matchRoles()` может быть как простой, так и сложной. Главное в этом примере - показать, 
> как guards вписываются в цикл запроса/ответа.

Обратитесь к разделу [Рефлексия и метаданные](/guide/fundamentals/execution-context#reflection-and-metadata) главы 
**Контекст выполнения** для получения более подробной информации об использовании `Reflector` в зависимости от контекста.

Когда пользователь с недостаточными привилегиями запрашивает конечную точку, Nest автоматически возвращает следующий ответ:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

Обратите внимание, что за кулисами, когда guard возвращает `false`, фреймворк выбрасывает `ForbiddenException`. 
Если вы хотите вернуть другой ответ на ошибку, вы должны бросить свое собственное специфическое исключение. Например:

```typescript
throw new UnauthorizedException();
```


Любое исключение, брошенное guard, будет обработано [фильтрами исключений](/exception-filters) (глобальный фильтр 
исключений и любые фильтры исключений, применяемые к текущему контексту).

> Если вы ищете реальный пример реализации авторизации, посмотрите [эту главу](/guide/security/authorization.html).




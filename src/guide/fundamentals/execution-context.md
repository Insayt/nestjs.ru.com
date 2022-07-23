# Контекст выполнения

Nest предоставляет несколько классов утилит, которые облегчают написание приложений, функционирующих в различных 
контекстах выполнения (например, в контекстах приложений Nest на основе HTTP-сервера, микросервисов и WebSockets). 
Эти утилиты предоставляют информацию о текущем контексте выполнения, которая может быть использована для создания 
общих [guards](/guide/guards), [filters](/guide/exception-filters) и [interceptors](/guide/interceptors), которые могут работать 
с широким набором контроллеров, методов и контекстов выполнения.

В этой главе мы рассмотрим два таких класса: `ArgumentsHost` и `ExecutionContext`.


## Класс ArgumentsHost

Класс `ArgumentsHost` предоставляет методы для получения аргументов, передаваемых обработчику. Он позволяет выбрать 
соответствующий контекст (например, HTTP, RPC (микросервис) или WebSockets) для получения аргументов. Фреймворк предоставляет 
экземпляр `ArgumentsHost`, на который обычно ссылаются как на параметр `host`, в местах, где вы хотите получить 
к нему доступ. Например, метод `catch()` [фильтра исключений](/guide/exception-filters.html#аргументы-хоста) 
вызывается с помощью экземпляра `ArgumentsHost`.

`ArgumentsHost` просто действует как абстракция над аргументами обработчика. Например, для серверных приложений HTTP 
(когда используется `@nestjs/platform-express`) объект `host` содержит массив Express `[request, response, next]`, где 
`request` - объект запроса, `response` - объект ответа, а `next` - функция, управляющая циклом запрос-ответ приложения. 
С другой стороны, для приложений [GraphQL](/guide/graphql/quick-start.html) объект `host` содержит массив `[root, args, context, info]`.

## Текущий контекст приложения

При создании общих [guards](/guide/guards), [filters](/guide/exception-filters) и [interceptors](/guide/interceptors), которые предназначены 
для работы в нескольких контекстах приложений, нам нужен способ определить тип приложения, в котором в данный момент 
работает наш метод. Для этого используется метод `getType()` из `ArgumentsHost`:

```typescript
if (host.getType() === 'http') {
  // делать что-то только в контексте обычных HTTP-запросов (REST)
} else if (host.getType() === 'rpc') {
  // делать что-то только в контексте запросов микросервисов
} else if (host.getType<GqlContextType>() === 'graphql') {
  // делать что-то только в контексте запросов GraphQL
}
```

> Тип `GqlContextType` импортируется из пакета `@nestjs/graphql`.

Имея в наличии тип приложения, мы можем писать более общие компоненты, как показано ниже.

## Аргументы обработчика хоста

Чтобы получить массив аргументов, передаваемых обработчику, один из подходов заключается в использовании метода 
`getArgs()` объекта хоста.

```typescript
const [req, res, next] = host.getArgs();
```

Вы можете выбрать конкретный аргумент по индексу, используя метод `getArgByIndex()`:

```typescript
const request = host.getArgByIndex(0);
const response = host.getArgByIndex(1);
```

В этих примерах мы извлекали объекты запроса и ответа по индексу, что обычно не рекомендуется, поскольку это привязывает 
приложение к определенному контексту выполнения. Вместо этого вы можете сделать свой код более надежным и многократно 
используемым, используя один из служебных методов объекта `host` для переключения на соответствующий контекст выполнения 
приложения. Методы переключения контекста показаны ниже.


```typescript
/**
 * Сменить конекст на RPC.
 */
switchToRpc(): RpcArgumentsHost;
/**
 * Сменить конекст на HTTP.
 */
switchToHttp(): HttpArgumentsHost;
/**
 * Сменить конекст на WebSockets.
 */
switchToWs(): WsArgumentsHost;
```

Давайте перепишем предыдущий пример, используя метод `switchToHttp()`. Вспомогательный вызов `host.switchToHttp()` 
возвращает объект `HttpArgumentsHost`, соответствующий контексту приложения HTTP. Объект `HttpArgumentsHost` имеет два 
полезных метода, которые мы можем использовать для извлечения нужных объектов. В этом случае мы также используем typescript 
типы Express, чтобы вернуть объекты, типизированные для Express:

```typescript
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

Аналогично `WsArgumentsHost` и `RpcArgumentsHost` имеют методы для возврата соответствующих объектов в контекстах 
микросервисов и WebSockets. Вот методы для `WsArgumentsHost`:

```typescript
export interface WsArgumentsHost {
  /**
   * Возвращает обьект data
   */
  getData<T>(): T;
  /**
   * Возвращает обьект client
   */
  getClient<T>(): T;
}
```

Ниже перечислены методы для `RpcArgumentsHost`:

```typescript
export interface RpcArgumentsHost {
  /**
   * Возвращает обьект data
   */
  getData<T>(): T;
  /**
   * Возвращает обьект context
   */
  getContext<T>(): T;
}
```

## Класс ExecutionContext

`ExecutionContext` расширяет `ArgumentsHost`, предоставляя дополнительную информацию о текущем процессе выполнения. 
Как и `ArgumentsHost`, Nest предоставляет экземпляр `ExecutionContext` в тех местах, где он может понадобиться, например, 
в методе `canActivate()` метода [guard](/guide/guards.html#контекст-исполнения) и методе `intercept()` 
метода [interceptor](/guide/interceptors.html#контекст-исполнения). Он предоставляет следующие методы:

```typescript
export interface ExecutionContext extends ArgumentsHost {
  /**
   * Возвращает тип контроллера, к которому принадлежит текущий обработчик.
   */
  getClass<T>(): Type<T>;
  /**
   * Возвращает ссылку на обработчик (метод), который будет вызван следующим
   */
  getHandler(): Function;
}
```

Метод `getHandler()` возвращает ссылку на обработчик, который будет вызван. Метод `getClass()` возвращает тип 
класса `Controller`, к которому принадлежит данный обработчик. Например, в контексте HTTP, если текущий обрабатываемый 
запрос является запросом `POST`, связанным с методом `create()` на `CatsController`, `getHandler()` возвращает ссылку 
на метод `create()`, а `getClass()` возвращает **тип** (не экземпляр) `CatsController`.

```typescript
const methodKey = ctx.getHandler().name; // "create"
const className = ctx.getClass().name; // "CatsController"
```

Возможность доступа к ссылкам как на текущий класс, так и на метод обработчика обеспечивает большую гибкость. Самое 
главное, это дает нам возможность получить доступ к метаданным, установленным с помощью декоратора `@SetMetadata()` 
из охранников или перехватчиков. Этот вариант использования мы рассмотрим ниже.

<demo-component></demo-component>

## Reflection и метаданные

Nest предоставляет возможность прикреплять **пользовательские метаданные** к обработчикам маршрутов с помощью декоратора 
`@SetMetadata()`. Затем мы можем обращаться к этим метаданным из нашего класса для принятия определенных решений.

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

> Декоратор `@SetMetadata()` импортируется из пакета `@nestjs/common`.

В приведенной выше конструкции мы присоединили метаданные `roles` (`roles` - ключ метаданных, а `['admin']` - связанное 
с ним значение) к методу `create()`. Хотя это работает, не стоит использовать `@SetMetadata()` непосредственно в маршрутах. 
Вместо этого создайте свои собственные декораторы, как показано ниже:

<div class="filename">roles.decorator.ts</div>

```typescript
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

Этот подход намного чище и читабельнее, а также является сильно типизированным. Теперь, когда у нас есть пользовательский 
декоратор `@Roles()`, мы можем использовать его для декорирования метода `create()`.

<div class="filename">cats.controller.ts</div>

```typescript
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

Для доступа к роли(ям) маршрута (пользовательским метаданным) мы будем использовать вспомогательный класс `Reflector`, 
который предоставляется фреймворком из коробки и импортируется из пакета `@nestjs/core`. `Reflector` может быть внедрен 
в класс обычным способом:

<div class="filename">roles.guard.ts</div>

```typescript
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}
}
```

> Класс `Reflector` импортируется из пакета `@nestjs/core`.

Теперь, чтобы прочитать метаданные обработчика, используйте метод `get()`.

```typescript
const roles = this.reflector.get<string[]>('roles', context.getHandler());
```

Метод `Reflector#get` позволяет нам легко получить доступ к метаданным, передавая два аргумента: **key** 
и **context** для получения метаданных. В данном примере указанным **ключом** является `'roles'` 
(обратитесь к файлу `roles.decorator.ts` выше и вызову `SetMetadata()`, сделанному там). Контекст предоставляется 
вызовом `context.getHandler()`, который приводит к извлечению метаданных для текущего обработчика маршрута. Помните, 
что `getHandler()` дает нам **ссылку** на функцию обработчика маршрута.

В качестве альтернативы, мы можем организовать наш контроллер, применяя метаданные на уровне контроллера ко всем маршрутам 
в классе контроллера.

<div class="filename">cats.controller.ts</div>

```typescript
@Roles('admin')
@Controller('cats')
export class CatsController {}
```

В этом случае для извлечения метаданных контроллера мы передаем `context.getClass()` в качестве второго аргумента 
(чтобы предоставить класс контроллера в качестве контекста для извлечения метаданных) вместо `context.getHandler()`:

<div class="filename">roles.guard.ts</div>

```typescript
const roles = this.reflector.get<string[]>('roles', context.getClass());
```

Учитывая возможность предоставления метаданных на нескольких уровнях, вам может понадобиться извлекать и объединять 
метаданные из нескольких контекстов. Класс `Reflector` предоставляет два вспомогательных метода, которые помогают в этом. 
Эти методы извлекают **и** метаданные контроллера и метода одновременно, а также объединяют их различными способами.

Рассмотрим следующий сценарий, в котором вы предоставили метаданные `'roles'` на обоих уровнях.

<div class="filename">cats.controller.ts</div>

```typescript
@Roles('user')
@Controller('cats')
export class CatsController {
  @Post()
  @Roles('admin')
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
}
```

Если вы хотите указать `'user'` в качестве роли по умолчанию и выборочно переопределить ее для определенных методов, 
вы, вероятно, будете использовать метод `getAllAndOverride()`.

```typescript
const roles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
```

Guard с таким кодом, запущенный в контексте метода `create()`, с указанными выше метаданными, приведет к тому, что 
`roles` будет содержать `['admin']`.

Чтобы получить метаданные для обоих и объединить их (этот метод объединяет как массивы, так и объекты), используйте 
метод `getAllAndMerge()`:

```typescript
const roles = this.reflector.getAllAndMerge<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
```

В результате `roles` будет содержать `['user', 'admin']`.

Для обоих этих методов слияния вы передаете ключ метаданных в качестве первого аргумента и массив целевых контекстов 
метаданных (т.е. вызовов методов `getHandler()` и/или `getClass())`) в качестве второго аргумента.




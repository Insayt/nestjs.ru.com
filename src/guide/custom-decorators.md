---
meta:
- name: description
  content: Custom decorators Nest JS документация
---

# Пользовательские декораторы

Nest построен на основе функции языка, называемой **декораторами**. Декораторы - это хорошо известная концепция во многих 
распространенных языках программирования, но в мире JavaScript они все еще относительно новы. Чтобы лучше понять, как работают 
декораторы, мы рекомендуем прочитать [эту статью](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841).

> Декоратор ES2016 - это выражение, которое возвращает функцию и может принимать в качестве аргументов цель, имя 
> и дескриптор свойства.
> Вы применяете его, ставя перед ним символ <code>@</code> и помещая его в самую верхнюю часть того, что
> вы хотите декорировать. Декораторы могут быть определены как для класса, так и для метода или свойства.

## Декораторы параметров

Nest предоставляет набор полезных **декораторов параметров**, которые вы можете использовать вместе с обработчиками 
HTTP-маршрутов. Ниже приведен список предоставляемых декораторов и простых объектов Express (или Fastify), которые они представляют.

<table>
  <tbody>
    <tr>
      <td><code>@Request(), @Req()</code></td>
      <td><code>req</code></td>
    </tr>
    <tr>
      <td><code>@Response(), @Res()</code></td>
      <td><code>res</code></td>
    </tr>
    <tr>
      <td><code>@Next()</code></td>
      <td><code>next</code></td>
    </tr>
    <tr>
      <td><code>@Session()</code></td>
      <td><code>req.session</code></td>
    </tr>
    <tr>
      <td><code>@Param(param?: string)</code></td>
      <td><code>req.params</code> / <code>req.params[param]</code></td>
    </tr>
    <tr>
      <td><code>@Body(param?: string)</code></td>
      <td><code>req.body</code> / <code>req.body[param]</code></td>
    </tr>
    <tr>
      <td><code>@Query(param?: string)</code></td>
      <td><code>req.query</code> / <code>req.query[param]</code></td>
    </tr>
    <tr>
      <td><code>@Headers(param?: string)</code></td>
      <td><code>req.headers</code> / <code>req.headers[param]</code></td>
    </tr>
    <tr>
      <td><code>@Ip()</code></td>
      <td><code>req.ip</code></td>
    </tr>
    <tr>
      <td><code>@HostParam()</code></td>
      <td><code>req.hosts</code></td>
    </tr>
  </tbody>
</table>

Кроме того, вы можете создавать свои собственные **настраиваемые декораторы**. Почему это полезно?

В мире node.js принято прикреплять свойства к объекту **request**. Затем вы вручную извлекаете их в каждом обработчике 
маршрута, используя код, подобный следующему:

```typescript
const user = req.user;
```

Чтобы сделать ваш код более читаемым и прозрачным, вы можете создать декоратор `@User()` и повторно использовать 
его во всех ваших контроллерах.

<div class="filename">user.decorator.ts</div>

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

Затем вы можете просто использовать его там, где это соответствует вашим требованиям.


```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

## Передача данных

Когда поведение вашего декоратора зависит от некоторых условий, вы можете использовать параметр `data` для передачи 
аргумента в функцию-фабрику декоратора. Одним из примеров такого использования является пользовательский декоратор, 
который извлекает свойства из объекта запроса по ключу. 

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

Давайте определим декоратор, который принимает имя свойства в качестве ключа и возвращает связанное с ним значение, 
если оно существует (или undefined, если оно не существует, или если объект `user` не был создан).

<div class="filename">user.decorator.ts</div>

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
```

Вот как вы можете получить доступ к определенному свойству через декоратор `@User()` в контроллере:

```typescript
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

Вы можете использовать один и тот же декоратор с разными ключами для доступа к разным свойствам. Если объект `user` 
является глубоким или сложным, это может облегчить и сделать более читаемыми реализации обработчиков запросов.

> Для пользователей TypeScript обратите внимание, что `createParamDecorator<T>()` является 
> дженериком. Это означает, что вы можете явно обеспечить безопасность типов, например, 
> `createParamDecorator<string>((data, ctx) => ...)`. В качестве альтернативы, укажите тип параметра в фабричной 
> функции, например `createParamDecorator((data: string, ctx) => ...)`. Если вы опустите оба параметра, тип для `data` 
> будет `any`.

## Работа с pipes

Nest обращается с пользовательскими декораторами параметров так же, как и со встроенными (`@Body()`, `@Param()` и `@Query()`). 
Это означает, что pipes выполняются и для пользовательских аннотированных параметров (в наших примерах это аргумент `user`). 
Более того, вы можете применить pipe непосредственно к пользовательскому декоратору:

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

> Обратите внимание, что параметр `validateCustomDecorators` должен быть установлен в true. По умолчанию `ValidationPipe` 
> не проверяет аргументы, аннотированные пользовательскими декораторами.

## Композиция декораторов

Nest предоставляет вспомогательный метод для композиции нескольких декораторов. Например, предположим, что вы хотите 
объединить все декораторы, связанные с аутентификацией, в один декоратор. Это можно сделать с помощью следующей конструкции:

<div class="filename">auth.decorator.ts</div>

```typescript
import { applyDecorators } from '@nestjs/common';
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
```
Затем вы можете использовать этот пользовательский декоратор `@Auth()` следующим образом:

```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```

Это дает эффект применения всех четырех декораторов с помощью одного объявления.


> Декоратор `@ApiHideProperty()` из пакета `@nestjs/swagger` не является композитным и не будет правильно работать 
> с функцией `applyDecorators`.





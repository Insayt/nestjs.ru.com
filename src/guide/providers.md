# Провайдеры

Провайдеры - это фундаментальная концепция в Nest. Многие из основных классов Nest могут рассматриваться как 
провайдеры - сервисы, репозитории, фабрики, хелперы и так далее. Основная идея провайдера заключается в том, что 
он может быть внедрен как зависимость; это означает, что объекты могут создавать различные отношения друг с другом, 
а функция "подключения" экземпляров объектов может быть в значительной степени делегирована системе выполнения Nest.

<img src="/Components_1.png" />

В предыдущей главе мы создали простой контроллер `CatsController`. Контроллеры должны обрабатывать HTTP-запросы и 
делегировать более сложные задачи *провайдерам*. Провайдеры - это обычные классы JavaScript, которые объявляются в 
[модуле](/modules) как `providers`.

> Поскольку Nest дает возможность проектировать и организовывать зависимости более OO-способом, мы настоятельно 
> рекомендуем следовать принципам SOLID.

## Сервисы

Давайте начнем с создания простого сервиса `CatsService`. Этот сервис будет отвечать за хранение и получение данных и 
предназначен для использования контроллером `CatsController`, поэтому он является хорошим кандидатом на определение в 
качестве провайдера.

<div class="filename">cats.service.ts</div>

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

> Чтобы создать сервис с помощью CLI, просто выполните команду `$ nest g service cats`

Наш `CatsService` - это базовый класс с одним свойством и двумя методами. Единственной новой особенностью является то, 
что он использует декоратор `@Injectable()`. Декоратор `@Injectable()` объявляет, что 
`CatsService` - это класс, которым может управлять IoC-контейнер Nest. Кстати, в этом примере также используется 
интерфейс `Cat`, который, вероятно, выглядит примерно так:

<div class="filename">interfaces/cat.interface.ts</div>

```typescript
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

Теперь, когда у нас есть класс сервиса для получения кошек, давайте используем его внутри `CatsController`:

<div class="filename">cats.controller.ts</div>

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService` инжектируется через конструктор класса. Обратите внимание на использование синтаксиса `private`. 
Это сокращение позволяет нам и объявить, и инициализировать `catsService` сразу в одном и том же месте.

## Внедрение зависимостей (Dependency injection)

Nest построен на основе классного паттерна проектирования, известного как внедрение зависимостей. 
Мы рекомендуем прочитать большую статью об этой концепции в официальной документации 
[Angular](https://angular.io/guide/dependency-injection).

В Nest, благодаря возможностям TypeScript, очень легко управлять зависимостями, поскольку они разрешаются просто 
по типу. В приведенном ниже примере Nest разрешит зависимость `catsService`, создав и вернув экземпляр 
`CatsService` (или, в обычном случае синглтона, вернув существующий экземпляр, если он уже был запрошен 
в другом месте). Эта зависимость разрешается и передается в конструктор вашего контроллера 
(или присваивается указанному свойству):

```typescript
constructor(private catsService: CatsService) {}
```

## Scopes

Провайдеры обычно имеют время жизни ("scope"), синхронизированное с жизненным циклом приложения. 
Когда приложение загружается, каждая зависимость должна быть разрешена, и поэтому каждый провайдер должен быть 
инициализирован. Аналогично, при завершении работы приложения каждый провайдер будет уничтожен. Однако существуют 
способы сделать так, чтобы время жизни провайдера также зависело от запросов. Подробнее об этих способах 
вы можете прочитать [здесь](/guide/fundamentals/injection-scopes.html).

<demo-component></demo-component>

## Пользовательские провайдеры

Nest имеет встроенный контейнер инверсии управления ("IoC"), который разрешает отношения между провайдерами. 
Эта функция лежит в основе функции dependency injection, описанной выше, но на самом деле она гораздо мощнее, 
чем то, что мы описали до сих пор. Существует несколько способов определения провайдера: вы можете использовать 
простые значения, классы, асинхронные или синхронные фабрики. Больше примеров приведено [здесь](/guide/fundamentals/custom-providers.html).

## Необязательные провайдеры

Иногда у вас могут быть зависимости, которые не обязательно должны быть разрешены. Например, ваш класс может зависеть 
от объекта конфигурации, но если он не передан, то следует использовать значения по умолчанию. В таком случае 
зависимость становится необязательной, поскольку отсутствие провайдера конфигурации не приведет к ошибкам.

Чтобы указать, что провайдер является необязательным, используйте декоратор `@Optional()` в аргументах конструктора.

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

Обратите внимание, что в приведенном примере мы используем пользовательский провайдер, и именно поэтому мы включаем 
пользовательский маркер `HTTP_OPTIONS`. Предыдущие примеры показывали инъекцию на основе конструктора, указывающую 
на зависимость через класс в конструкторе. Подробнее о пользовательских провайдерах читайте [здесь](/guide/fundamentals/custom-providers.html).

## Инъекция на основе свойств

Техника, которую мы использовали до сих пор, называется инъекцией на основе конструктора, поскольку провайдеры 
инжектируются через метод конструктора. В некоторых специфических случаях может оказаться полезной *инъекция 
на основе свойств*. Например, если ваш класс верхнего уровня зависит от одного или нескольких провайдеров, 
передавать их по всему пути наверх, вызывая `super()` в подклассах из конструктора, может быть очень утомительно. 
Чтобы избежать этого, вы можете использовать декоратор `@Inject()` на уровне свойств.

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpClient: T;
}
```

> Если ваш класс не расширяет другой провайдер, вы всегда должны использовать инъекции на основе конструктора.

## Регистрация провайдера

Теперь, когда мы определили провайдера (`CatsService`) и у нас есть контроллер (`CatsController`), 
нам нужно зарегистрировать сервис в Nest, чтобы он мог выполнять инъекции. Для этого нужно отредактировать файл 
нашего модуля (`app.module.ts`) и добавить сервис в массив `providers` декоратора `@Module()`.

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

Теперь Nest сможет разрешить зависимости класса `CatsController`.

Вот так теперь должна выглядеть наша структура каталогов:

<div class="file-tree">
   <div class="item">src</div>
   <div class="children">
      <div class="item">cats</div>
      <div class="children">
         <div class="item">dto</div>
         <div class="children">
            <div class="item">create-cat.dto.ts</div>
         </div>
         <div class="item">interfaces</div>
         <div class="children">
            <div class="item">cat.interface.ts</div>
         </div>
         <div class="item">cats.controller.ts</div>
         <div class="item">cats.service.ts</div>
      </div>
      <div class="item">app.module.ts</div>
      <div class="item">main.ts</div>
   </div>
</div>

## Ручное создание экземпляров

До сих пор мы обсуждали, как Nest автоматически обрабатывает большинство деталей разрешения зависимостей. 
В некоторых случаях вам может потребоваться выйти за рамки встроенной системы Dependency Injection и вручную 
получить или создать экземпляр провайдера. Ниже мы кратко рассмотрим две такие темы.

Чтобы получить существующие экземпляры или создать экземпляр провайдера динамически, вы можете использовать 
[ссылку на модуль](/guide/fundamentals/module-ref.html).

Для получения провайдеров в функции `bootstrap()` (например, для автономных (stanalone) приложений без контроллеров или для 
использования службы конфигурации во время загрузки) смотрите раздел [Автономные приложения](https://docs.nestjs.com/standalone-applications).


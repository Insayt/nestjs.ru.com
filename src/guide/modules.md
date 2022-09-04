# Модули

Модуль - это класс, с декоратором `@Module()`. Декоратор `@Module()` предоставляет метаданные, 
которые **Nest** использует для организации структуры приложения.

<img src="/Modules_1.png" />

Каждое приложение имеет как минимум один модуль, **корневой модуль**. Корневой модуль является отправной точкой, 
которую Nest использует для построения **графа приложения** - внутренней структуры данных, которую Nest использует 
для разрешения отношений и зависимостей между модулями и провайдерами. Хотя очень маленькие приложения теоретически 
могут иметь только корневой модуль, это не типичный случай. Мы хотим подчеркнуть, что модули **настойчиво** 
рекомендуются как эффективный способ организации ваших компонентов. Таким образом, для большинства приложений 
в результирующей архитектуре будет использоваться несколько модулей, каждый из которых будет содержать тесно 
связанный набор **возможностей**.

Декоратор `@Module()` принимает один объект, свойства которого описывают модуль:

| | |
|-|-|
| `providers`   | провайдеры, которые будут инициализироваться инжектором Nest и которые могут быть общими, по крайней мере, в этом модуле |
| `controllers` | набор контроллеров, определенных в данном модуле, которые должны быть инициализированы  |
| `imports`     | список импортированных модулей, экспортирующих провайдеры, которые требуются в данном модуле |
| `exports`     | подмножество `providers`, которые предоставляются этим модулем и должны быть доступны в других модулях, импортирующих этот модуль. Вы можете использовать либо сам провайдер, либо только его токен (значение `provide`)|

По умолчанию модуль **инкапсулирует** провайдеры. Это означает, что невозможно внедрить провайдеры, 
которые не являются непосредственной частью текущего модуля и не экспортируются из импортируемых модулей. 
Таким образом, вы можете рассматривать экспортированные провайдеры из модуля как публичный интерфейс модуля, или API.

## Функциональные модули

`CatsController` и `CatsService` относятся к одной и той же области применения. Поскольку они тесно связаны, 
имеет смысл объединить их в функциональный модуль. Функциональный модуль просто организует код, относящийся 
к определенной функции, сохраняя его организованность и устанавливая четкие границы. Это помогает нам управлять 
сложностью и разрабатывать в соответствии с принципами [SOLID](https://en.wikipedia.org/wiki/SOLID), особенно 
по мере роста размера приложения и/или команды.

<div class="filename">cats/cats.module</div>

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

> Чтобы создать модуль с помощью CLI, просто выполните команду `$ nest g module cats`.

Выше мы определили `CatsModule` в файле `cats.module.ts` и перенесли все, связанное с этим модулем, 
в каталог `cats`. Последнее, что нам нужно сделать, это импортировать этот модуль в корневой модуль 
(`AppModule`, определенный в файле `app.module.ts`).

<div class="filename">app.module</div>

```typescript
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
@Module({
  imports: [CatsModule],
})
export class AppModule {}
```

Вот как теперь выглядит наша структура каталогов:

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
      <div class="item">cats.module.ts</div>
      <div class="item">cats.service.ts</div>
    </div>
    <div class="item">app.module.ts</div>
    <div class="item">main.ts</div>
  </div>
</div>

## Общие модули

В Nest модули по умолчанию являются **синглтонами**, и поэтому вы можете без труда пошарить один и тот же 
экземпляр любого провайдера между несколькими модулями.

<img src="/Shared_Module_1.png" />

Каждый модуль автоматически является **общим модулем**. Созданный однажды, он может быть повторно использован 
любым модулем. Представим, что мы хотим пошарить экземпляр `CatsService` между несколькими другими модулями. 
Для этого нам сначала нужно **экспортировать** провайдер `CatsService`, добавив его в массив `exports` модуля, 
как показано ниже:

<div class="filename">cats.module</div>

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

Теперь любой модуль, импортирующий `CatsModule`, имеет доступ к `CatsService` и будет использовать один и тот 
же экземпляр со всеми другими модулями, которые импортируют его.

<demo-component></demo-component>

## Реэкспорт модулей

Как было показано выше, модули могут экспортировать своих внутренних провайдеров. Кроме того, 
они могут реэкспортировать модули, которые они импортируют. В приведенном ниже примере `CommonModule` 
импортируется **и** экспортируется из `CoreModule`, что делает его доступным для других модулей, которые 
импортируют этот модуль.

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## Внедрение зависимостей (Dependency injection)

Класс модуля может **инжектировать** провайдеров (например, для целей конфигурации):

<div class="filename">cats.module</div>

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

Однако сами классы модулей не могут быть инжектированы в качестве провайдеров из-за 
[круговой зависимости](/guide/fundamentals/circular-dependency.html).

## Глобальные модули

Если вам приходится импортировать один и тот же набор модулей повсюду, это может стать утомительным. 
В отличие от Nest, в [Angular](https://angular.io) `провайдеры` регистрируются в глобальной области видимости. 
Как только они определены, они доступны везде. Nest, однако, инкапсулирует провайдеров внутри области видимости модуля. 
Вы не сможете использовать провайдеры модуля в других местах без предварительного импорта инкапсулирующего модуля.

Если вы хотите предоставить набор провайдеров, которые должны быть доступны везде из коробки 
(например, помощники соединения с базой данных и т.д.), сделайте модуль **глобальным** с помощью декоратора `@Global()`.

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

Декоратор `@Global()` делает модуль глобальным. Глобальные модули должны быть зарегистрированы 
**только один раз**, обычно корневым или основным модулем. В приведенном выше примере провайдер `CatsService` 
будет доступен везде, и модулям, желающим внедрить сервис, не нужно будет импортировать `CatsModule` в свой массив imports.

> Делать все глобальным - не лучшее дизайнерское решение. Глобальные модули существуют 
> для того, чтобы уменьшить количество необходимого шаблонного кода. Массив `imports` обычно является предпочтительным 
> способом сделать API модуля доступным для потребителей.

## Динамические модули

Система модулей Nest включает в себя мощную функцию под названием **динамические модули**. Эта функция позволяет 
легко создавать настраиваемые модули, которые могут регистрировать и конфигурировать провайдеров динамически. 
Динамические модули подробно рассматриваются [здесь](/guide/fundamentals/dynamic-modules.html). В этой главе мы дадим краткий 
обзор, чтобы завершить знакомство с модулями.

Ниже приведен пример определения динамического модуля для `DatabaseModule`:

```typescript
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';
@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

> Метод `forRoot()` может возвращать динамический модуль синхронно или асинхронно (т.е. через `Promise`).
> Этот модуль по умолчанию определяет провайдера `Connection` (в метаданных декоратора `@Module()`), но дополнительно - 
> в зависимости от объектов `entities` и `options`, переданных в метод `forRoot()` - раскрывает коллекцию провайдеров, 
> например, репозиториев. Обратите внимание, что свойства, возвращаемые динамическим модулем, **расширяют** 
> (а не переопределяют) метаданные базового модуля, определенные в декораторе `@Module()`. Таким образом из модуля 
> экспортируются статически объявленный провайдер `Connection` **и** динамически создаваемые провайдеры хранилищ.

Если вы хотите зарегистрировать динамический модуль в глобальной области видимости, установите свойство `global` в `true`.

```typescript
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}
```
> Как уже говорилось выше, делать всё глобальным **не лучшее решение**.

Модуль `DatabaseModule` может быть импортирован и настроен следующим образом:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

Если вы хотите в свою очередь реэкспортировать динамический модуль, вы можете опустить вызов метода `forRoot()` 
в массиве exports:

```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```

В главе [Динамические модули](/guide/fundamentals/dynamic-modules.html) эта тема рассматривается более подробно и включает 
[рабочий пример](https://github.com/nestjs/nest/tree/master/sample/25-dynamic-modules).

# Пользовательские провайдеры

В предыдущих главах мы коснулись различных аспектов **инъекции зависимостей (DI)** и того, как она используется в Nest. 
Одним из примеров является инъекция зависимостей на [основе конструктора](/guide/providers.html#внедрение-зависимостеи-dependency-injection), 
используемая для инъекции экземпляров (часто providers) в классы. Вы не удивитесь, узнав, что Dependency Injection встроен 
в ядро Nest фундаментальным образом. До сих пор мы рассмотрели только один основной паттерн. По мере усложнения вашего 
приложения вам может понадобиться использовать все возможности системы DI, поэтому давайте изучим их более подробно.

## Основы DI

Инъекция зависимостей - это техника [инверсии управления (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control), 
при которой вы делегируете инстанцирование зависимостей IoC-контейнеру (в нашем случае - системе исполнения NestJS), 
вместо того чтобы делать это в собственном коде императивно. Давайте рассмотрим, что происходит в этом примере 
из главы [Providers](/guide/providers.html).

Сначала мы определяем провайдера. Декоратор `@Injectable()` отмечает класс `CatsService` как провайдер.

<div class="filename">cats.service.ts</div>

```typescript
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];
  findAll(): Cat[] {
    return this.cats;
  }
}
```

Затем мы просим Nest внедрить провайдер в наш класс контроллера:

<div class="filename">cats.controller.ts</div>

```typescript
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}
  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

Наконец, мы регистрируем провайдера в IoC-контейнере Nest:

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

Что именно происходит под капотом, чтобы это сработало? В этом процессе есть три ключевых этапа:

1. В `cats.service.ts` декоратор `@Injectable()` объявляет класс `CatsService` как класс, которым может управлять IoC-контейнер Nest.
2. В `cats.controller.ts`, `CatsController` объявляет зависимость от сущности `CatsService` с помощью инъекции конструктора:

```typescript
  constructor(private catsService: CatsService)
```

3. В `app.module.ts` мы ассоциируем сущность `CatsService` с классом `CatsService` из файла `cats.service.ts`. Ниже мы увидим, как именно 
происходит эта ассоциация (также называемая _registration_)

Когда контейнер Nest IoC инстанцирует `CatsController`, он сначала ищет любые зависимости\*. Когда он находит 
зависимость `CatsService`, он выполняет поиск по токену `CatsService`, который возвращает класс `CatsService`, 
согласно шагу регистрации (#3 выше). Предполагая область видимости `SINGLETON` (поведение по умолчанию), Nest 
затем либо создаст экземпляр `CatsService`, кэширует его и вернет, либо, если он уже кэширован, вернет существующий 
экземпляр.

\*Это объяснение немного упрощено, чтобы проиллюстрировать суть. Мы упустили один важный момент: процесс анализа кода 
на наличие зависимостей очень сложен и происходит во время загрузки приложения. Одна из ключевых особенностей заключается 
в том, что анализ зависимостей (или "создание графа зависимостей") является **переходным**. В приведенном выше примере, 
если бы сам `CatsService` имел зависимости, они тоже были бы разрешены. Граф зависимостей гарантирует, что зависимости 
будут разрешены в правильном порядке - по сути, "снизу вверх". Этот механизм освобождает разработчика от необходимости 
управлять такими сложными графами зависимостей.

<demo-component></demo-component>

## Стандартные провайдеры

Давайте подробнее рассмотрим декоратор `@Module()`. В `app.module` мы объявляем:

```typescript
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
```

Свойство `providers` принимает массив `providers`. До сих пор мы предоставляли этих поставщиков через список имен классов. 
Фактически, синтаксис `providers: [CatsService]` является сокращением для более полного синтаксиса:

```typescript
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

Теперь, когда мы видим эту явную конструкцию, мы можем понять процесс регистрации. Здесь мы явно связываем 
токен `CatsService` с классом `CatsService`. Сокращенное обозначение - это просто удобство для упрощения наиболее 
распространенного случая использования, когда маркер используется для запроса экземпляра класса с тем же именем.

## Пользовательские провайдеры

Что происходит, когда ваши требования выходят за рамки тех, которые предлагают _стандартные провайдеры_? Вот несколько примеров:

- Вы хотите создать пользовательский экземпляр класса вместо того, чтобы Nest инстанцировал (или возвращал кэшированный экземпляр).
- Вы хотите повторно использовать существующий класс во второй зависимости
- Вы хотите переопределить класс с помощью его имитационной версии для тестирования


Nest позволяет вам определять пользовательские провайдеры для обработки этих случаев. Он предоставляет несколько способов 
определения пользовательских провайдеров. Давайте рассмотрим их.

> Если у вас возникают проблемы с разрешением зависимостей, вы можете установить переменную окружения 
> `NEST_DEBUG` и получить дополнительные логи разрешения зависимостей при запуске.

## Провайдеры значений: `useValue`

Синтаксис `useValue` полезен для введения постоянного значения, размещения внешней библиотеки в контейнере Nest 
или замены реальной реализации на объект-макет. Допустим, вы хотите заставить Nest использовать макет `CatsService` 
для тестирования.

```typescript
import { CatsService } from './cats.service';
const mockCatsService = {
  /* mock implementation
  ...
  */
};
@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```


В этом примере токен `CatsService`, будет инстансом объекта-имитатора `mockCatsService`. Функция `useValue` требует 
значения - в данном случае объект, который имеет тот же интерфейс, что и класс `CatsService`, который он 
заменяет. Благодаря [структурной типизации] TypeScript (https://www.typescriptlang.org/docs/handbook/type-compatibility.html) 
вы можете использовать любой объект, имеющий совместимый интерфейс, включая литеральный объект или экземпляр класса, 
созданный с помощью `new`.

## Провайдеры, не основанные на классах

До сих пор мы использовали имена классов в качестве маркеров провайдеров (значение свойства `provide` в провайдере, 
перечисленном в массиве `providers`). Это соответствует стандартному шаблону, используемому в 
[инъекции на основе конструктора](/guide/providers.html#внедрение-зависимостеи-dependency-injection), где маркером также 
является имя класса.

Если это понятие не совсем понятно, вернитесь ещё разок к [основы DI](/guide/fundamentals/custom-providers.html#основы-di)
Иногда мы можем захотеть использовать строки или символы в качестве маркера DI. Например:

```typescript
import { connection } from './connection';
@Module({
  providers: [
    {
      provide: 'CONNECTION',
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

В этом примере мы связываем токен со строковым значением (`'CONNECTION'`) с уже существующим объектом `connection`, 
который мы импортировали из внешнего файла.

> В дополнение к использованию строк в качестве значений маркеров, вы также можете использовать 
> [JavaScript символы](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 
> или [перечисления](https://www.typescriptlang.org/docs/handbook/enums.html).

Ранее мы уже рассматривали, как внедрить провайдера с помощью стандартного шаблона 
[инъекция на основе конструктора](https://docs.nestjs.com/providers#dependency-injection). Этот шаблон **требует**, 
чтобы зависимость была объявлена с именем класса. Пользовательский провайдер `'CONNECTION'` использует токен со строковым 
значением. Рассмотрим, как инжектировать такой провайдер. Для этого мы используем декоратор `@Inject()`. Этот декоратор 
принимает единственный аргумент - токен.

```typescript
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

> Декоратор `@Inject()` импортируется из пакета `@nestjs/common`.

Хотя мы непосредственно используем строку `'CONNECTION'` в приведенных выше примерах для иллюстрации, для чистоты 
организации кода лучше всего определять маркеры в отдельном файле, например, `constants.ts`. Обращайтесь с ними так же, 
как с символами или перечислениями, которые определяются в собственном файле и импортируются по мере необходимости.


## Провайдеры классов: `useClass`

Синтаксис `useClass` позволяет динамически определять класс, к которому должен разрешаться токен. Например, предположим, 
что у нас есть абстрактный класс `ConfigService` (или класс по умолчанию). В зависимости от текущего окружения, мы хотим, 
чтобы Nest предоставлял различные реализации сервиса конфигурации. Следующий код реализует такую стратегию.

```typescript
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === 'development'
      ? DevelopmentConfigService
      : ProductionConfigService,
};
@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```
Давайте рассмотрим несколько деталей в этом примере кода. Вы заметите, что мы сначала определяем `configServiceProvider` 
с литеральным объектом, а затем передаем его в свойстве `providers` декоратора модуля. Это просто небольшая организация 
кода, но функционально она эквивалентна примерам, которые мы использовали до сих пор в этой главе.

Кроме того, мы использовали имя класса `ConfigService` в качестве маркера. Для любого класса, который зависит 
от `ConfigService`, Nest будет инжектировать экземпляр предоставленного класса (`DevelopmentConfigService` 
или `ProductionConfigService`), переопределяя любую реализацию по умолчанию, которая может быть объявлена в другом месте 
(например, `ConfigService`, объявленный с декоратором `@Injectable()`).

## Фабрика провайдеров: `useFactory`.

Синтаксис `useFactory` позволяет создавать провайдеров **динамически**. Фактический провайдер будет предоставлен значением, 
возвращаемым из фабричной функции. Функция фабрики может быть как простой, так и сложной. Простая фабрика может 
не зависеть от других провайдеров. Более сложная фабрика может сама вводить других провайдеров, необходимых ей для вычисления 
результата. Для последнего случая синтаксис фабричного провайдера имеет пару связанных механизмов:

1. Фабричная функция может принимать (необязательные) аргументы.
2. Свойство (необязательное) `inject` принимает массив провайдеров, которые Nest будет разрешать и передавать в качестве 
   аргументов функции-фабрике в процессе инстанцирования. Эти два списка должны быть соотнесены: Nest будет передавать 
   экземпляры из списка `inject` в качестве аргументов функции-фабрики в том же порядке.

Пример ниже демонстрирует это.

```typescript
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};
@Module({
  providers: [connectionFactory],
})
export class AppModule {}
```

## Псевдонимы провайдеров: `useExisting`.

Синтаксис `useExisting` позволяет вам создавать псевдонимы для существующих провайдеров. Это позволяет создать два способа 
доступа к одному и тому же провайдеру. В примере ниже (строковый) маркер `'AliasedLoggerService'` является псевдонимом 
для (основанного на классе) маркера `LoggerService`. Предположим, что у нас есть две разные зависимости, одна 
для `'AliasedLoggerService'` и одна для `LoggerService`. Если обе зависимости указаны с областью видимости `SINGLETON`, 
они будут разрешаться в один и тот же экземпляр.

```typescript
@Injectable()
class LoggerService {
  /* implementation details */
}
const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};
@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

## Провайдеры без сервисов

Хотя провайдеры часто предоставляют услуги, они не ограничены этим использованием. Провайдер может предоставить **любое** 
значение. Например, провайдер может предоставить массив объектов конфигурации, основанных на текущей среде, как показано ниже:


```typescript
const configFactory = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
  },
};
@Module({
  providers: [configFactory],
})
export class AppModule {}
```

## Экспорт пользовательского провайдера

Как и любой другой провайдер, пользовательский провайдер привязан к объявляющему его модулю. Чтобы сделать его видимым 
для других модулей, его необходимо экспортировать. Для экспорта пользовательского провайдера мы можем использовать либо 
его маркер, либо полный объект провайдера.

В следующем примере показан экспорт с использованием маркера:

```typescript
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};
@Module({
  providers: [connectionFactory],
  exports: ['CONNECTION'],
})
export class AppModule {}
```

В качестве альтернативы вы можете экспортировать полный объект провайдера:

```typescript
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};
@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```


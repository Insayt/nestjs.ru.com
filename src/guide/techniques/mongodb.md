# Монго

Nest поддерживает два метода интеграции с базой данных [MongoDB](https://www.mongodb.com/). Вы можете либо использовать 
встроенный модуль [TypeORM](https://github.com/typeorm/typeorm), описанный [здесь](/guide/techniques/database), который имеет 
коннектор для MongoDB, либо использовать [Mongoose](https://mongoosejs.com), наиболее популярный инструмент объектного 
моделирования MongoDB. В этой главе мы опишем последний вариант, используя специальный пакет `@nestjs/mongoose`.

Начните с установки необходимых зависимостей:

```bash
$ npm install --save @nestjs/mongoose mongoose
```

После завершения процесса установки мы можем импортировать `MongooseModule` в корневой `AppModule`.

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}
```

Метод `forRoot()` принимает тот же объект конфигурации, что и `mongoose.connect()` из пакета Mongoose, как описано 
[здесь](https://mongoosejs.com/docs/connections.html).

## Инъекция модели

В Mongoose все происходит от [Schema](http://mongoosejs.com/docs/guide.html). Каждая схема привязывается к коллекции 
MongoDB и определяет форму документов в этой коллекции. Схемы используются для определения [Моделей](https://mongoosejs.com/docs/models.html). 
Модели отвечают за создание и чтение документов из базовой базы данных MongoDB.

Схемы могут быть созданы с помощью декораторов NestJS или вручную в Mongoose. Использование декораторов для создания 
схем значительно сокращает кодовую таблицу и улучшает общую читабельность кода.

Давайте определим `CatSchema`:

<div class="filename">schemas/cat.schema.ts</div>

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type CatDocument = Cat & Document;
@Schema()
export class Cat {
  @Prop()
  name: string;
  @Prop()
  age: number;
  @Prop()
  breed: string;
}
export const CatSchema = SchemaFactory.createForClass(Cat);
```

> Обратите внимание, что вы также можете сгенерировать сырое (raw) определение схемы, используя класс `DefinitionsFactory` 
> (из `nestjs/mongoose`). Это позволит вам вручную изменить сгенерированное определение схемы на основе предоставленных 
> вами метаданных. Это полезно в некоторых случаях, когда сложно описать все с помощью декораторов.

Декоратор `@Schema()` помечает класс как определение схемы. Он сопоставляет наш класс `Cat` с одноименной коллекцией MongoDB, 
но с дополнительной "s" в конце - таким образом, окончательное имя коллекции mongo будет `cats`. Этот декоратор принимает 
один необязательный аргумент, который представляет собой объект опций схемы. Считайте, что это объект, который вы обычно 
передаете в качестве второго аргумента конструктора класса `mongoose.Schema` (например, `new mongoose.Schema(_, options)`). 
Чтобы узнать больше о доступных опциях схемы, смотрите главу [здесь](https://mongoosejs.com/docs/guide.html#options).

Декоратор `@Prop()` определяет свойство в документе. Например, в приведенной выше схеме мы определили три 
свойства: `name`, `age` и `breed`. Типы [schema types](https://mongoosejs.com/docs/schematypes.html) для этих свойств 
определяются автоматически благодаря возможностям метаданных TypeScript. Однако в более сложных сценариях, 
в которых типы не могут быть отражены явно (например, массивы или вложенные структуры объектов), типы должны быть указаны 
явно, как показано ниже:

```typescript
@Prop([String])
tags: string[];
```

В качестве альтернативы декоратор `@Prop()` принимает аргумент объекта options 
([подробнее](https://mongoosejs.com/docs/schematypes.html#schematype-options) о доступных опциях). С его помощью вы можете 
указать, является ли свойство обязательным или нет, указать значение по умолчанию или пометить его как неизменяемое. Например:

```typescript
@Prop({ required: true })
name: string;
```

В случае если вы хотите указать связь с другой моделью, позже для заполнения, вы также можете использовать декоратор 
`@Prop()`. Например, если у `Cat` есть `Owner`, который хранится в другой коллекции `owners`, свойство должно иметь тип 
и ref. Например:

```typescript
import * as mongoose from 'mongoose';
import { Owner } from '../owners/schemas/owner.schema';
// внутри определения класса
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
owner: Owner;
```

В случае если `Owner` несколько, конфигурация вашего `@Prop` должна выглядеть следующим образом:

```typescript
@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
owner: Owner[];
```

Наконец, декоратору может быть передано и определение схемы **raw**. Это полезно, когда, например, свойство представляет 
вложенный объект, который не определен как класс. Для этого используйте функцию `raw()` из пакета `@nestjs/mongoose`, 
как показано ниже:

```typescript
@Prop(raw({
  firstName: { type: String },
  lastName: { type: String }
}))
details: Record<string, any>;
```

В качестве альтернативы, если вы предпочитаете **не использовать декораторы**, вы можете определить схему вручную. 
Например:

```typescript
export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});
```

Файл `cat.schema` находится в папке в директории `cats`, где мы также определяем `CatsModule`. Хотя вы можете хранить 
файлы схем там, где вам удобно, мы рекомендуем хранить их рядом с соответствующими **доменными** объектами, в соответствующей 
директории модуля.

Давайте рассмотрим `CatsModule`:

<div class="filename">cats.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './schemas/cat.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```

Модуль `MongooseModule` предоставляет метод `forFeature()` для конфигурации модуля, включая определение того, какие 
модели должны быть зарегистрированы в текущей области видимости. Если вы также хотите использовать модели в другом модуле, 
добавьте MongooseModule в секцию `exports` модуля `CatsModule` и импортируйте `CatsModule` в другой модуль.

После регистрации схемы вы можете внедрить модель `Cat` в `CatsService` с помощью декоратора `@InjectModel()`:

<div class="filename">cats.service.ts</div>

```typescript
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, CatDocument } from './schemas/cat.schema';
import { CreateCatDto } from './dto/create-cat.dto';
@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}
  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }
  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }
}
```

## Соединение

Иногда вам может понадобиться доступ к родному объекту [Mongoose Connection](https://mongoosejs.com/docs/api.html#Connection). 
Например, вам может понадобиться сделать нативные вызовы API на объекте соединения. Вы можете инжектировать Mongoose Connection, 
используя декоратор `@InjectConnection()` следующим образом:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
@Injectable()
export class CatsService {
  constructor(@InjectConnection() private connection: Connection) {}
}
```

## Несколько баз данных

Некоторые проекты требуют подключения к нескольким базам данных. Этого также можно добиться с помощью данного модуля. 
Чтобы работать с несколькими соединениями, сначала создайте соединения. В этом случае именование соединений становится 
**обязательным**.

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionName: 'cats',
    }),
    MongooseModule.forRoot('mongodb://localhost/users', {
      connectionName: 'users',
    }),
  ],
})
export class AppModule {}
```

> Обратите внимание, что у вас не должно быть несколько соединений без имени или с одинаковым именем, иначе они будут переопределены.

При такой настройке вы должны указать функции `MongooseModule.forFeature()`, какое соединение должно быть использовано.

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }], 'cats'),
  ],
})
export class AppModule {}
```

Вы также можете инжектировать `Connection` для данного соединения:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
@Injectable()
export class CatsService {
  constructor(@InjectConnection('cats') private connection: Connection) {}
}
```

Чтобы внедрить заданное `Connection` в пользовательский провайдер (например, фабричный провайдер), используйте функцию 
`getConnectionToken()`, передавая имя соединения в качестве аргумента.

```typescript
{
  provide: CatsService,
  useFactory: (catsConnection: Connection) => {
    return new CatsService(catsConnection);
  },
  inject: [getConnectionToken('cats')],
}
```

## Хуки (промежуточное программное обеспечение)

Промежуточное ПО (также называемое пред- и пост-хуками) - это функции, которым передается управление во время 
выполнения асинхронных функций. Middleware задаются на уровне схемы и полезны для написания плагинов 
([источник](https://mongoosejs.com/docs/middleware.html)). Вызов `pre()` или `post()` после компиляции модели не работает 
в Mongoose. Чтобы зарегистрировать хук **до** регистрации модели, используйте метод `forFeatureAsync()` модуля `MongooseModule` 
вместе с провайдером фабрики (т.е. `useFactory`). С помощью этой техники вы можете получить доступ к объекту схемы, 
а затем использовать метод `pre()` или `post()` для регистрации хука на этой схеме. См. пример ниже:

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatsSchema;
          schema.pre('save', function() { console.log('Hello from pre save') });
          return schema;
        },
      },
    ]),
  ],
})
export class AppModule {}
```

Как и другие [factory providers](/guide/fundamentals/custom-providers#factory-providers-usefactory), 
наша фабричная функция может быть `async` и может инжектировать зависимости через `inject`.

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const schema = CatsSchema;
          schema.pre('save', function() {
            console.log(
              `${configService.get('APP_NAME')}: Hello from pre save`,
            ),
          });
          return schema;
        },
        inject: [ConfigService],
      },
    ]),
  ],
})
export class AppModule {}
```

## Плагины

Чтобы зарегистрировать [плагин](https://mongoosejs.com/docs/plugins.html) для данной схемы, используйте метод 
`forFeatureAsync()`.

```typescript
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: () => {
          const schema = CatsSchema;
          schema.plugin(require('mongoose-autopopulate'));
          return schema;
        },
      },
    ]),
  ],
})
export class AppModule {}
```

Чтобы зарегистрировать плагин для всех схем сразу, вызовите метод `.plugin()` объекта `Connection`. Вы должны 
получить доступ к соединению до создания моделей; для этого используйте `connectionFactory`:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/test', {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    }),
  ],
})
export class AppModule {}
```

## Дискриминаторы

[Discriminators](https://mongoosejs.com/docs/discriminators.html) - это механизм наследования схем. Они позволяют вам иметь 
несколько моделей с перекрывающимися схемами поверх одной и той же базовой коллекции MongoDB.

Предположим, вы хотите отслеживать различные типы событий в одной коллекции. Каждое событие будет иметь временную метку.

<div class="filename">event.schema.ts</div>

```typescript
@Schema({ discriminatorKey: 'kind' })
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: [ClickedLinkEvent.name, SignUpEvent.name],
  })
  kind: string;
  @Prop({ type: Date, required: true })
  time: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
```


> Способ, которым mongoose определяет разницу между различными моделями дискриминаторов - это "ключ дискриминатора", который 
> по умолчанию равен `__t`. Mongoose добавляет строковый путь `__t` к вашим схемам, который он использует для отслеживания того, 
> какой дискриминатор является экземпляром данного документа.
> Вы также можете использовать опцию `discriminatorKey`, чтобы определить путь для дискриминации.

Экземпляры `SignedUpEvent` и `ClickedLinkEvent` будут храниться в той же коллекции, что и общие события.

Теперь давайте определим класс `ClickedLinkEvent` следующим образом:

<div class="filename">click-link-event.schema.ts</div>

```typescript
@@filename()
export class ClickedLinkEvent {
  kind: string;
  time: Date;
  @Prop({ type: String, required: true })
  url: string;
}
export const ClickedLinkEventSchema = SchemaFactory.createForClass(ClickedLinkEvent);
```

И класс `SignUpEvent`:

<div class="filename">sign-up-event.schema.ts</div>

```typescript
@@filename()
export class SignUpEvent {
  kind: string;
  time: Date;
  @Prop({ type: String, required: true })
  user: string;
}
export const SignUpEventSchema = SchemaFactory.createForClass(SignUpEvent);
```

После этого используйте опцию `discriminators` для регистрации дискриминатора для данной схемы. Это работает как 
в `MongooseModule.forFeature`, так и в `MongooseModule.forFeatureAsync`:

<div class="filename">event.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          { name: ClickedLinkEvent.name, schema: ClickedLinkEventSchema },
          { name: SignUpEvent.name, schema: SignUpEventSchema },
        ],
      },
    ]),
  ]
})
export class EventsModule {}
```

## Тестирование

При модульном тестировании приложения мы обычно хотим избежать любого подключения к базе данных, чтобы упростить настройку 
и ускорить выполнение наших тестовых наборов. Но наши классы могут зависеть от моделей, которые извлекаются из экземпляра 
соединения. Как нам разрешить эти классы? Решение заключается в создании имитационных моделей.

Чтобы сделать это проще, пакет `@nestjs/mongoose` предоставляет функцию `getModelToken()`, которая возвращает подготовленный 
[injection token](/guide/fundamentals/custom-providers#di-fundamentals) на основе имени токена. Используя 
этот токен, вы можете легко предоставить имитационную реализацию, используя любую из стандартных техник
[custom provider](/guide/fundamentals/custom-providers), включая `useClass`, `useValue` и `useFactory`. Например:

```typescript
@Module({
  providers: [
    CatsService,
    {
      provide: getModelToken(Cat.name),
      useValue: catModel,
    },
  ],
})
export class CatsModule {}
```

В этом примере жестко заданная `catModel` (экземпляр объекта) будет предоставляться всякий раз, когда любой потребитель 
инжектирует `Model<Cat>` с помощью декоратора `@InjectModel()`.

<demo-component></demo-component>

## Асинхронная конфигурация

Когда вам нужно передать параметры модуля асинхронно, а не статически, используйте метод `forRootAsync()`. Как и в большинстве 
динамических модулей, Nest предоставляет несколько методов для работы с асинхронной конфигурацией.

Один из методов - использование фабричной функции:

```typescript
MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost/nest',
  }),
});
```

Как и другие [factory providers](/guide/fundamentals/custom-providers#factory-providers-usefactory), 
наша фабричная функция может быть `async` и может инжектировать зависимости через `inject`.

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB_URI'),
  }),
  inject: [ConfigService],
});
```

В качестве альтернативы вы можете настроить `MongooseModule`, используя класс вместо фабрики, как показано ниже:

```typescript
MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});
```

Приведенная выше конструкция инстанцирует `MongooseConfigService` внутри `MongooseModule`, используя его для создания 
требуемого объекта опций. Обратите внимание, что в этом примере `MongooseConfigService` должен реализовать интерфейс 
`MongooseOptionsFactory`, как показано ниже. Модуль `MongooseModule` вызовет метод `createMongooseOptions()` 
на инстанцированном объекте предоставленного класса.

```typescript
@Injectable()
class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: 'mongodb://localhost/nest',
    };
  }
}
```

Если вы хотите повторно использовать существующий провайдер опций вместо того, чтобы создавать частную копию внутри 
`MongooseModule`, используйте синтаксис `useExisting`.


```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

## Пример

Рабочий пример доступен [здесь](https://github.com/nestjs/nest/tree/master/sample/06-mongoose).

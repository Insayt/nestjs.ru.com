# Базы данных

Nest не зависит от базы данных, что позволяет легко интегрироваться с любой базой данных SQL или NoSQL. У вас есть 
несколько доступных вариантов, в зависимости от ваших предпочтений. На самом общем уровне подключение Nest к базе 
данных - это просто вопрос загрузки соответствующего драйвера Node.js для базы данных, точно так же, как это делается 
с [Express](https://expressjs.com/en/guide/database-integration.html) или Fastify.


Вы также можете напрямую использовать любую **библиотеку** или ORM для интеграции баз данных Node.js общего назначения, 
например, [MikroORM](https://mikro-orm.io/) также посмотрите [рецепт здесь](/guide/recipes/mikroorm), [Sequelize](https://sequelize.org/) 
(перейдите в раздел [Sequelize integration](/guide/techniques/database#sequelize-integration)), [Knex. js](https://knexjs.org/) 
([tutorial](https://dev.to/nestjs/build-a-nestjs-module-for-knex-js-or-other-resource-based-libraries-in-5-minutes-12an)), 
[TypeORM](https://github.com/typeorm/typeorm) и [Prisma](https://www.github.com/prisma/prisma) ([recipe](/guide/recipes/prisma)), 
чтобы работать на более высоком уровне абстракции.

Для удобства Nest обеспечивает тесную интеграцию с TypeORM и Sequelize "из коробки" с помощью пакетов `@nestjs/typeorm` 
и `@nestjs/sequelize` соответственно, которые мы рассмотрим в текущей главе, и Mongoose с помощью `@nestjs/mongoose`, 
который рассматривается в [этой главе](/guide/techniques/mongodb). Эти интеграции предоставляют дополнительные возможности, 
специфичные для NestJS, такие как инъекция модели/репозитория, тестируемость и асинхронная конфигурация, чтобы сделать 
доступ к выбранной вами базе данных еще проще.


## Интеграция с TypeORM

Для интеграции с базами данных SQL и NoSQL Nest предоставляет пакет `@nestjs/typeorm`. Nest использует 
[TypeORM](https://github.com/typeorm/typeorm), потому что это наиболее зрелый объектно-реляционный маппер (ORM), 
доступный для TypeScript. Поскольку он написан на TypeScript, он хорошо интегрируется с фреймворком Nest.

Чтобы начать его использовать, сначала установите необходимые зависимости. В этой главе мы продемонстрируем использование 
популярной реляционной СУБД [MySQL](https://www.mysql.com/), но TypeORM обеспечивает поддержку многих реляционных баз данных, 
таких как PostgreSQL, Oracle, Microsoft SQL Server, SQLite и даже NoSQL баз данных, таких как MongoDB. Процедура, которую 
мы рассмотрим в этой главе, будет одинаковой для любой базы данных, поддерживаемой TypeORM. Вам просто нужно будет установить 
соответствующие клиентские библиотеки API для выбранной вами базы данных.

```bash
$ npm install --save @nestjs/typeorm typeorm mysql2
```

После завершения процесса установки мы можем импортировать `TypeOrmModule` в корневой `AppModule`.

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

> Установка `synchronize: true` не должна использоваться в продакшне - иначе вы можете потерять данные на проде.

Метод `forRoot()` поддерживает все свойства конфигурации, открываемые функцией `createConnection()` из пакета 
[TypeORM](https://typeorm.io/#/connection-options). Кроме того, существует несколько дополнительных свойств конфигурации, 
описанных ниже.

<table>
  <tr>
    <td><code>retryAttempts</code></td>
    <td>Количество попыток подключения к базе данных (по умолчанию: <code>10</code>)</td>
  </tr>
  <tr>
    <td><code>retryDelay</code></td>
    <td>Задержка между попытками повторного подключения (мс)(по умолчанию: <code>3000</code>)</td>
  </tr>
  <tr>
    <td><code>autoLoadEntities</code></td>
    <td>Если <code>true</code>, сущности будут загружаться автоматически (по умолчанию: <code>false</code>)</td>
  </tr>
  <tr>
    <td><code>keepConnectionAlive</code></td>
    <td>Если <code>true</code>, соединение не будет закрываться при завершении работы приложения (по умолчанию: <code>false</code>)</td>
  </tr>
</table>

> Подробнее о вариантах подключения [здесь](https://typeorm.io/#/connection-options).

В качестве альтернативы, вместо передачи объекта конфигурации в `forRoot()`, мы можем создать файл `ormconfig.json` 
в корневом каталоге проекта.

```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```

Затем мы можем вызвать `forRoot()` без каких-либо опций:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forRoot()],
})
export class AppModule {}
```

> Статические glob-пути (например, `dist/**/*.entity{{ '{' }} .ts,.js{{ '}' }}`) не будут правильно работать 
> с [webpack](https://webpack.js.org/).

> Обратите внимание, что файл `ormconfig.json` загружается библиотекой `typeorm`. Таким образом, все дополнительные 
> свойства, описанные выше (которые поддерживаются с помощью метода `forRoot()` - например, `autoLoadEntities` 
> и `retryDelay`) не будут работать. К счастью, TypeORM предоставляет функцию 
> [`getConnectionOptions`](https://typeorm.io/#/using-ormconfig/overriding-options-defined-in-ormconfig), которая 
> считывает параметры подключения из файла `ormconfig` или переменных окружения. С ее помощью вы все еще можете использовать 
> конфигурационный файл и установить специфические для Nest опции, как показано ниже:
>
> ```typescript
> TypeOrmModule.forRootAsync({
>   useFactory: async () =>
>     Object.assign(await getConnectionOptions(), {
>       autoLoadEntities: true,
>     }),
> });
> ```

Как только это будет сделано, объекты TypeORM `Connection` и `EntityManager` будут доступны для внедрения, например, 
во всем проекте (без необходимости импортировать какие-либо модули):

<div class="filename">app.module.ts</div>

```typescript
import { Connection } from 'typeorm';
@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
```


## Паттерн репозиторий

[TypeORM](https://github.com/typeorm/typeorm) поддерживает **шаблон проектирования репозиторий**, поэтому каждая сущность 
имеет свой собственный репозиторий. Эти хранилища могут быть получены из соединения с базой данных.

Чтобы продолжить пример, нам нужна хотя бы одна сущность. Давайте определим сущность `User`.

<div class="filename">user.entity.ts</div>

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column({ default: true })
  isActive: boolean;
}
```

> Узнайте больше о сущностях в [документации TypeORM](https://typeorm.io/#/entities).
> Файл сущности `User` находится в директории `users`. Этот каталог содержит все файлы, относящиеся к модулю `UsersModule`. 
> Вы можете решить, где хранить файлы модели, однако мы рекомендуем создавать их рядом с их **доменом**, в соответствующем каталоге модуля.

Чтобы начать использовать сущность `User`, нам нужно сообщить о ней TypeORM, вставив ее в массив `entities` в опциях метода 
модуля `forRoot()` (если вы не используете статический glob-путь):

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

Далее рассмотрим `UsersModule`:

<div class="filename">users.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

Этот модуль использует метод `forFeature()` для определения того, какие хранилища зарегистрированы в текущей области 
видимости. И теперь, мы можем внедрить `UsersRepository` в `UsersService` с помощью декоратора `@InjectRepository()`:

<div class="filename">users.service.ts</div>

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

> Не забудьте импортировать `UsersModule` в корневой `AppModule`.

Если вы хотите использовать репозиторий вне модуля, который импортирует `TypeOrmModule.forFeature`, вам нужно будет 
реэкспортировать сгенерированные им провайдеры.
Вы можете сделать это, экспортировав весь модуль, как показано ниже:

<div class="filename">users.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule]
})
export class UsersModule {}
```

Теперь, если мы импортируем `UsersModule` в `UserHttpModule`, мы можем использовать `@InjectRepository(User)` 
в провайдерах последнего модуля.

<div class="filename">users-http.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UserHttpModule {}
```

## Отношения

Отношения - это ассоциации, установленные между двумя или более таблицами. Отношения основаны на общих полях каждой 
таблицы, часто с использованием первичных и внешних ключей.

Существует три типа отношений:

<table>
  <tr>
    <td><code>One-to-one</code></td>
    <td>Каждая строка в первичной таблице имеет одну и только одну связанную строку во внешней таблице.  Для определения этого типа связи используйте декоратор <code>@OneToOne()</code>.</td>
  </tr>
  <tr>
    <td><code>One-to-many / Many-to-one</code></td>
    <td>Каждая строка в первичной таблице имеет одну или несколько связанных строк во внешней таблице. Для определения этого типа отношения используйте декораторы <code>@OneToMany()</code> и <code>@ManyToOne()</code>.</td>
  </tr>
  <tr>
    <td><code>Many-to-many</code></td>
    <td>Каждая строка в первичной таблице имеет много связанных строк во внешней таблице, а каждая запись во внешней таблице имеет много связанных строк в первичной таблице. Используйте декоратор <code>@ManyToMany()</code> для определения этого типа отношений.</td>
  </tr>
</table>

Чтобы определить отношения в сущностях, используйте соответствующие **декораторы**. Например, чтобы определить, что 
каждый `User` может иметь несколько фотографий, используйте декоратор `@OneToMany()`.

<div class="filename">user.entity.ts</div>

```typescript
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Photo } from '../photos/photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  firstName: string;
  
  @Column()
  lastName: string;
  
  @Column({ default: true })
  isActive: boolean;
  
  @OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];
}
```

> Чтобы узнать больше об отношениях в TypeORM, посетите [документацию TypeORM](https://typeorm.io/#/relations).

## Автоматическая загрузка сущностей

Ручное добавление сущностей в массив `entities` опций соединения с базой может быть утомительным. Кроме того, обращение к сущностям 
из корневого модуля нарушает границы домена приложения и приводит к утечке деталей реализации в другие части приложения. 
Для решения этой проблемы можно использовать статические glob-пути (например, `dist/**/*.entity{{ '{' }} .ts,.js{{ '}' }}`).

Обратите внимание, однако, что glob-пути не поддерживаются webpack, поэтому если вы собираете приложение в рамках монорепозитория, 
вы не сможете их использовать. Для решения этой проблемы предлагается альтернативное решение. Для автоматической загрузки 
сущностей установите свойство `autoLoadEntities` объекта конфигурации (передаваемого в метод `forRoot()`) в значение `true`, 
как показано ниже:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
```

При указании этой опции каждая сущность, зарегистрированная через метод `forFeature()`, будет автоматически добавлена 
в массив `entities` объекта конфигурации.

> Обратите внимание, что сущности, которые не зарегистрированы через метод `forFeature()`, 
> а только ссылаются на сущность (через отношения), не будут включены с помощью настройки `autoLoadEntities`.


## Разделение определения сущности

Вы можете определить сущность и ее столбцы прямо в модели, используя декораторы. Но некоторые люди предпочитают 
определять сущности и их колонки в отдельных файлах, используя ["схемы сущностей"](https://typeorm.io/#/separating-entity-definition).


```typescript
import { EntitySchema } from 'typeorm';
import { User } from './user.entity';
export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  relations: {
    photos: {
      type: 'one-to-many',
      target: 'Photo', // the name of the PhotoSchema
    },
  },
});
```

> Если вы указали опцию `target`, значение опции `name` должно совпадать с именем целевого класса.
> Если вы не указываете `target`, вы можете использовать любое имя.

Nest позволяет вам использовать экземпляр `EntitySchema` везде, где ожидается `Entity`, например:


```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

## Транзакции

Транзакция базы данных символизирует единицу работы, выполняемую в системе управления базами данных над базой данных 
и обрабатываемую последовательным и надежным образом независимо от других транзакций. Транзакция обычно представляет 
собой любое изменение в базе данных ([узнать больше](https://en.wikipedia.org/wiki/Database_transaction)).

Существует множество различных стратегий для обработки [транзакций TypeORM](https://typeorm.io/#/transactions). Мы рекомендуем 
использовать класс `QueryRunner`, поскольку он дает полный контроль над транзакцией.

Сначала нам нужно внедрить объект `Connection` в класс обычным способом:

```typescript
@Injectable()
export class UsersService {
  constructor(private connection: Connection) {}
}
```

> Класс `Connection` импортирован из пакета `typeorm`.

Теперь мы можем использовать этот объект для создания транзакции.

```typescript
async createMany(users: User[]) {
  const queryRunner = this.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(users[0]);
    await queryRunner.manager.save(users[1]);
    await queryRunner.commitTransaction();
  } catch (err) {
    // since we have errors lets rollback the changes we made
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}
```

> Обратите внимание, что `connection` используется только для создания `QueryRunner`. Однако, чтобы протестировать этот 
> класс, потребуется смокать весь объект `Connection` (который содержит несколько методов). Поэтому мы рекомендуем 
> использовать вспомогательный фабричный класс (например, `QueryRunnerFactory`) и определить интерфейс с ограниченным 
> набором методов, необходимых для поддержания транзакций. Такая техника позволяет довольно просто подделывать эти методы.

В качестве альтернативы можно использовать подход в стиле callback с методом `transaction` объекта `Connection` 
([подробнее](https://typeorm.io/#/transactions/creating-and-using-transactions)).

```typescript
async createMany(users: User[]) {
  await this.connection.transaction(async manager => {
    await manager.save(users[0]);
    await manager.save(users[1]);
  });
}
```

Использование декораторов для управления транзакцией (`@Transaction()` и `@TransactionManager()`) не рекомендуется.

<demo-component></demo-component>

## Подписчики

С помощью TypeORM [subscribers](https://typeorm.io/#/listeners-and-subscribers/what-is-a-subscriber) вы можете прослушивать 
события определенных сущностей.

```typescript
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './user.entity';
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }
  listenTo() {
    return User;
  }
  beforeInsert(event: InsertEvent<User>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }
}
```

> Подписчики событий не могут быть [request-scoped](/guide/fundamentals/injection-scopes).

Теперь добавьте класс `UserSubscriber` в массив `providers`:


```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSubscriber } from './user.subscriber';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserSubscriber],
  controllers: [UsersController],
})
export class UsersModule {}
```

> Подробнее о подписчиках сущностей [здесь](https://typeorm.io/#/listeners-and-subscribers/what-is-a-subscriber).

## Миграции

Миграции [Migrations](https://typeorm.io/#/migrations) предоставляют возможность постепенного обновления схемы базы данных 
для синхронизации ее с моделью данных приложения с сохранением существующих данных в базе данных. Для создания, запуска 
и возврата миграций TypeORM предоставляет специальный [CLI](https://typeorm.io/#/migrations/creating-a-new-migration).

Классы миграции отделены от исходного кода приложения Nest. Их жизненный цикл поддерживается TypeORM CLI. Поэтому вы не 
сможете использовать инъекцию зависимостей и другие специфические возможности Nest с помощью миграций. Чтобы узнать больше 
о миграциях, следуйте руководству в [документации TypeORM](https://typeorm.io/#/migrations/creating-a-new-migration).

## Несколько баз данных

Некоторые проекты требуют подключения к нескольким базам данных. Этого также можно добиться с помощью данного модуля. 
Чтобы работать с несколькими соединениями, сначала их надо создать. В этом случае именование соединений становится **обязательным**.

Предположим, у вас есть сущность `Album`, хранящаяся в собственной базе данных.

```typescript
const defaultOptions = {
  type: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
};
@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: 'user_db_host',
      entities: [User],
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: 'albumsConnection',
      host: 'album_db_host',
      entities: [Album],
    }),
  ],
})
export class AppModule {}
```

> Если вы не зададите `name` для соединения, его имя будет установлено в `default`. Обратите внимание, что у вас не должно 
> быть несколько соединений без имени или с одинаковым именем, иначе они будут переопределены.

На данный момент у вас есть сущности `User` и `Album`, зарегистрированные со своим собственным соединением. При такой 
настройке вам нужно указать методу `TypeOrmModule.forFeature()` и декоратору `@InjectRepository()`, какое соединение 
должно использоваться. Если вы не передадите никакого имени соединения, будет использоваться соединение `default`.

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Album], 'albumsConnection'),
  ],
})
export class AppModule {}
```

Вы также можете инжектировать `Connection` или `EntityManager` для данного соединения:

```typescript
@Injectable()
export class AlbumsService {
  constructor(
    @InjectConnection('albumsConnection')
    private connection: Connection,
    @InjectEntityManager('albumsConnection')
    private entityManager: EntityManager,
  ) {}
}
```

Также можно инжектировать любое `Connection` к провайдерам:

```typescript
@Module({
  providers: [
    {
      provide: AlbumsService,
      useFactory: (albumsConnection: Connection) => {
        return new AlbumsService(albumsConnection);
      },
      inject: [getConnectionToken('albumsConnection')],
    },
  ],
})
export class AlbumsModule {}
```

## Тестирование

Когда речь идет о модульном тестировании приложения, мы обычно хотим избежать подключения к базе данных, чтобы сохранить 
независимость наших тестовых наборов и максимально ускорить процесс их выполнения. Но наши классы могут зависеть от репозиториев, 
которые извлекаются из экземпляра соединения. Как нам с этим справиться? Решение заключается в создании макетов репозиториев. 
Для этого мы создали [custom providers](/guide/fundamentals/custom-providers). Каждый зарегистрированный репозиторий автоматически 
представляется токеном `<EntityName>Repository`, где `EntityName` - это имя класса вашей сущности.

Пакет `@nestjs/typeorm` предоставляет функцию `getRepositoryToken()`, которая возвращает подготовленный токен на основе 
заданной сущности.

```typescript
@Module({
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User),
      useValue: mockRepository,
    },
  ],
})
export class UsersModule {}
```

Теперь в качестве `UsersRepository` будет использоваться замещающий `mockRepository`. Всякий раз, когда какой-либо 
класс запрашивает `UsersRepository` с помощью декоратора `@InjectRepository()`, Nest будет использовать зарегистрированный 
объект `mockRepository`.

## Пользовательский репозиторий

TypeORM предоставляет возможность **пользовательских репозиториев**. Пользовательские репозитории позволяют расширить 
базовый класс репозитория и обогатить его несколькими специальными методами. Чтобы узнать больше об этой возможности, 
посетите [эту страницу](https://typeorm.io/#/custom-repository). Помните, что пользовательские хранилища находятся вне 
системы инъекции зависимостей NestJS, поэтому вы не можете инъектировать в них какие-либо значения.

Чтобы создать пользовательское хранилище, используйте декоратор `@EntityRepository()` и расширьте класс `Repository`.

```typescript
@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {}
```

> Оба класса `@EntityRepository()` и `Repository` импортируются из пакета `typeorm`.

После создания класса следующим шагом будет передача ответственности за инстанцирование в Nest. Для этого мы должны 
передать класс `AuthorRepository` методу `TypeOrm.forFeature()`.

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([AuthorRepository])],
  controller: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
```

После этого просто инжектируйте репозиторий с помощью следующей конструкции:

```typescript
@Injectable()
export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}
}
```

## Асинхронная конфигурация

Вам может понадобиться передавать параметры модуля репозитория асинхронно, а не статически. В этом случае используйте 
метод `forRootAsync()`, который предоставляет несколько способов работы с асинхронной конфигурацией.

Один из подходов заключается в использовании фабричной функции:

```typescript
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
});
```

Наша фабрика ведет себя как любой другой [asynchronous provider](/guide/fundamentals/async-providers) 
(например, она может быть `async` и способна инжектировать зависимости через `inject`).

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get<number>('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  inject: [ConfigService],
});
```

В качестве альтернативы можно использовать синтаксис `useClass`:

```typescript
TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
});
```

Приведенная выше конструкция инстанцирует `TypeOrmConfigService` внутри `TypeOrmModule` и использует его для предоставления 
объекта опций путем вызова `createTypeOrmOptions()`. Обратите внимание, что это означает, что `TypeOrmConfigService` должен 
реализовать интерфейс `TypeOrmOptionsFactory`, как показано ниже:

```typescript
@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
```

Чтобы предотвратить создание `TypeOrmConfigService` внутри `TypeOrmModule` и использовать провайдер, импортированный 
из другого модуля, вы можете использовать синтаксис `useExisting`.

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

Эта конструкция работает так же, как `useClass`, с одним критическим отличием - `TypeOrmModule` будет искать 
импортированные модули для повторного использования существующего `ConfigService` вместо инстанцирования нового.

> Убедитесь, что свойство `name` определено на том же уровне, что и свойство `useFactory`, 
> `useClass` или `useValue`. Это позволит Nest правильно зарегистрировать соединение под соответствующим названием инъекции.

## Пользовательская фабрика соединений

В сочетании с асинхронной конфигурацией с помощью `useFactory`, `useClass` или `useExisting`, вы можете опционально 
указать функцию `connectionFactory`, которая позволит вам предоставить собственное соединение TypeORM вместо того, 
чтобы позволить `TypeOrmModule` создать соединение.

`connectionFactory` получает TypeORM `ConnectionOptions`, настроенные во время асинхронной конфигурации с помощью `useFactory`, 
`useClass` или `useExisting`, и возвращает `Promise`, резолвящий (resolved) TypeORM `Connection`.

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  // Используйте useFactory, useClass, или useExisting
  // для настройки ConnectionOptions.
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get<number>('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  // connectionFactory получает настроенные параметры подключения (ConnectionOptions)
  // и возвращает Promise<Connection>.
  connectionFactory: async (options) => {
    const connection = await createConnection(options);
    return connection;
  },
});
```

> Функция `createConnection` импортируется из пакета `typeorm`.

## Пример

Рабочий пример доступен [здесь](https://github.com/nestjs/nest/tree/master/sample/05-sql-typeorm).

<demo-component></demo-component>

## Интеграция с Sequelize

Альтернативой использованию TypeORM является использование ORM [Sequelize](https://sequelize.org/) с пакетом `@nestjs/sequelize`. 
Кроме того, мы используем пакет [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript), который предоставляет 
набор дополнительных декораторов для декларативного определения сущностей.

Чтобы начать его использовать, сначала установите необходимые зависимости. В этой главе мы продемонстрируем использование 
популярной реляционной СУБД [MySQL](https://www.mysql.com/), но Sequelize обеспечивает поддержку многих реляционных баз данных, 
таких как PostgreSQL, MySQL, Microsoft SQL Server, SQLite и MariaDB. Процедура, которую мы рассмотрим в этой главе, будет 
одинаковой для любой базы данных, поддерживаемой Sequelize. Вам просто нужно будет установить соответствующие клиентские 
библиотеки API для выбранной вами базы данных.

```bash
$ npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
$ npm install --save-dev @types/sequelize
```

После завершения процесса установки мы можем импортировать `SequelizeModule` в корневой `AppModule`.

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [],
    }),
  ],
})
export class AppModule {}
```

Метод `forRoot()` поддерживает все свойства конфигурации, предоставляемые конструктором Sequelize 
([подробнее](https://sequelize.org/v5/manual/getting-started.html#setting-up-a-connection)). Кроме того, существует 
несколько дополнительных свойств конфигурации, описанных ниже.

<table>
  <tr>
    <td><code>retryAttempts</code></td>
    <td>Количество попыток подключения к базе данных (по умолчанию: <code>10</code>)</td>
  </tr>
  <tr>
    <td><code>retryDelay</code></td>
    <td>Задержка между повторными попытками подключения (мс) (по умолчанию: <code>3000</code>))</td>
  </tr>
  <tr>
    <td><code>autoLoadModels</code></td>
    <td>
        Если <code>true</code>, модели будут загружаться автоматически (по умолчанию: <code>false</code>)
    </td>
  </tr>
  <tr>
    <td><code>keepConnectionAlive</code></td>
    <td>Если <code>true</code>, соединение не будет закрываться при завершении работы приложения (по умолчанию: <code>false</code>)</td>
  </tr>
  <tr>
    <td><code>synchronize</code></td>
    <td>Если <code>true</code>, автоматически загруженные модели будут синхронизироваться (по умолчанию: <code>true</code>)</td>
  </tr>
</table>

Как только это будет сделано, объект `Sequelize` будет доступен для внедрения во всем проекте (без необходимости 
импортировать какие-либо модули), например:

<div class="filename">app.service.ts</div>

```typescript
import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}
}
```
## Модели

Sequelize реализует паттерн Active Record. В этом шаблоне вы используете классы моделей непосредственно для взаимодействия 
с базой данных. Чтобы продолжить пример, нам нужна хотя бы одна модель. Давайте определим модель `User`.

<div class="filename">user.model.ts</div>

```typescript
import { Column, Model, Table } from 'sequelize-typescript';
@Table
export class User extends Model {
  @Column
  firstName: string;
  @Column
  lastName: string;
  @Column({ defaultValue: true })
  isActive: boolean;
}
```

> Узнайте больше о доступных декораторах [здесь](https://github.com/RobinBuschmann/sequelize-typescript#column).

Файл модели `User` находится в директории `users`. Эта директория содержит все файлы, связанные с модулем `UsersModule`. 
Вы можете решить, где хранить файлы моделей, однако мы рекомендуем создавать их рядом с их **доменом**, в соответствующем 
каталоге модуля.

Чтобы начать использовать модель `User`, нам нужно сообщить о ней Sequelize, вставив ее в массив `models` в опциях метода 
модуля `forRoot()`:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [User],
    }),
  ],
})
export class AppModule {}
```

Далее рассмотрим `UsersModule`:

<div class="filename">users.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

Этот модуль использует метод `forFeature()` для определения того, какие модели зарегистрированы в текущей области 
видимости. Имея это, мы можем внедрить `UserModel` в `UsersService`, используя декоратор `@InjectModel()`:

<div class="filename">users.service.ts</div>

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }
  findOne(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
    });
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
```

> Не забудьте импортировать `UsersModule` в корневой `AppModule`.

Если вы хотите использовать репозиторий вне модуля, который импортирует `SequelizeModule.forFeature`, вам нужно будет 
реэкспортировать сгенерированные им провайдеры.

Вы можете сделать это, экспортировав весь модуль, как показано ниже:

<div class="filename">users.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [SequelizeModule]
})
export class UsersModule {}
```

Теперь, если мы импортируем `UsersModule` в `UserHttpModule`, мы можем использовать `@InjectModel(User)` в провайдерах 
последнего модуля.

<div class="filename">users-http.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UserHttpModule {}
```

## Отношения

Отношения - это ассоциации, установленные между двумя или более таблицами. Отношения основаны на общих полях каждой 
таблицы, часто с использованием первичных и внешних ключей.

Существует три типа отношений:


<table>
  <tr>
    <td><code>One-to-one</code></td>
    <td>Каждая строка в первичной таблице имеет одну и только одну связанную строку во внешней таблице.</td>
  </tr>
  <tr>
    <td><code>One-to-many / Many-to-one</code></td>
    <td>Каждая строка в первичной таблице имеет одну или несколько связанных строк во внешней таблице.</td>
  </tr>
  <tr>
    <td><code>Many-to-many</code></td>
    <td>Каждая строка в первичной таблице имеет много связанных строк во внешней таблице, а каждая запись во внешней таблице имеет много связанных строк в первичной таблице.</td>
  </tr>
</table>

Чтобы определить отношения в сущностях, используйте соответствующие **декораторы**. Например, чтобы определить, что
каждый `User` может иметь несколько фотографий, используйте декоратор `@HasMany()`.

<div class="filename">user.entity.ts</div>

```typescript
import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Photo } from '../photos/photo.model';

@Table
export class User extends Model {
  @Column
  firstName: string;
  
  @Column
  lastName: string;
  
  @Column({ defaultValue: true })
  isActive: boolean;
  
  @HasMany(() => Photo)
  photos: Photo[];
}
```

> Чтобы узнать больше об ассоциациях в Sequelize, прочитайте [эту](https://github.com/RobinBuschmann/sequelize-typescript#model-association) главу.

## Автоматическая загрузка моделей

Ручное добавление моделей в массив `models`, опций подключения, может быть утомительным. Кроме того, обращение к моделям 
из корневого модуля нарушает границы домена приложения и приводит к утечке деталей реализации в другие части приложения. 
Чтобы решить эту проблему, автоматически загружайте модели, установив свойства `autoLoadModels` и `synchronize` объекта 
конфигурации (передаваемого в метод `forRoot()`) в значение `true`, как показано ниже:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    SequelizeModule.forRoot({
      ...
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

При указании этой опции каждая модель, зарегистрированная через метод `forFeature()`, будет автоматически добавлена 
в массив `models` объекта конфигурации.

> Обратите внимание, что модели, которые не зарегистрированы через метод `forFeature()`, 
> а только ссылаются из модели (через ассоциацию), не будут включены.


## Транзакции

Транзакция базы данных символизирует единицу работы, выполняемую в системе управления базами данных над базой данных 
и обрабатываемую последовательным и надежным образом независимо от других транзакций. Транзакция обычно представляет 
собой любое изменение в базе данных ([узнать больше](https://en.wikipedia.org/wiki/Database_transaction)).

Существует множество различных стратегий обработки [Sequelize transactions](https://sequelize.org/v5/manual/transactions.html). 
Ниже приведен пример реализации управляемой транзакции (автоколлбэк).

Во-первых, нам нужно внедрить объект `Sequelize` в класс обычным способом:

```typescript
@Injectable()
export class UsersService {
  constructor(private sequelize: Sequelize) {}
}
```

> `Sequelize` импортирован из пакета `sequelize-typescript`.

Теперь мы можем использовать этот объект для создания транзакции.


```typescript
async createMany() {
  try {
    await this.sequelize.transaction(async t => {
      const transactionHost = { transaction: t };
      await this.userModel.create(
          { firstName: 'Abraham', lastName: 'Lincoln' },
          transactionHost,
      );
      await this.userModel.create(
          { firstName: 'John', lastName: 'Boothe' },
          transactionHost,
      );
    });
  } catch (err) {
    // Транзакция была отклонена
    // err - это то, что отклонила цепочка промисов, возвращенная в обратный вызов транзакции
  }
}
```

> Обратите внимание, что экземпляр `Sequelize` используется только для начала транзакции. Однако, чтобы протестировать 
> этот класс, потребуется смокать весь объект `Sequelize` (который раскрывает несколько методов). Поэтому мы рекомендуем 
> использовать вспомогательный фабричный класс (например, `TransactionRunner`) и определить интерфейс с ограниченным набором 
> методов, необходимых для поддержания транзакций. Такая техника позволяет довольно просто мокать эти методы.


## Миграции

Миграции [Migrations](https://sequelize.org/v5/manual/migrations.html) обеспечивают способ постепенного обновления схемы 
базы данных для синхронизации ее с моделью данных приложения, сохраняя при этом существующие данные в базе данных. Для 
создания, запуска и возврата миграций Sequelize предоставляет специальный [CLI](https://sequelize.org/v5/manual/migrations.html#the-cli).

Классы миграции отделены от исходного кода приложения Nest. Их жизненный цикл поддерживается Sequelize CLI. Поэтому 
вы не сможете использовать инъекцию зависимостей и другие специфические для Nest возможности с помощью миграций. Чтобы 
узнать больше о миграциях, следуйте руководству в [документации Sequelize](https://sequelize.org/v5/manual/migrations.html#the-cli).

<demo-component></demo-component>

## Несколько баз данных

Некоторые проекты требуют подключения к нескольким базам данных. Этого также можно добиться с помощью данного модуля. 
Чтобы работать с несколькими соединениями, сначала создайте соединения. В этом случае именование соединений становится **обязательным**.

Предположим, у вас есть сущность `Album`, хранящаяся в собственной базе данных.

```typescript
const defaultOptions = {
  dialect: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
};
@Module({
  imports: [
    SequelizeModule.forRoot({
      ...defaultOptions,
      host: 'user_db_host',
      models: [User],
    }),
    SequelizeModule.forRoot({
      ...defaultOptions,
      name: 'albumsConnection',
      host: 'album_db_host',
      models: [Album],
    }),
  ],
})
export class AppModule {}
```

> Если вы не зададите `name` для соединения, его имя будет установлено в `default`. Обратите внимание, что у вас не должно 
> быть несколько соединений без имени или с одинаковым именем, иначе они будут переопределены.

На данный момент у вас есть модели `User` и `Album`, зарегистрированные с собственным соединением. При такой настройке вам 
нужно указать методу `SequelizeModule.forFeature()` и декоратору `@InjectModel()`, какое соединение следует использовать. 
Если вы не передадите никакого имени соединения, будет использоваться соединение `default`.

```typescript
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Album], 'albumsConnection'),
  ],
})
export class AppModule {}
```

Вы также можете инжектировать экземпляр `Sequelize` для данного соединения:


```typescript
@Injectable()
export class AlbumsService {
  constructor(
    @InjectConnection('albumsConnection')
    private sequelize: Sequelize,
  ) {}
}
```

Также можно инжектировать любой экземпляр `Sequelize` в провайдеры:

```typescript
@Module({
  providers: [
    {
      provide: AlbumsService,
      useFactory: (albumsSequelize: Sequelize) => {
        return new AlbumsService(albumsSequelize);
      },
      inject: [getConnectionToken('albumsConnection')],
    },
  ],
})
export class AlbumsModule {}
```

## Тестирование

Когда речь идет о модульном тестировании приложения, мы обычно хотим избежать подключения к базе данных, чтобы сохранить 
независимость наших тестовых наборов и максимально ускорить процесс их выполнения. Но наши классы могут зависеть от моделей, 
которые извлекаются из экземпляра соединения. Как нам с этим справиться? Решение заключается в создании имитационных моделей. 
Для этого мы создаем [пользовательские провайдеры](/guide/fundamentals/custom-providers). Каждая зарегистрированная модель автоматически 
представляется токеном `<ModelName>Model`, где `ModelName` - это имя класса вашей модели.

Пакет `@nestjs/sequelize` раскрывает функцию `getModelToken()`, которая возвращает подготовленный токен на основе заданной модели.

```typescript
@Module({
  providers: [
    UsersService,
    {
      provide: getModelToken(User),
      useValue: mockModel,
    },
  ],
})
export class UsersModule {}
```

Теперь в качестве `UserModel` будет использоваться замещающая `mockModel`. Всякий раз, когда какой-либо класс будет 
запрашивать `UserModel` с помощью декоратора `@InjectModel()`, Nest будет использовать зарегистрированный объект `mockModel`.

## Асинхронная конфигурация

Вы можете захотеть передавать параметры `SequelizeModule` асинхронно, а не статически. В этом случае используйте 
метод `forRootAsync()`, который предоставляет несколько способов работы с асинхронной конфигурацией.

Один из подходов заключается в использовании фабричной функции:

```typescript
SequelizeModule.forRootAsync({
  useFactory: () => ({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    models: [],
  }),
});
```

Наша фабрика ведет себя как любой другой [asynchronous provider](/guidefundamentals/async-providers) 
(например, она может быть `async` и способна инжектировать зависимости через `inject`).

```typescript
SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    dialect: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    models: [],
  }),
  inject: [ConfigService],
});
```

В качестве альтернативы можно использовать синтаксис `useClass`:


```typescript
SequelizeModule.forRootAsync({
  useClass: SequelizeConfigService,
});
```

Приведенная выше конструкция инстанцирует `SequelizeConfigService` внутри `SequelizeModule` и использует его для 
предоставления объекта опций путем вызова `createSequelizeOptions()`. Обратите внимание, что это означает, что 
`SequelizeConfigService` должен реализовать интерфейс `SequelizeOptionsFactory`, как показано ниже:

```typescript
@Injectable()
class SequelizeConfigService implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [],
    };
  }
}
```

Чтобы предотвратить создание `SequelizeConfigService` внутри `SequelizeModule` и использовать провайдер, импортированный 
из другого модуля, вы можете использовать синтаксис `useExisting`.

```typescript
SequelizeModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

Эта конструкция работает так же, как `useClass`, с одним критическим отличием - `SequelizeModule` будет искать импортированные 
модули для повторного использования существующего `ConfigService` вместо инстанцирования нового.

## Пример

Рабочий пример доступен [здесь] (https://github.com/nestjs/nest/tree/master/sample/07-sequelize).




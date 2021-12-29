# Ссылка на модуль

Nest предоставляет класс `ModuleRef` для навигации по внутреннему списку провайдеров и получения ссылки на любой провайдер, 
используя его инъекционный токен в качестве ключа поиска. Класс `ModuleRef` также предоставляет способ динамического 
инстанцирования как статических, так и динамических провайдеров. `ModuleRef` может быть инжектирован в класс обычным способом:

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```

> Класс `ModuleRef` импортируется из пакета `@nestjs/core`.

## Получение экземпляров

Экземпляр `ModuleRef` (далее мы будем называть его **ссылка на модуль**) имеет метод `get()`. Этот метод извлекает 
провайдер, контроллер или инжектируемый модуль (например, guard, interceptor и т.д.), который существует (был инстанцирован) 
в **текущем** модуле, используя его инжектируемый токен/имя класса.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}
  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

> Вы не можете получить скопированных провайдеров (переходных или скопированных по запросу) с помощью метода `get()`. 
> Вместо этого используйте технику, описанную [ниже](/guide/fundamentals/module-ref#resolving-scoped-providers)
> Узнайте, как управлять скоупами [здесь](/guide/fundamentals/injection-scopes).

Чтобы получить провайдера из глобального контекста (например, если провайдер был внедрен в другой модуль), передайте 
параметр `{{ '{' }} strict: false {{ '}' }}` в качестве второго аргумента к `get()`.

```typescript
this.moduleRef.get(Service, { strict: false });
```

## Разрешение scoped провайдеров

Для динамического разрешения scoped провайдеров (переходного или примененного на запрос) используйте метод 
`resolve()`, передавая в качестве аргумента инъекционный токен провайдера.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}
  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

Метод `resolve()` возвращает уникальный экземпляр провайдера из его собственного поддерева **DI-контейнера**. 
Каждое поддерево имеет уникальный **идентификатор контекста**. Таким образом, если вы вызовете этот метод несколько раз 
и сравните ссылки на экземпляры, вы увидите, что они не равны.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}
  async onModuleInit() {
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService),
      this.moduleRef.resolve(TransientService),
    ]);
    console.log(transientServices[0] === transientServices[1]); // false
  }
}
```

Чтобы генерировать один экземпляр при нескольких вызовах `resolve()` и гарантировать, что они используют одно и то же 
сгенерированное поддерево контейнера DI, вы можете передать идентификатор контекста в метод `resolve()`. Для создания 
идентификатора контекста используйте класс `ContextIdFactory`. Этот класс предоставляет метод `create()`, который 
возвращает соответствующий уникальный идентификатор.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}
  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }
}
```

> Класс `ContextIdFactory` импортируется из пакета `@nestjs/core`.

## Регистрация провайдера `REQUEST`.

Идентификаторы контекста, созданные вручную (с помощью `ContextIdFactory.create()`), представляют поддеревья DI, в которых 
провайдер `REQUEST` является `undefined`, поскольку они не инстанцируются и не управляются системой инъекции зависимостей 
Nest.

Чтобы зарегистрировать пользовательский объект `REQUEST` для созданного вручную поддерева DI, используйте метод 
`ModuleRef#registerRequestByContextId()`, как показано ниже:

```typescript
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(/* YOUR_REQUEST_OBJECT */, contextId);
```

## Получение текущего поддерева

Иногда вам может понадобиться разрешить экземпляр провайдера, скопированного на запрос, в **контексте запроса**. 
Допустим, `CatsService` является request-scoped, и вы хотите разрешить экземпляр `CatsRepository`, который также 
помечен как request-scoped provider. Чтобы совместно использовать одно и то же поддерево DI-контейнера, вы должны 
получить текущий идентификатор контекста, а не генерировать новый (например, с помощью функции `ContextIdFactory.create()`, 
как показано выше). Чтобы получить текущий идентификатор контекста, начните с инъекции объекта запроса с помощью 
декоратора `@Inject()`.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService {
  constructor(
    @Inject(REQUEST) private request: Record<string, unknown>,
  ) {}
}
```

> Узнайте больше о поставщике запросов [здесь](/guide/fundamentals/injection-scopes).

Теперь используйте метод `getByRequest()` класса `ContextIdFactory` для создания идентификатора контекста на основе 
объекта запроса и передайте его в вызов `resolve()`:

```typescript
const contextId = ContextIdFactory.getByRequest(this.request);
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);
```

## Динамическое создание пользовательских классов

Для динамического создания класса, который **не был ранее зарегистрирован** в качестве **провайдера**, используйте 
метод `create()`.

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}
  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
```

Эта техника позволяет условно инстанцировать различные классы вне контейнера фреймворка.

<demo-component></demo-component>



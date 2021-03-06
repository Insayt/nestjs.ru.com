# Ленивая загрузка модулей (lazy-loading modules)

По умолчанию модули загружаются сразу, что означает, что как только приложение загружается, загружаются и все 
модули, независимо от того, нужны ли они в данный момент. Хотя это нормально для большинства приложений, это может 
стать узким местом для приложений, работающих в **бессерверной среде**, где задержка запуска ("холодный старт") 
имеет решающее значение.

Ленивая загрузка может помочь уменьшить время загрузки, загружая только модули, необходимые для конкретного вызова 
бессерверной функции. Кроме того, вы можете асинхронно загружать другие модули, как только бессерверная функция 
"разогрета", чтобы еще больше ускорит время загрузки для последующих вызовов (отложенная регистрация модулей).

> Если вы знакомы с фреймворком **Angular**, вы, возможно, уже встречали термин 
> "лениво загружаемые модули (lazy-loading modules)". Имейте в виду, что эта техника **функционально отличается** в Nest, поэтому думайте 
> об этом как о совершенно другой функции, которая имеет схожие соглашения об именовании.

## Начало работы

Для загрузки модулей по требованию Nest предоставляет класс `LazyModuleLoader`, который может быть инжектирован 
в класс обычным способом:

<div class="filename">cats.service.ts</div>

```typescript
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

> Класс `LazyModuleLoader` импортируется из пакета `@nestjs/core`.

В качестве альтернативы вы можете получить ссылку на провайдер `LazyModuleLoader` из файла начальной загрузки 
вашего приложения (`main.ts`) следующим образом:

```typescript
// "app" - инстанст приложение Nest
const lazyModuleLoader = app.get(LazyModuleLoader);
```

Теперь вы можете загрузить любой модуль, используя следующую конструкцию:

```typescript
const { LazyModule } = await import('./lazy.module');
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

> "Лениво загруженные" модули **кэшируются** при первом вызове метода `LazyModuleLoader#load`. Это 
> означает, что каждая последующая попытка загрузить `LazyModule` будет **очень быстрой** и будет возвращать кэшированный 
> экземпляр, вместо того, чтобы загружать модуль снова.
>
> ```bash
> Load "LazyModule" attempt: 1
> time: 2.379ms
> Load "LazyModule" attempt: 2
> time: 0.294ms
> Load "LazyModule" attempt: 3
> time: 0.303ms
> ```
> 
> Кроме того, "лениво загруженные" модули разделяют тот же граф модулей, что и те, которые загружаются при загрузке 
> приложения, а также любые другие ленивые модули, зарегистрированные позже в вашем приложении.

`lazy.module.ts` - это файл TypeScript, экспортирующий **обычный модуль Nest** (никаких дополнительных 
изменений не требуется).

Метод `LazyModuleLoader#load` возвращает [ссылку на модуль](/guide/fundamentals/module-ref) (из `LazyModule`), 
которая позволяет вам перемещаться по внутреннему списку провайдеров и получать ссылку на любой провайдер, 
используя его инъекционный токен в качестве ключа поиска.

Например, допустим, у нас есть `LazyModule` со следующим определением:

```typescript
@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
```

> Лениво загружаемые модули не могут быть зарегистрированы как **глобальные модули**, 
> так как это просто не имеет смысла (поскольку они регистрируются лениво, по требованию, когда все статически 
> зарегистрированные модули уже инстанцированы). Аналогично, зарегистрированные **глобальные сервисы** 
> (охранники/перехватчики/и т.д.) **не будут работать** должным образом.

С помощью этого мы можем получить ссылку на провайдера `LazyService` следующим образом:

```typescript
const { LazyModule } = await import('./lazy.module');
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
const { LazyService } = await import('./lazy.service');
const lazyService = moduleRef.get(LazyService);
```

> Если вы используете **Webpack**, обязательно обновите файл `tsconfig.json` - установите 
> `compilerOptions.module` в `"esnext"` и добавьте свойство `compilerOptions.moduleResolution` с `"node"` 
> в качестве значения:
>
> ```json
> {
>   "compilerOptions": {
>     "module": "esnext",
>     "moduleResolution": "node",
>     ...
>   }
> }
> ```
>
> Настроив эти параметры, вы сможете использовать функцию [code splitting](https://webpack.js.org/guides/code-splitting/).

## Ленивая загрузка контроллеров, шлюзов и резолверов

Поскольку контроллеры (или резолверы в GraphQL-приложениях) в Nest представляют собой наборы маршрутов/путей
(или запросов/мутаций), вы **не можете лениво загружать их** с помощью класса `LazyModuleLoader`.

> Контроллеры, [resolvers](/guide/graphql/resolvers) и [gateways](/guide/websockets/gateways), зарегистрированные внутри лениво 
> загруженных модулей, будут вести себя не так, как ожидается. Аналогично, вы не можете регистрировать функции 
> промежуточного ПО (реализуя интерфейс `MiddlewareConsumer`) по требованию.

Допустим, вы создаете REST API (HTTP-приложение) с драйвером Fastify под капотом (используя пакет `@nestjs/platform-fastify`). 
Fastify не позволяет вам регистрировать маршруты после того, как приложение готово/успешно прослушивает сообщения. 
Это означает, что даже если мы проанализируем связки маршрутов, зарегистрированные в контроллерах модуля, все лениво 
загруженные маршруты не будут доступны, поскольку нет возможности зарегистрировать их во время выполнения.

Аналогично, некоторые транспортные стратегии, предоставляемые нами в составе пакета `@nestjs/microservices` 
(включая Kafka, gRPC или RabbitMQ), требуют подписки/прослушивания определенных тем/каналов до установления соединения. 
Как только ваше приложение начнет прослушивать сообщения, фреймворк не сможет подписаться/прослушать новые темы.

Наконец, пакет `@nestjs/graphql` с включенным подходом "код прежде всего (schema on-the-fly)" автоматически генерирует схему GraphQL на лету 
на основе метаданных. Это означает, что все классы должны быть загружены заранее. В противном случае создать подходящую, 
корректную схему будет невозможно.

## Общие случаи использования

Чаще всего модули с ленивой загрузкой можно встретить в ситуациях, когда ваш worker/cron job/lambda и serverless function/webhook 
должны запускать разные сервисы (разную логику) в зависимости от входных аргументов (путь маршрута/данные/параметры запроса и т.д.). 
С другой стороны, модули с ленивой загрузкой могут не иметь большого смысла для монолитных приложений, где время запуска скорее 
не имеет значения.


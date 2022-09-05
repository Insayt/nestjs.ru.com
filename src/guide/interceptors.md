# Перехватчики (Interceptors)

Перехватчик - это класс, аннотированный декоратором `@Injectable()`. Перехватчики должны реализовывать интерфейс `NestInterceptor`.

<img src="/Interceptors_1.png" />

Перехватчики обладают набором полезных возможностей, которые вдохновлены техникой 
[Аспектно-ориентированного программирования](https://ru.wikipedia.org/wiki/%D0%90%D1%81%D0%BF%D0%B5%D0%BA%D1%82%D0%BD%D0%BE-%D0%BE%D1%80%D0%B8%D0%B5%D0%BD%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5) 
(АОП). Они позволяют:

- связывать дополнительную логику до/после выполнения метода
- преобразовать результат, возвращаемый из функции
- преобразовать исключение, вызванное функцией
- расширить базовое поведение функции
- полностью переопределять функцию в зависимости от конкретных условий (например, в целях кэширования)

## Основы

Каждый перехватчик реализует метод `intercept()`, который принимает два аргумента. Первый - это экземпляр 
`ExecutionContext` (точно такой же объект, как и для [guards](/guide/guards.html)). Экземпляр `ExecutionContext` наследуется 
от `ArgumentsHost`. Мы уже встречались с `ArgumentsHost` в главе о фильтрах исключений. Там мы видели, что это 
обертка вокруг аргументов, которые были переданы исходному обработчику, и содержит различные массивы аргументов 
в зависимости от типа приложения. Вы можете вернуться к главе [Фильтры исключений](/guide/exception-filters.html#аргументы-хоста) 
для получения дополнительной информации по этой теме.

## Контекст исполнения

Расширяя `ArgumentsHost`, `ExecutionContext` также добавляет несколько новых вспомогательных методов, которые предоставляют 
дополнительную информацию о текущем процессе выполнения. Эти подробности могут быть полезны при создании более общих 
перехватчиков, которые могут работать с широким набором контроллеров, методов и контекстов выполнения. 
Подробнее о `ExecutionContext` [здесь](/guide/fundamentals/execution-context.html).

## Обработчик вызовов

Вторым аргументом является `CallHandler`. Интерфейс `CallHandler` реализует метод `handle()`, который вы можете использовать 
для вызова метода обработчика маршрута в какой-то момент вашего перехватчика. Если вы не вызовете метод `handle()` 
в вашей реализации метода `intercept()`, метод обработчика маршрута не будет выполнен вообще.

Такой подход означает, что метод `intercept()` эффективно **заворачивает** поток запросов/ответов. В результате 
вы можете реализовать пользовательскую логику **до и после** выполнения конечного обработчика маршрута. Понятно, что вы можете 
написать код в методе `intercept()`, который выполняется **до** вызова `handle()`, но как повлиять на то, что происходит после? 
Поскольку метод `handle()` возвращает `Observable`, мы можем использовать мощные операторы [RxJS](https://github.com/ReactiveX/rxjs) 
для дальнейшего манипулирования ответом. Используя терминологию аспектно-ориентированного программирования, вызов обработчика 
маршрута (т.е. вызов `handle()`) называется [Pointcut](https://en.wikipedia.org/wiki/Pointcut), указывая на то, что это точка, 
в которую вставляется наша дополнительная логика.

Рассмотрим, например, входящий запрос `POST /cats`. Этот запрос предназначен для обработчика `create()`, определенного 
внутри `CatsController`. Если на этом пути будет вызван перехватчик, не вызывающий метод `handle()`, метод `create()` 
не будет выполнен. Как только `handle()` будет вызван (и его `Observable` будет возвращен), обработчик `create()` будет запущен. 
И как только поток ответа будет получен через `Observable`, над потоком могут быть выполнены дополнительные операции, 
а окончательный результат возвращен вызывающему методу.

<demo-component></demo-component>

## Детали перехватчиков

Первый случай использования, который мы рассмотрим, - это использование перехватчика для регистрации взаимодействия 
с пользователем (например, для хранения вызовов пользователя, асинхронной диспетчеризации событий или вычисления временной метки). 
Ниже показан простой `LoggingInterceptor`:

<div class="filename">logging.interceptor.ts</div>

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```
> `NestInterceptor<T, R>` - это общий интерфейс, в котором `T` указывает тип `Observable<T>` (поддерживающего поток ответа), 
> а `R` - тип значения, обернутого `Observable<R>`.

> Перехватчики, такие как контроллеры, провайдеры, guards и так далее, могут **инжектировать зависимости** через свой `конструктор`.

Поскольку `handle()` возвращает RxJS `Observable`, у нас есть широкий выбор операторов, которые мы можем использовать 
для манипулирования потоком. В примере выше мы использовали оператор `tap()`, который вызывает нашу анонимную функцию 
логирования при успешном завершении потока, но не вмешивается в цикл ответа.

## Привязка перехватчиков

Чтобы установить перехватчик, мы используем декоратор `@UseInterceptors()`, импортированный из пакета `@nestjs/common`. 
Как и [pipes](/guide/pipes.html) и [guards](/guide/guards.html), перехватчики могут быть применены на контроллер, метод или глобально.

<div class="filename">cats.controller.ts</div>

```typescript
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

> Декоратор `@UseInterceptors()` импортируется из пакета `@nestjs/common`.

Используя приведенную выше конструкцию, каждый обработчик маршрутов, определенный в `CatsController`, 
будет использовать `LoggingInterceptor`. Когда кто-то вызовет конечную точку `GET /cats`, вы увидите следующий 
вывод в консоле:

```
Before...
After... 1ms
```

Обратите внимание, что мы передали тип `LoggingInterceptor` (вместо экземпляра), оставив ответственность 
за инстанцирование фреймворку и обеспечив внедрение зависимостей. Как и в случае с pipes, guards 
и фильтрами исключений, мы также можем передавать экземпляр на месте:

<div class="filename">cats.controller.ts</div>

```typescript
@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

Как уже упоминалось, приведенная выше конструкция прикрепляет перехватчик к каждому обработчику, объявленному 
этим контроллером. Если мы хотим ограничить область действия перехватчика одним методом, мы просто применяем 
декоратор на уровне **метода**.

Чтобы установить глобальный перехватчик, мы используем метод `useGlobalInterceptors()` экземпляра приложения Nest:

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

Глобальные перехватчики используются во всем приложении, для каждого контроллера и каждого обработчика маршрутов. 
С точки зрения инъекции зависимостей, глобальные перехватчики, зарегистрированные вне модуля (с помощью `useGlobalInterceptors()`, 
как в примере выше), не могут инъектировать зависимости, поскольку это делается вне контекста любого модуля. Чтобы решить 
эту проблему, вы можете установить перехватчик **непосредственно из любого модуля**, используя следующую конструкцию:

<div class="filename">app.module.ts</div>

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

> При использовании этого подхода для выполнения инъекции зависимостей для перехватчика, 
> обратите внимание, что независимо от модуля, в котором используется эта конструкция, перехватчик, по сути, является глобальным. 
> Где это должно быть сделано? 
> Выберите модуль в котором определен перехватчик (`LoggingInterceptor` в примере выше). Кроме того, `useClass` - 
> не единственный способ работы с регистрацией пользовательских провайдеров. Узнайте больше [здесь](/guide/fundamentals/custom-providers.html).

## Маппинг ответа

Мы уже знаем, что `handle()` возвращает `Observable`. Этот поток содержит значение **возвращенное** из обработчика маршрута, 
и поэтому мы можем легко изменить его с помощью оператора RxJS `map()`.

> Функция response mapping не работает со специфической для библиотеки стратегией ответа (использование объекта `@Res()` напрямую запрещено).
> Давайте создадим `TransformInterceptor`, который будет тривиальным образом изменять каждый ответ для демонстрации процесса. 
> Он будет использовать оператор RxJS `map()` для присвоения объекта ответа свойству `data` вновь созданного объекта, 
> возвращая новый объект клиенту.

<div class="filename">transform.interceptor.ts</div>

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

> Перехватчики Nest работают как с синхронными, так и с асинхронными методами `intercept()`. При необходимости 
> вы можете просто переключить метод на `async`.

При описанной выше конструкции, когда кто-то вызывает конечную точку `GET /cats`, ответ будет выглядеть следующим образом 
(при условии, что обработчик маршрута возвращает пустой массив `[]`):

```json
{
  "data": []
}
```

Перехватчики имеют большое значение для создания повторно используемых решений для требований, которые встречаются 
во всем приложении. Например, представьте, что нам нужно преобразовать каждое вхождение значения `null` в пустую 
строку `''`. Мы можем сделать это с помощью одной строки кода и привязать перехватчик глобально, чтобы он автоматически 
использовался каждым зарегистрированным обработчиком.

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}
```

## Маппинг исключений

Еще один интересный случай использования - воспользоваться преимуществами оператора `catchError()` в RxJS для переопределения 
брошенных исключений:

<div class="filename">errors.interceptor.ts</div>

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException())),
      );
  }
}
```

## Переопределение потоков

Существует несколько причин, по которым мы иногда можем захотеть полностью отказаться от вызова обработчика и вернуть 
вместо него другое значение. Очевидный пример - реализация кэша для улучшения времени отклика. Давайте рассмотрим 
простой **перехватчик кэша**, который возвращает свой ответ из кэша. В реалистичном примере мы бы хотели рассмотреть 
другие факторы, такие как TTL, аннулирование кэша, размер кэша и т.д., но это выходит за рамки данного обсуждения. 
Здесь мы приведем базовый пример, демонстрирующий основную концепцию.

<div class="filename">cache.interceptor.ts</div>

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```
Наш `CacheInterceptor` имеет жестко заданную переменную `isCached` и жестко заданный ответ `[]`. Ключевым моментом 
является то, что мы возвращаем новый поток, созданный оператором RxJS `of()`, поэтому обработчик маршрута 
**не будет вызван** вообще. Когда кто-то вызывает конечную точку, использующую `CacheInterceptor`, ответ 
(жестко закодированный, пустой массив) будет возвращен немедленно. Чтобы создать универсальное решение, вы можете 
воспользоваться `Reflector` и создать собственный декоратор. Декоратор `Reflector` хорошо описан в главе [guards](/guide/guards.html).

## Больше операторов

Возможность манипулирования потоком с помощью операторов RxJS дает нам множество возможностей. Давайте рассмотрим еще 
один распространенный случай использования. Представьте, что вы хотите обрабатывать **таймауты** в маршрутных запросах. 
Когда ваша конечная точка ничего не возвращает по истечении определенного времени, вы хотите завершить запрос ответом 
об ошибке. Следующая конструкция позволяет это сделать:

<div class="filename">timeout.interceptor.ts</div>

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  };
};
```

По истечении 5 секунд обработка запроса будет отменена. Вы также можете добавить пользовательскую логику перед 
выбросом `RequestTimeoutException` (например, освобождение ресурсов).



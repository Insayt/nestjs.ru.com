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


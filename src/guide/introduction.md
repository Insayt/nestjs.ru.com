# Введение

Nest (NestJS) - это фреймворк для построения эффективных, масштабируемых 
[Node.js](https://nodejs.org/) приложений на сервере. 
Он использует современный JavaScript, построен на основе и полностью 
поддерживает [TypeScript](http://www.typescriptlang.org/) 
(но при этом позволяет разработчикам писать на чистом JavaScript) и сочетает 
в себе элементы ООП (объектно-ориентированного программирования), 
ФП (функционального программирования) и ФРП (функционально-реактивного программирования).

Под капотом Nest использует надежные фреймворки HTTP-серверов, 
такие как [Express](https://expressjs.com/) (по умолчанию) и, по желанию, 
может быть настроен на использование [Fastify](https://github.com/fastify/fastify)!

Nest обеспечивает уровень абстракции над этими распространенными фреймворками 
Node.js (Express/Fastify), но также предоставляет их API непосредственно разработчику. 
Это дает свободу в использовании огромного количества сторонних модулей, 
которые доступны для базовой платформы.

> Не все понятия в документации переведены на русский язык, т.к. общепринятыми для них являются именно английские 
> обозначения (например Middleware, Pipes, Guards и т.д. Писать вместо этого "мидлвары", "пайпы", "гуарды" - как-то некрасиво 🙂)

<demo-component></demo-component>

## Философия

В последние годы, благодаря Node.js, JavaScript стал очень популярен в Интернете 
как для фронтенда, так и для бекенда. Это привело к появлению таких замечательных 
проектов, как [Angular](https://angular.io/), [React](https://github.com/facebook/react) 
и [Vue](https://github.com/vuejs/vue), которые повышают производительность разработчиков 
и позволяют создавать быстрые, тестируемые и расширяемые фронтенд-приложения. Однако, 
хотя для Node (и серверного JavaScript) существует множество превосходных библиотек, 
и инструментов, но они не решают главную проблему - **Архитектуру**.

Nest предоставляет готовую архитектуру приложений, которая позволяет разработчикам 
и командам создавать высокотестируемые, масштабируемые, слабосвязанные и легко поддерживаемые 
приложения. Архитектура в значительной степени вдохновлена фреймворком Angular.

## Установка

Чтобы начать работу, вы можете либо создать проект с помощью [Nest CLI](/cli/overview), 
либо клонировать стартовый проект (оба варианта дадут одинаковый результат).

Чтобы создать проект с помощью Nest CLI, выполните следующие команды. 
Это создаст новую папку и базовую структуру для вашего проекта.
Создание нового проекта с помощью **Nest CLI** рекомендуется для начинающих пользователей. 
Мы будем использовать именно этот подход далее, в разделе [Первые шаги](first-steps).

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

## Альтернативы

В качестве альтернативы, установка начального TypeScript проекта с помощью **Git**:

```bash
$ git clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

> Если вы хотите клонировать репозиторий без истории, вы можете использовать [degit](https://github.com/Rich-Harris/degit).

Откройте ваш браузер и перейдите на [http://localhost:3000/](http://localhost:3000/).

Для установки начального JavaScript проекта, используйте `javascript-starter.git` в последовательности команд выше.

Вы также можете вручную создать новый проект с нуля, устанвив ядро и вспомогательные файлы с помощью **npm** (или **yarn**).
В этом случае, конечно же, вы будете нести ответственность за создание шаблонных файлов проекта самостоятельно.

```bash
$ npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```

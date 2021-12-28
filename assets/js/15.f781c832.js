(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{409:function(t,s,a){"use strict";a.r(s);var n=a(54),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"middleware"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#middleware"}},[t._v("#")]),t._v(" Middleware")]),t._v(" "),a("p",[t._v("Middleware - это функция, которая вызывается "),a("strong",[t._v("перед")]),t._v(" обработчиком маршрута. Middleware-функции имеют доступ\nк объектам "),a("a",{attrs:{href:"https://expressjs.com/en/4x/api.html#req",target:"_blank",rel:"noopener noreferrer"}},[t._v("request"),a("OutboundLink")],1),t._v(" и "),a("a",{attrs:{href:"https://expressjs.com/en/4x/api.html#res",target:"_blank",rel:"noopener noreferrer"}},[t._v("response"),a("OutboundLink")],1),t._v(",\nа также к промежуточной функции "),a("code",[t._v("next()")]),t._v(" в цикле запрос-ответ приложения. Функция промежуточного ПО "),a("strong",[t._v("next")]),t._v(" обычно\nобозначается переменной с именем "),a("code",[t._v("next")]),t._v(".")]),t._v(" "),a("img",{attrs:{src:"/Middlewares_1.png"}}),t._v(" "),a("p",[t._v("Nest middleware по умолчанию эквивалентны "),a("a",{attrs:{href:"https://expressjs.com/en/guide/using-middleware.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("express"),a("OutboundLink")],1),t._v(" middleware.\nСледующее описание из официальной документации express описывает возможности промежуточного ПО:")]),t._v(" "),a("p",[t._v("Функции Middleware могут выполнять следующие задачи:\n"),a("ul",[a("li",[t._v("выполнять любой код.")]),t._v(" "),a("li",[t._v("вносить изменения в объекты запроса и ответа.")]),t._v(" "),a("li",[t._v("завершить цикл запрос-ответ.")]),t._v(" "),a("li",[t._v("вызов следующей промежуточной (next) функции в стеке.")]),t._v(" "),a("li",[t._v("если текущая middleware функция не завершает цикл запрос-ответ, она должна вызвать "),a("code",[t._v("next()")]),t._v(", чтобы\nпередать управление следующей middleware функции. В противном случае запрос будет оставлен в подвешенном состоянии.")])])]),t._v(" "),a("p",[t._v("Вы реализуете пользовательские middleware Nest либо в функции, либо в классе с декоратором "),a("code",[t._v("@Injectable()")]),t._v(".\nКласс должен реализовывать интерфейс "),a("code",[t._v("NestMiddleware")]),t._v(", в то время как к функции не предъявляется никаких особых требований.\nДавайте начнем с реализации простой middleware функции с помощью метода класса.")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("logger.middleware.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Injectable"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NestMiddleware "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Response"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NextFunction "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Injectable")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("LoggerMiddleware")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NestMiddleware")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Response"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" NextFunction"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("console")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Request...'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"внедрение-зависимостеи-dependency-injection"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#внедрение-зависимостеи-dependency-injection"}},[t._v("#")]),t._v(" Внедрение зависимостей (Dependency injection)")]),t._v(" "),a("p",[t._v("Nest middleware полностью поддерживает Dependency Injection. Как в случае с провайдерами и контроллерами,\nони могут "),a("strong",[t._v("инжектировать зависимости")]),t._v(", доступные в пределах одного модуля. Как обычно, это делается через "),a("code",[t._v("constructor")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"применение-middleware"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#применение-middleware"}},[t._v("#")]),t._v(" Применение middleware")]),t._v(" "),a("p",[t._v("В декораторе "),a("code",[t._v("@Module()")]),t._v(" нет места для middleware. Вместо этого мы устанавливаем\nих с помощью метода "),a("code",[t._v("configure()")]),t._v(" класса модуля. Модули, включающие middleware, должны реализовывать интерфейс\n"),a("code",[t._v("NestModule")]),t._v(". Давайте настроим "),a("code",[t._v("LoggerMiddleware")]),t._v(" на уровне "),a("code",[t._v("AppModule")]),t._v(".")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("app.module.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NestModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" MiddlewareConsumer "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" LoggerMiddleware "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./common/middleware/logger.middleware'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" CatsModule "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./cats/cats.module'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Module")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  imports"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("CatsModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AppModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NestModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("configure")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("consumer"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" MiddlewareConsumer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("LoggerMiddleware"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("В приведенном выше примере мы установили "),a("code",[t._v("LoggerMiddleware")]),t._v(" для обработчиков маршрутов "),a("code",[t._v("/cats")]),t._v(", которые были ранее\nопределены внутри "),a("code",[t._v("CatsController")]),t._v(". Мы также можем дополнительно ограничить middleware определенным методом\nзапроса, передав объект, содержащий маршрут "),a("code",[t._v("path")]),t._v(" и запрос "),a("code",[t._v("method")]),t._v(", в метод "),a("code",[t._v("forRoutes()")]),t._v(" при настройке\nmiddleware. В примере ниже обратите внимание, что мы импортируем перечисление (enum) "),a("code",[t._v("RequestMethod")]),t._v(" для ссылки\nна нужный тип метода запроса.")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("app.module.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NestModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" RequestMethod"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" MiddlewareConsumer "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" LoggerMiddleware "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./common/middleware/logger.middleware'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" CatsModule "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./cats/cats.module'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Module")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  imports"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("CatsModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AppModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NestModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("configure")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("consumer"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" MiddlewareConsumer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("LoggerMiddleware"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMethod"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("GET")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Метод "),a("code",[t._v("configure()")]),t._v(" можно сделать асинхронным с помощью "),a("code",[t._v("async/await")]),t._v(" (например, можно "),a("code",[t._v("дождаться")]),t._v(" завершения\nасинхронной операции внутри тела метода "),a("code",[t._v("configure()")]),t._v(").")])]),t._v(" "),a("h2",{attrs:{id:"шаблоны-маршрутов"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#шаблоны-маршрутов"}},[t._v("#")]),t._v(" Шаблоны маршрутов")]),t._v(" "),a("p",[t._v("Также поддерживаются маршруты, основанные на шаблонах. Например, звездочка используется как "),a("strong",[t._v("шаблон")]),t._v(",\nи будет соответствовать любой комбинации символов:")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ab*cd'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMethod"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("ALL")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("p",[t._v("Маршрут "),a("code",[t._v("'ab*cd'")]),t._v(" будет соответствовать "),a("code",[t._v("abcd")]),t._v(", "),a("code",[t._v("ab_cd")]),t._v(", "),a("code",[t._v("abecd")]),t._v(" и так далее. Символы "),a("code",[t._v("?")]),t._v(", "),a("code",[t._v("+")]),t._v(", "),a("code",[t._v("*")]),t._v(" и "),a("code",[t._v("()")]),t._v(" могут\nиспользоваться в маршрутном пути и являются подмножествами своих аналогов регулярных выражений. Дефис ( "),a("code",[t._v("-")]),t._v(") и точка ("),a("code",[t._v(".")]),t._v(")\nинтерпретируются буквально в строковых путях.")]),t._v(" "),a("blockquote",[a("p",[t._v("Пакет "),a("code",[t._v("fastify")]),t._v(" использует последнюю версию пакета "),a("code",[t._v("path-to-regexp")]),t._v(", который больше не поддерживает подстановочные\nзвездочки "),a("code",[t._v("*")]),t._v(". Вместо них необходимо использовать параметры (например, "),a("code",[t._v("(.*)")]),t._v(", "),a("code",[t._v(":splat*")]),t._v(").")])]),t._v(" "),a("h2",{attrs:{id:"middleware-consumer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#middleware-consumer"}},[t._v("#")]),t._v(" Middleware Consumer")]),t._v(" "),a("p",[t._v("Класс "),a("code",[t._v("MiddlewareConsumer")]),t._v(" является вспомогательным классом. Он предоставляет несколько встроенных методов для управления\nmiddleware. Все они могут быть просто "),a("strong",[t._v("сцеплены (chained)")]),t._v(" в "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Fluent_interface",target:"_blank",rel:"noopener noreferrer"}},[t._v("fluent style"),a("OutboundLink")],1),t._v(".\nМетод "),a("code",[t._v("forRoutes()")]),t._v(" может принимать одну строку, несколько строк, объект "),a("code",[t._v("RouteInfo")]),t._v(", класс контроллера и даже несколько\nклассов контроллеров. В большинстве случаев вы, вероятно, просто передадите список "),a("strong",[t._v("контроллеров")]),t._v(", разделенных запятыми.\nНиже приведен пример с одним контроллером:")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("app.module.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Module"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NestModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" MiddlewareConsumer "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" LoggerMiddleware "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./common/middleware/logger.middleware'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" CatsModule "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./cats/cats.module'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" CatsController "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'./cats/cats.controller.ts'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Module")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  imports"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("CatsModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("AppModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("implements")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("NestModule")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("configure")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("consumer"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" MiddlewareConsumer"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("LoggerMiddleware"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n      "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CatsController"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Метод "),a("code",[t._v("apply()")]),t._v(" может принимать либо один middleware, либо несколько аргументов для\nуказания "),a("a",{attrs:{href:"/middleware#multiple-middleware"}},[t._v("множественных middleware")]),t._v(".")])]),t._v(" "),a("h2",{attrs:{id:"исключение-маршрутов"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#исключение-маршрутов"}},[t._v("#")]),t._v(" Исключение маршрутов")]),t._v(" "),a("p",[t._v("Иногда мы хотим "),a("strong",[t._v("исключить")]),t._v(" определенные маршруты из применения middleware. Мы можем легко исключить определенные\nмаршруты с помощью метода "),a("code",[t._v("exclude()")]),t._v(". Этот метод может принимать одну строку, несколько строк или объект "),a("code",[t._v("RouteInfo")]),t._v(",\nопределяющий маршруты, которые необходимо исключить, как показано ниже:")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("LoggerMiddleware"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("exclude")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMethod"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("GET")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" method"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" RequestMethod"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("POST")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats/(.*)'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CatsController"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Метод "),a("code",[t._v("exclude()")]),t._v(" поддерживает шаблоны с помощью пакета\n"),a("a",{attrs:{href:"https://github.com/pillarjs/path-to-regexp#parameters",target:"_blank",rel:"noopener noreferrer"}},[t._v("path-to-regexp"),a("OutboundLink")],1),t._v(".")])]),t._v(" "),a("p",[t._v("В приведенном примере "),a("code",[t._v("LoggerMiddleware")]),t._v(" будет привязан ко всем маршрутам, определенным внутри "),a("code",[t._v("CatsController")]),t._v(" "),a("strong",[t._v("за исключением")]),t._v(" трех, переданных в метод "),a("code",[t._v("exclude()")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"функциональные-middleware"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#функциональные-middleware"}},[t._v("#")]),t._v(" Функциональные middleware")]),t._v(" "),a("p",[t._v("Класс "),a("code",[t._v("LoggerMiddleware")]),t._v(", который мы использовали, довольно прост. У него нет не дополнительных методов,\nни зависимостей. Почему мы не можем определить его в простой функции, а не в классе? На самом деле, мы можем.\nТакой тип middleware называется "),a("strong",[t._v("функциональным middleware")]),t._v(". Давайте преобразуем "),a("code",[t._v("LoggerMiddleware")]),t._v(" из основанного\nна классах в функциональный middleware, чтобы проиллюстрировать разницу:")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("logger.middleware.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Response"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" NextFunction "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("logger")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("req"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" res"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Response"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" NextFunction"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token builtin"}},[t._v("console")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("log")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token template-string"}},[a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("Request...")]),a("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("p",[t._v("И используем его внутри "),a("code",[t._v("AppModule")]),t._v(":")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("app.module.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("logger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CatsController"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Рассмотрите возможность использования более простой альтернативы "),a("strong",[t._v("функциональных middleware")]),t._v(" в тех случаях,\nкогда ваш middleware не нуждается в зависимостях.")])]),t._v(" "),a("h2",{attrs:{id:"множественные-middleware"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#множественные-middleware"}},[t._v("#")]),t._v(" Множественные middleware")]),t._v(" "),a("p",[t._v("Как упоминалось выше, чтобы связать несколько middleware, которые выполняются последовательно, просто\nпредоставьте список через запятую внутри метода "),a("code",[t._v("apply()")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("consumer")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("apply")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("cors")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("helmet")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" logger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("forRoutes")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("CatsController"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("h2",{attrs:{id:"глобальные-middleware"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#глобальные-middleware"}},[t._v("#")]),t._v(" Глобальные middleware")]),t._v(" "),a("p",[t._v("Если мы хотим привязать middleware сразу к каждому зарегистрированному маршруту, мы можем использовать\nметод "),a("code",[t._v("use()")]),t._v(", который предоставляется экземпляром "),a("code",[t._v("INestApplication")]),t._v(":")]),t._v(" "),a("div",{staticClass:"filename"},[t._v("main.ts")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" app "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" NestFactory"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("create")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("AppModule"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\napp"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("use")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("logger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("await")]),t._v(" app"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("listen")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3000")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Доступ к DI-контейнеру в глобальных middleware невозможен. Вместо этого вы можете использовать\n"),a("RouterLink",{attrs:{to:"/guide/middleware.html#функциональные-middleware"}},[t._v("функциональный middleware")]),t._v(" при использовании "),a("code",[t._v("app.use()")]),t._v(". В качестве альтернативы,\nвы можете сделать middleware класс и использовать его с помощью "),a("code",[t._v(".forRoutes('*')")]),t._v(" внутри "),a("code",[t._v("AppModule")]),t._v("\n(или любого другого модуля).")],1)])])}),[],!1,null,null,null);s.default=e.exports}}]);
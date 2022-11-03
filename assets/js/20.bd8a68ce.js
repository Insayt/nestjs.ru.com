(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{411:function(t,s,a){"use strict";a.r(s);var n=a(54),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"области-применения-инъекции"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#области-применения-инъекции"}},[t._v("#")]),t._v(" Области применения инъекций")]),t._v(" "),a("p",[t._v("Для людей, изучающих разные языки программирования, может быть неожиданным узнать, что в Nest почти все разделяется\nмежду входящими запросами. У нас есть пул соединений с базой данных, синглтонные сервисы с глобальным состоянием и т.д.\nПомните, что Node.js не следует многопоточной Stateless-модели запроса/ответа, в которой каждый запрос обрабатывается\nотдельным потоком. Следовательно, использование экземпляров синглтонов полностью "),a("strong",[t._v("безопасно")]),t._v(" для наших приложений.")]),t._v(" "),a("p",[t._v("Однако есть особые случаи, когда время жизни на основе запроса может быть желаемым поведением, например, кэширование\nпо запросам в GraphQL-приложениях, отслеживание запросов и многопоточность. Области инъекций предоставляют механизм для\nполучения желаемого поведения времени жизни провайдера.")]),t._v(" "),a("h2",{attrs:{id:"область-деиствия-проваидера"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#область-деиствия-проваидера"}},[t._v("#")]),t._v(" Область действия провайдера")]),t._v(" "),a("p",[t._v("Провайдер может иметь любую из следующих сфер действия:")]),t._v(" "),a("table",[a("tr",[a("td",[a("code",[t._v("DEFAULT")])]),t._v(" "),a("td",[t._v("\n        Один экземпляр провайдера используется совместно со всем приложением. Время жизни экземпляра напрямую связано \n        с жизненным циклом приложения. После загрузки приложения все синглтонные провайдеры инстанцируются. По умолчанию \n        используется синглтонная область видимости.\n    ")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("REQUEST")])]),t._v(" "),a("td",[t._v("\n        Новый экземпляр провайдера создается исключительно для каждого входящего "),a("strong",[t._v("запроса")]),t._v(". \n        После завершения обработки запроса экземпляр удаляется.\n    ")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("TRANSIENT")])]),t._v(" "),a("td",[t._v("\n        Переходные провайдеры не разделяются между потребителями. Каждый потребитель, инжектирующий переходного \n        провайдера, получает новый, выделенный экземпляр.\n    ")])])]),t._v(" "),a("blockquote",[a("p",[t._v("Использование области видимости singleton "),a("strong",[t._v("рекомендуется")]),t._v(" для большинства случаев использования. Совместное\nиспользование провайдеров потребителями и запросами означает, что экземпляр может быть кэширован, а его инициализация\nпроисходит только один раз, во время запуска приложения.")])]),t._v(" "),a("h2",{attrs:{id:"использование"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#использование"}},[t._v("#")]),t._v(" Использование")]),t._v(" "),a("p",[t._v("Укажите область применения инъекции, передав свойство "),a("code",[t._v("scope")]),t._v(" объекту опций декоратора "),a("code",[t._v("@Injectable()")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Injectable"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Scope "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Injectable")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" scope"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CatsService")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("Аналогично, для "),a("RouterLink",{attrs:{to:"/guide/fundamentals/custom-providers.html"}},[t._v("пользовательских провайдеров")]),t._v(", установите свойство "),a("code",[t._v("scope")]),t._v(" в развернутой\nформе регистрации провайдера:")],1),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  provide"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'CACHE_MANAGER'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  useClass"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" CacheManager"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  scope"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("TRANSIENT")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("blockquote",[a("p",[t._v("Импортируйте перечисление "),a("code",[t._v("Scope")]),t._v(" из "),a("code",[t._v("@nestjs/common")]),t._v(".")])]),t._v(" "),a("blockquote",[a("p",[t._v("Шлюзы не должны использовать провайдеров, скопированных на запрос, поскольку они должны действовать как синглтоны.\nКаждый шлюз инкапсулирует реальный сокет и не может быть инстанцирован несколько раз.")])]),t._v(" "),a("p",[t._v("По умолчанию используется синглтонная область видимости, и ее не нужно объявлять. Если вы все же хотите объявить\nпровайдера как singleton scoped, используйте значение "),a("code",[t._v("Scope.DEFAULT")]),t._v(" для свойства "),a("code",[t._v("scope")]),t._v(".")]),t._v(" "),a("h2",{attrs:{id:"область-применения-контроллера"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#область-применения-контроллера"}},[t._v("#")]),t._v(" Область применения контроллера")]),t._v(" "),a("p",[t._v("Контроллеры также могут иметь область видимости, которая распространяется на все обработчики методов запроса,\nобъявленные в этом контроллере. Как и область видимости провайдера, область видимости контроллера определяет время\nего жизни. Для контроллера, скопированного на запрос, новый экземпляр создается для каждого входящего запроса, и уничтожается,\nкогда запрос завершает обработку.")]),t._v(" "),a("p",[t._v("Объявите область видимости контроллера с помощью свойства "),a("code",[t._v("scope")]),t._v(" объекта "),a("code",[t._v("ControllerOptions")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Controller")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  path"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'cats'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  scope"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CatsController")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h2",{attrs:{id:"иерархия-scope"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#иерархия-scope"}},[t._v("#")]),t._v(" Иерархия Scope")]),t._v(" "),a("p",[t._v("Сфера действия расширяется по цепочке инъекций. Контроллер, который зависит от провайдера, скопированного на запрос,\nсам будет скопирован на запрос.")]),t._v(" "),a("p",[t._v("Представьте себе следующий граф зависимостей: "),a("code",[t._v("CatsController <- CatsService <- CatsRepository")]),t._v(". Если "),a("code",[t._v("CatsService")]),t._v("\nявляется request-scoped (а остальные являются синглтонами по умолчанию), то "),a("code",[t._v("CatsController")]),t._v(" станет request-scoped,\nпоскольку он зависит от инжектированного сервиса. Хранилище "),a("code",[t._v("CatsRepository")]),t._v(", которое не является зависимым, останется\nsingleton-scoped.")]),t._v(" "),a("demo-component"),t._v(" "),a("h2",{attrs:{id:"проваидер-запросов"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#проваидер-запросов"}},[t._v("#")]),t._v(" Провайдер запросов")]),t._v(" "),a("p",[t._v("В приложении на основе HTTP-сервера (например, с использованием "),a("code",[t._v("@nestjs/platform-express")]),t._v(" или "),a("code",[t._v("@nestjs/platform-fastify")]),t._v(")\nпри использовании провайдеров с копированием запросов вы можете захотеть получить доступ к ссылке на исходный объект запроса.\nВы можете сделать это, инжектируя объект "),a("code",[t._v("REQUEST")]),t._v(".")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Injectable"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Inject "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/core'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Request "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'express'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Injectable")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" scope"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CatsService")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("constructor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Inject")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" request"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Request"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("Из-за различий в базовой платформе/протоколе, вы получаете доступ к входящему запросу немного по-разному для приложений\nMicroservice или GraphQL. В приложениях "),a("a",{attrs:{href:"/guide/graphql/quick-start"}},[t._v("GraphQL")]),t._v(" вы вводите "),a("code",[t._v("CONTEXT")]),t._v(" вместо "),a("code",[t._v("REQUEST")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-typescript extra-class"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" Injectable"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" Inject "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/common'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("CONTEXT")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'@nestjs/graphql'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Injectable")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" scope"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Scope"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("REQUEST")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("class")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("CatsService")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("constructor")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token decorator"}},[a("span",{pre:!0,attrs:{class:"token at operator"}},[t._v("@")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Inject")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token constant"}},[t._v("CONTEXT")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("private")]),t._v(" context"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("Затем вы настраиваете значение "),a("code",[t._v("context")]),t._v(" (в "),a("code",[t._v("GraphQLModule")]),t._v("), чтобы оно содержало "),a("code",[t._v("request")]),t._v(" в качестве свойства.")]),t._v(" "),a("h2",{attrs:{id:"производительность"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#производительность"}},[t._v("#")]),t._v(" Производительность")]),t._v(" "),a("p",[t._v("Использование провайдеров с привязкой к запросу влияет на производительность приложения. Хотя Nest пытается кэшировать\nкак можно больше метаданных, ему все равно придется создавать экземпляр вашего класса при каждом запросе. Следовательно,\nэто замедлит среднее время отклика и общий результат бенчмаркинга. Если провайдер не должен быть скопирован на запрос,\nнастоятельно рекомендуется использовать стандартную область видимости singleton.")])],1)}),[],!1,null,null,null);s.default=e.exports}}]);
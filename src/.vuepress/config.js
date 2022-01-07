module.exports = {
  base: "/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "NestJS",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: "Nest js русская документация | Nest js документация на русском",

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    [
      "script",
      {},
      `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(87021734, "init", {
        clickmap:false,
        trackLinks:false,
        accurateTrackBounce:true
   });`,
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  theme: "default-prefers-color-scheme",
  themeConfig: {
    logo: "/logo.svg",
    overrideTheme: "dark",
    repo: "",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    nav: [
      // {
      //   text: "Раздел 1",
      //   link: "/guide/",
      // },
      // {
      //   text: "Раздел 2",
      //   link: "/config/",
      // },
      {
        text: "Купить переводчику пивка 🍺",
        link: "https://donatty.com/insayt",
      },
      {
        text: "Github",
        link: "https://github.com/Insayt/nestjs.ru.com",
      },
    ],
    sidebarDepth: 0,
    sidebar: [
      ["/guide/introduction", "Введение"],
      {
        title: "Обзор",
        collapsable: false,
        children: [
          ["/guide/first-steps", "Первые шаги"],
          ["/guide/controllers", "Контроллеры"],
          ["/guide/providers", "Провайдеры"],
          ["/guide/modules", "Модули"],
          ["/guide/middleware", "Middleware"],
          ["/guide/exception-filters", "Фильтры исключений"],
          ["/guide/pipes", "Pipes"],
          ["/guide/guards", "Guards"],
          ["/guide/interceptors", "Interceptors"],
          ["/guide/custom-decorators", "Пользовательские декораторы"],
        ],
      },
      {
        title: "Основы",
        collapsable: false,
        children: [
          [
            "/guide/fundamentals/custom-providers",
            "Пользовательские провайдеры",
          ],
          ["/guide/fundamentals/async-providers", "Асинхронные провайдеры"],
          ["/guide/fundamentals/dynamic-modules", "Динамические модули"],
          [
            "/guide/fundamentals/injection-scopes",
            "Области применения инъекций",
          ],
          ["/guide/fundamentals/circular-dependency", "Круговая зависимость"],
          ["/guide/fundamentals/module-ref", "Ссылка на модуль"],
          [
            "/guide/fundamentals/lazy-loading-modules",
            "Ленивая загрузка модулей",
          ],
          ["/guide/fundamentals/execution-context", "Контекст выполнения"],
          ["/guide/fundamentals/lifecycle-events", "События жизненного цикла"],
          [
            "/guide/fundamentals/platform-agnosticism",
            "Независимость от платформы",
          ],
          ["/guide/fundamentals/unit-testing", "Тестирование"],
        ],
      },
      {
        title: "Техники",
        collapsable: false,
        children: [
          ["/guide/techniques/database", "Базы данных"],
          ["/guide/techniques/mongodb", "Монго"],
        ],
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    "@vuepress/plugin-back-to-top",
    "@vuepress/plugin-medium-zoom",
    [
      "@mr-hope/sitemap",
      {
        changefreq: "always",
        hostname: "https://nestjs.ru.com",
      },
    ],
    // [
    //   "metrika",
    //   {
    //     counter: "87021734",
    //   },
    // ],
  ],
};

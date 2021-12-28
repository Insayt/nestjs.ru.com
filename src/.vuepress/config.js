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
        text: "Github",
        link: "https://github.com/Insayt/nestjs.ru.com",
      },
    ],
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
    [
      "metrika",
      {
        counter: "87021734",
      },
    ],
  ],
};

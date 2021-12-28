module.exports = {
  // base: "/nestjs.ru.com/",
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
      {
        text: "Раздел 1",
        link: "/guide/",
      },
      {
        text: "Раздел 2",
        link: "/config/",
      },
      {
        text: "VuePress",
        link: "https://v1.vuepress.vuejs.org",
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
        ],
      },
    ],
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],
};

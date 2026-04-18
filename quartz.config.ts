import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: false,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "https://johnmatrix.org",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      stylesheets: [],
      cdnCaching: true,
      typography: {
        header: "JetBrains Mono",
        body: "IBM Plex Sans",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#0d0d0d",
          lightgray: "#1a1a1a",
          gray: "#666666",
          darkgray: "#e8e6e3",
          dark: "#ffffff",
          secondary: "#cda54b",
          tertiary: "#f4d03f",
          highlight: "rgba(205, 165, 75, 0.08)",
          textHighlight: "#cda54b44",
        },
        darkMode: {
          light: "#0d0d0d",
          lightgray: "#1a1a1a",
          gray: "#666666",
          darkgray: "#e8e6e3",
          dark: "#ffffff",
          secondary: "#cda54b",
          tertiary: "#f4d03f",
          highlight: "rgba(205, 165, 75, 0.08)",
          textHighlight: "#cda54b44",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "dracula",
          dark: "dracula",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.DynamicStats(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config

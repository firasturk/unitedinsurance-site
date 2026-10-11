import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DEFAULT_LANG, isUnprefixedPath, langFromPathname, stripLangPrefix, withLangPrefix, type Lang } from "./lib/locale";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Language prefix handling: "/en/about" is routed as "/about" with lang = "en".
  // The router instance is created per request on the server and once in the browser,
  // so this closure holds the language of the current document.
  const state: { lang: Lang } = { lang: DEFAULT_LANG };

  const router = createRouter({
    routeTree,
    // `lang` here is only the type-level default; the root route's beforeLoad sets the real value per request.
    context: { queryClient, lang: DEFAULT_LANG },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => {
        const lang = langFromPathname(url.pathname);
        state.lang = lang;
        if (lang === "en") {
          url.pathname = stripLangPrefix(url.pathname);
          return url;
        }
        return undefined;
      },
      output: ({ url }) => {
        if (state.lang === "en" && !isUnprefixedPath(url.pathname) && langFromPathname(url.pathname) !== "en") {
          url.pathname = withLangPrefix(url.pathname, "en");
          return url;
        }
        return undefined;
      },
    },
  });

  return router;
};

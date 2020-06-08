import queryString, { ParsedQuery } from "query-string";

/**
 * Returns the given path as an absolute URL. The base path is defined in {@link SITE_INFO}.
 *
 * @param baseUrl The base URL to use, e.g. "https://covid19.evrim.io"
 * @param path The path name, e.g. "/about".
 */
export function getAbsoluteUrl(baseUrl: string, path: string): string {
  baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  path = path.startsWith("/") ? path.substring(1, path.length) : path;

  return `${baseUrl}/${path}`;
}

/**
 * Returns a canonical URL based on a given URL.
 *
 * @example
 * // Returns "https://covid19.evrim.io/test?a=1"
 * getCanonicalUrl("www.example.com/test?a=1&b=2", "https://covid19.evrim.io", ["a"]);
 *
 * @param url The URL to convert to a canonical URL, e.g. "www.example.com/test?a=1&b=2".
 * @param baseUrl The base URL to use. If this is different than the base URL of the `url`
 *   argument, then this replaces it.
 * @param paramsToKeep The query parameters to keep in the canonical URL. For example, you might
 *   want to remove "ref=some_website" from the canonical URL.
 */
export function getCanonicalUrl(url: string, baseUrl: string, paramsToKeep?: string[]): string {
  const parsedUrl = queryString.parseUrl(url);
  let { query } = parsedUrl;
  const urlWithoutQuery = parsedUrl.url;

  const decomposedUrl = urlWithoutQuery.match(/^(?:\w*):*\/{0,2}(?:.+)\/(\w+)$/) ?? ["", ""];

  const path = decomposedUrl[1];

  if (paramsToKeep != null) {
    query = paramsToKeep.reduce<ParsedQuery>((filteredQuery, param) => {
      if (param in query) {
        filteredQuery[param] = query[param];
      }

      return filteredQuery;
    }, {});
  }

  const urlQueryString = queryString.stringify(query);

  if (urlQueryString === "") {
    return getAbsoluteUrl(baseUrl, path);
  }

  return getAbsoluteUrl(baseUrl, `${path}?${urlQueryString}`);
}

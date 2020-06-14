/* eslint-disable */
const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");

const sitemap = new SitemapStream({ hostname: "https://covid19.evrim.io" });

const writeStream = createWriteStream("./public/sitemap.xml");
sitemap.pipe(writeStream);

sitemap.write({ url: "/", changefreq: "daily" });
sitemap.write({ url: "/about" });
sitemap.end();

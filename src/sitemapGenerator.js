/* eslint-disable */
const { createWriteStream } = require("fs");
const { SitemapStream } = require("sitemap");

const sitemap = new SitemapStream({ hostname: "https://covid19incharts.com" });

const writeStream = createWriteStream("./public/sitemap.xml");
sitemap.pipe(writeStream);

sitemap.write({ url: "/", changefreq: "daily" });
sitemap.write({ url: "/about", changefreq: "weekly" });
sitemap.end();

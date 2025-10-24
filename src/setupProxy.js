const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/metadata-api",
    createProxyMiddleware({
      target: "http://localhost:59890", // Core Command/Data service
      changeOrigin: true,
      pathRewrite: { "^/metadata-api": "" },
      // logLevel: 'debug',
    })
  );

  app.use(
    "/core-api",
    createProxyMiddleware({
      target: "http://localhost:59881",
      changeOrigin: true,
      pathRewrite: { "^/core-api": "" },
    })
  );

  app.use(
    "/core-data",
    createProxyMiddleware({
      target: "http://localhost:59880",
      changeOrigin: true,
      pathRewrite: { "^/core-data": "" },
    })
  );

  app.use(
    "/core-command",
    createProxyMiddleware({
      target: "http://localhost:59882",
      changeOrigin: true,
      pathRewrite: { "^/core-command": "" },
    })
  );

  app.use(
    "/support-notifications",
    createProxyMiddleware({
      target: "http://localhost:59860",
      changeOrigin: true,
      pathRewrite: { "^/support-notifications": "" },
    })
  );

  app.use(
    "/support-scheduler",
    createProxyMiddleware({
      target: "http://localhost:59863",
      changeOrigin: true,
      pathRewrite: { "^/support-scheduler": "" },
    })
  );

  app.use(
    "/sys-mgmt-agent",
    createProxyMiddleware({
      target: "http://localhost:59890",
      changeOrigin: true,
      pathRewrite: { "^/sys-mgmt-agent": "" },
    })
  );
  app.use(
    "/app-rules-engine",
    createProxyMiddleware({
      target: "http://localhost:59701",
      changeOrigin: true,
      pathRewrite: { "^/app-rules-engine": "" },
    })
  );

  app.use(
    "/device-rest",
    createProxyMiddleware({
      target: "http://localhost:59986",
      changeOrigin: true,
      pathRewrite: { "^/device-rest": "" },
    })
  );

  app.use(
    "/device-virtual",
    createProxyMiddleware({
      target: "http://localhost:59900",
      changeOrigin: true,
      pathRewrite: { "^/device-virtual": "" },
    })
  );

  app.use(
    "/device-opcua",
    createProxyMiddleware({
      target: "http://localhost:59997",
      changeOrigin: true,
      pathRewrite: { "^/device-opcua": "" },
    })
  );
};
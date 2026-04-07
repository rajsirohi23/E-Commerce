const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Commerce API is running',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const registerRoute = (routePath, mountPath) => {
  try {
    const routeModule = require(routePath);
    const router = routeModule.router || routeModule;

    if (typeof router === 'function' || (router && typeof router.use === 'function')) {
      app.use(mountPath, router);
    }
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      console.warn('Skipping ' + mountPath + ': ' + error.message);
    }
  }
};

registerRoute('./routes/authRoutes', '/api/auth');
registerRoute('./routes/productRoutes', '/api/products');
registerRoute('./routes/cartRoutes', '/api/cart');
registerRoute('./routes/orderRoutes', '/api/orders');

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found: ' + req.originalUrl,
  });
});

module.exports = app;

const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

let connectDB = null;

try {
  connectDB = require('./config/db');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    console.warn('Database bootstrap warning: ' + error.message);
  }
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (typeof connectDB === 'function') {
      await connectDB();
    }

    app.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

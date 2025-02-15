const express = require('express');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

// Middleware для парсинга JSON
app.use(express.json());

// Swagger конфигурация
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'API for managing books and authors in a library system',
    },
  },
  apis: ['./routes/*.js'], // Путь к файлам с маршрутами
};

// Инициализация Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Использование маршрутов
app.use('/api', bookRoutes);

// Соединение с MongoDB
mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Запуск сервера
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

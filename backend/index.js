const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static admin panel files
app.use('/admin', express.static(path.join(__dirname, 'public')));


const port = process.env.PORT || 8080;

// PostgreSQL Connection
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// MongoDB Connection
const mongoClient = new MongoClient(process.env.MONGO_URL);

let dbMongo;

async function initDatabases() {
  try {
    const mongoConn = await mongoClient.connect();
    dbMongo = mongoConn.db('chiken_db');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
  }

  try {
    await pgPool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL');

    // Initialize Schema
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Data if empty
    const res = await pgPool.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      await pgPool.query(`
        INSERT INTO products (name, description, price, image_url) VALUES
        ('Classic Bucket', '12 pieces of our signature original recipe chicken, perfectly golden brown.', 24.99, '/images/bucket.png'),
        ('Spicy Tenders', '6 pieces of fiery, hand-breaded chicken tenders with cooling ranch.', 12.99, '/images/tenders.png'),
        ('Family Feast', '16 pieces, 4 large sides, and 6 buttermilk biscuits. Enough for everyone.', 39.99, '/images/feast.png');
      `);
      console.log('🌱 Database seeded with initial products');
    }
  } catch (err) {
    console.error('❌ PostgreSQL Initialization Error:', err);
  }
}

initDatabases();

app.get('/api/health', async (req, res) => {
  let mongoOk = false;
  let pgOk = false;

  try {
    await dbMongo.command({ ping: 1 });
    mongoOk = true;
  } catch (e) {}

  try {
    await pgPool.query('SELECT 1');
    pgOk = true;
  } catch (e) {}

  res.json({
    status: 'ok',
    service: 'Chikenpedia Backend',
    databases: {
      mongodb: mongoOk ? 'connected' : 'disconnected',
      postgresql: pgOk ? 'connected' : 'disconnected'
    }
  });
});

// Product APIs
app.get('/api/products', async (req, res) => {
  try {
    const result = await pgPool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Order APIs
app.post('/api/orders', async (req, res) => {
  try {
    const order = {
      ...req.body,
      createdAt: new Date(),
      status: 'pending'
    };
    const result = await dbMongo.collection('orders').insertOne(order);
    res.status(201).json({ success: true, orderId: result.insertedId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Admin Dashboard APIs
app.get('/api/admin/metrics', async (req, res) => {
  try {
    const orderCount = await dbMongo.collection('orders').countDocuments();
    
    res.json({
      totalUsers: 1420,
      activeOrders: orderCount,
      revenueToday: 1399.50,
      topProduct: 'Family Feast Bucket'
    });
  } catch (err) {
    res.json({
      totalUsers: 1420,
      activeOrders: 42,
      revenueToday: 1399.50,
      topProduct: 'Family Feast Bucket'
    });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await dbMongo.collection('orders').find().sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock database
let users = [
  { id: 1, email: 'user@example.com', password: 'password123' }
];
let rides = [];
let foodOrders = [];
let freightQuotes = [];

// Auth Endpoints
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    firstName,
    lastName
  };
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

// Ride Endpoints
app.post('/api/rides', (req, res) => {
  const { pickup, destination, vehicleType, userId } = req.body;
  const newRide = {
    id: rides.length + 1,
    pickup,
    destination,
    vehicleType,
    userId,
    status: 'requested',
    createdAt: new Date()
  };
  rides.push(newRide);
  res.json({ success: true, ride: newRide });
});

// Eats Endpoints
app.post('/api/orders', (req, res) => {
  const { restaurantId, items, deliveryAddress, userId } = req.body;
  const newOrder = {
    id: foodOrders.length + 1,
    restaurantId,
    items,
    deliveryAddress,
    userId,
    status: 'preparing',
    createdAt: new Date()
  };
  foodOrders.push(newOrder);
  res.json({ success: true, order: newOrder });
});

// Freight Endpoints
app.post('/api/freight-quotes', (req, res) => {
  const { origin, destination, cargoDetails, userId } = req.body;
  const quote = {
    id: freightQuotes.length + 1,
    origin,
    destination,
    cargoDetails,
    userId,
    price: calculateFreightPrice(origin, destination, cargoDetails),
    createdAt: new Date()
  };
  freightQuotes.push(quote);
  res.json({ success: true, quote });
});

function calculateFreightPrice(origin, destination, cargoDetails) {
  // Simplified pricing calculation
  const basePrice = 500;
  const distanceMultiplier = 1.5;
  const weightMultiplier = cargoDetails.weight > 1000 ? 1.2 : 1;
  return basePrice * distanceMultiplier * weightMultiplier;
}

// Contact Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  // In a real app, this would send an email
  res.json({ success: true, message: 'Your message has been received' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
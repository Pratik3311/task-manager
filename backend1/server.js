const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Middleware
app.use(cors())
app.use(express.json())

// Database setup
const dbPath = path.join(__dirname, "auth.db")
const db = new sqlite3.Database(dbPath)

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
})

// Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Check if user already exists
    db.get("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }

      if (row) {
        return res.status(400).json({ message: "User already exists" })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insert user
      db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Error creating user" })
          }

          res.status(201).json({
            message: "User created successfully",
            userId: this.lastID,
          })
        },
      )
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Find user
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Database error" })
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" })
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          email: user.email,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      })
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid token" })
  }
}

// Protected route example
app.get("/api/auth/me", verifyToken, (req, res) => {
  res.json({ user: req.user })
})

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`)
})

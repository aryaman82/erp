#!/bin/bash

# Setup script for Almed ERP integration
echo "Setting up Almed ERP with database integration..."

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if database exists
DB_NAME="inventory_db"
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database '$DB_NAME' already exists"
else
    echo "Creating database '$DB_NAME'..."
    createdb -U postgres $DB_NAME
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database. Please check your PostgreSQL setup."
        exit 1
    fi
fi

# Run database initialization
echo "Setting up database tables..."
psql -U postgres -d $DB_NAME -f init-db.sql
if [ $? -eq 0 ]; then
    echo "✅ Database tables created successfully"
else
    echo "❌ Failed to create database tables"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
DB_USER=postgres
DB_HOST=localhost
DB_NAME=inventory_db
DB_PASSWORD=
DB_PORT=5432
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
EOL
    echo "⚠️  Please edit .env file and add your PostgreSQL password"
else
    echo "✅ .env file already exists"
fi

# Install server dependencies
echo "Installing server dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Server dependencies installed"
else
    echo "❌ Failed to install server dependencies"
    exit 1
fi

# Setup frontend environment
echo "Setting up frontend environment..."
cd inventory-management
if [ ! -f .env.local ]; then
    cat > .env.local << EOL
API_BASE_URL=http://localhost:3000
EOL
    echo "✅ Frontend environment file created"
else
    echo "✅ Frontend environment file already exists"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and set your PostgreSQL password if needed"
echo "2. Start the backend server: node server.js"
echo "3. In another terminal, start the frontend: cd inventory-management && npm run dev"
echo "4. Visit http://localhost:3001 to access the ERP system"
echo ""
echo "The backend will run on http://localhost:3000"
echo "The frontend will run on http://localhost:3001"

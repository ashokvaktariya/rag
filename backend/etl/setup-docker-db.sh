#!/bin/bash
# Docker PostgreSQL Setup Script for Consultant System
# This script sets up PostgreSQL with pgvector using Docker

set -e  # Exit on any error

echo "🐳 Docker PostgreSQL Setup for Consultant System"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.docker.template .env
    echo "✅ .env file created. Please edit it with your actual values."
    echo "   - Add your OpenAI API key"
    echo "   - Add your Zoho credentials (if using ETL)"
    echo "   - Adjust database credentials if needed"
    echo ""
    read -p "Press Enter to continue after updating .env file..."
fi

# Load environment variables
source .env

echo "🔧 Starting PostgreSQL with pgvector..."
echo "   Database: $POSTGRES_DB"
echo "   User: $POSTGRES_USER"
echo "   Port: $POSTGRES_PORT"

# Start the services
docker-compose up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U $POSTGRES_USER -d $POSTGRES_DB > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    fi
    
    echo "   Attempt $attempt/$max_attempts - PostgreSQL not ready yet..."
    sleep 2
    attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
    echo "❌ PostgreSQL failed to start within expected time"
    echo "   Check logs with: docker-compose logs postgres"
    exit 1
fi

# Test the connection
echo "🔍 Testing database connection..."
if docker-compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Check if pgvector extension is enabled
echo "🧠 Checking pgvector extension..."
if docker-compose exec -T postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT * FROM pg_extension WHERE extname = 'vector';" | grep -q vector; then
    echo "✅ pgvector extension is enabled!"
else
    echo "❌ pgvector extension is not enabled"
    echo "   Check logs with: docker-compose logs postgres"
    exit 1
fi

echo ""
echo "🎉 PostgreSQL setup completed successfully!"
echo ""
echo "📊 Service Information:"
echo "   PostgreSQL: localhost:$POSTGRES_PORT"
echo "   Database: $POSTGRES_DB"
echo "   Username: $POSTGRES_USER"
echo "   Password: $POSTGRES_PASSWORD"
echo ""
echo "🌐 Optional Services:"
echo "   pgAdmin: http://localhost:8080"
echo "   Email: $PGADMIN_DEFAULT_EMAIL"
echo "   Password: $PGADMIN_DEFAULT_PASSWORD"
echo ""
echo "🔧 Useful Commands:"
echo "   Stop services: docker-compose down"
echo "   View logs: docker-compose logs"
echo "   Connect to DB: docker-compose exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB"
echo "   Backup DB: docker-compose exec postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql"
echo ""
echo "📝 Next Steps:"
echo "   1. Run: python check_schema.py (to create tables)"
echo "   2. Run: python migrate_json_to_db.py (to migrate data)"
echo "   3. Start your FastAPI application"
echo ""
echo "✅ Setup complete! Your PostgreSQL database is ready for the Consultant System."

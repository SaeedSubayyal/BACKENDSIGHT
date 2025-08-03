# Running AI Optimization Engine Without Docker

This guide will help you set up and run the AI Optimization Engine locally without using Docker.

## Prerequisites

### System Requirements
- **Python 3.9+**
- **PostgreSQL 13+**
- **Redis 6+**
- **Node.js 16+** (optional, for frontend)

### Operating System Support
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+
- ✅ CentOS 8+

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Run the setup script:**
   ```bash
   python setup_local.py
   ```

2. **Follow the prompts and complete the setup**

### Option 2: Manual Setup

## Step-by-Step Manual Setup

### 1. Install System Dependencies

#### Windows
```powershell
# Install PostgreSQL
# Download from: https://www.postgresql.org/download/windows/
# Add PostgreSQL bin directory to PATH

# Install Redis
# Download from: https://github.com/microsoftarchive/redis/releases
# Or use WSL2 for better Redis support

# Install Python 3.9+
# Download from: https://www.python.org/downloads/
```

#### macOS
```bash
# Using Homebrew
brew install postgresql redis python@3.9

# Start services
brew services start postgresql
brew services start redis
```

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install Python 3.9+
sudo apt install python3.9 python3.9-pip python3.9-venv

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Start services
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 2. Set Up Database

#### Create Database and User
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database and user
CREATE DATABASE aioptimization;
CREATE USER aioptimization WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE aioptimization TO aioptimization;
\q
```

#### Alternative: Using createdb
```bash
# Create database
createdb aioptimization

# Or with specific user
createdb -U postgres aioptimization
```

### 3. Configure Environment

#### Create .env file
```bash
# Copy the example environment file
cp .env.example .env

# Edit the file with your settings
nano .env
```

#### Required Environment Variables
```env
# API Keys (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://aioptimization:password123@localhost:5432/aioptimization

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-here-change-in-production
```

### 4. Install Python Dependencies

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Set Up Database Schema

```bash
# Make sure you're in the backend directory
cd backend

# Run database migrations
python -m alembic upgrade head
```

### 6. Create Required Directories

```bash
# From project root
mkdir -p uploads logs backend/logs backend/uploads
```

## Running the Application

### 1. Start Required Services

#### Start Redis
```bash
# Linux/macOS
redis-server

# Windows
redis-server.exe

# Or as a service
sudo systemctl start redis-server  # Linux
brew services start redis          # macOS
```

#### Start PostgreSQL (if not running as service)
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql

# Windows
# Start from Services or use pg_ctl
```

### 2. Start the API Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if using one)
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate     # Windows

# Start the server
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Verify Installation

#### Test API Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00"
  }
}
```

#### Access API Documentation
Open your browser and go to: `http://localhost:8000/docs`

## API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /analyze-brand` - Brand analysis
- `POST /optimization-metrics` - Calculate metrics
- `POST /analyze-queries` - Query analysis
- `GET /brands` - List brands
- `GET /brands/{brand_name}/history` - Brand history

### Example API Usage

#### Brand Analysis
```bash
curl -X POST "http://localhost:8000/analyze-brand" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_name": "Example Brand",
    "website_url": "https://example.com",
    "product_categories": ["technology", "software"]
  }'
```

## Configuration Options

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `ANTHROPIC_API_KEY` | Anthropic API key | - | Yes |
| `OPENAI_API_KEY` | OpenAI API key | - | No |
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` | No |
| `SECRET_KEY` | Application secret key | - | Yes |
| `DEBUG` | Debug mode | `false` | No |
| `LOG_LEVEL` | Logging level | `INFO` | No |

### Database Configuration
```env
DATABASE_URL=postgresql://username:password@host:port/database
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40
```

### Redis Configuration
```env
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_SSL=false
REDIS_DB=0
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: could not connect to database
```
**Solution:**
- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database and user exist
- Check firewall settings

#### 2. Redis Connection Error
```
Error: Redis connection failed
```
**Solution:**
- Check if Redis is running: `redis-cli ping`
- Verify REDIS_URL in .env
- Check Redis configuration

#### 3. Import Errors
```
ModuleNotFoundError: No module named 'xxx'
```
**Solution:**
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version (3.9+ required)

#### 4. Permission Errors
```
Permission denied: xxx
```
**Solution:**
- Check file permissions
- Run with appropriate user privileges
- Ensure directories are writable

#### 5. Port Already in Use
```
Error: Address already in use
```
**Solution:**
- Change port: `--port 8001`
- Kill existing process: `lsof -ti:8000 | xargs kill`
- Check for other services using the port

### Performance Optimization

#### For Development
```bash
# Use reload for development
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

#### For Production
```bash
# Use multiple workers
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4

# Or use Gunicorn
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Monitoring

#### Health Check
```bash
# Check API health
curl http://localhost:8000/health

# Check database
psql -d aioptimization -c "SELECT 1;"

# Check Redis
redis-cli ping
```

#### Logs
```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

## Development Workflow

### 1. Code Changes
```bash
# Make changes to your code
# The server will auto-reload (if using --reload flag)
```

### 2. Database Changes
```bash
# Create new migration
python -m alembic revision --autogenerate -m "Description"

# Apply migrations
python -m alembic upgrade head
```

### 3. Testing
```bash
# Run tests
python -m pytest

# Run specific test
python -m pytest tests/test_api.py::test_health_check
```

## Security Considerations

### Production Deployment
1. **Change default passwords**
2. **Use strong SECRET_KEY**
3. **Enable HTTPS**
4. **Configure firewall**
5. **Use environment-specific settings**
6. **Regular security updates**

### Environment Variables
- Never commit `.env` files to version control
- Use different keys for development/production
- Rotate API keys regularly

## Support

### Getting Help
1. Check the troubleshooting section above
2. Review the API documentation at `http://localhost:8000/docs`
3. Check logs for detailed error messages
4. Verify all prerequisites are installed

### Useful Commands
```bash
# Check Python version
python --version

# Check PostgreSQL version
psql --version

# Check Redis version
redis-cli --version

# Check if services are running
systemctl status postgresql redis-server

# View real-time logs
tail -f logs/app.log
```

## Next Steps

After successful setup:
1. **Add your API keys** to the `.env` file
2. **Test the API** using the documentation
3. **Integrate tracking** on your website
4. **Analyze your brand** using the API endpoints
5. **Monitor performance** and optimize as needed 
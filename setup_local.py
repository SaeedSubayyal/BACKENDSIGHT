#!/usr/bin/env python3
"""
Local Setup Script for AI Optimization Engine
This script helps you set up and run the application without Docker
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_header():
    print("=" * 60)
    print("AI Optimization Engine - Local Setup")
    print("=" * 60)

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Python 3.9+ is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
    return True

def check_dependencies():
    """Check if required system dependencies are installed"""
    print("\n🔍 Checking system dependencies...")
    
    # Check PostgreSQL
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ PostgreSQL - Found")
        else:
            print("❌ PostgreSQL - Not found")
            return False
    except FileNotFoundError:
        print("❌ PostgreSQL - Not found in PATH")
        print("   Please install PostgreSQL and add it to your PATH")
        return False
    
    # Check Redis
    try:
        result = subprocess.run(['redis-cli', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Redis - Found")
        else:
            print("❌ Redis - Not found")
            return False
    except FileNotFoundError:
        print("❌ Redis - Not found in PATH")
        print("   Please install Redis and add it to your PATH")
        return False
    
    return True

def create_env_file():
    """Create .env file with default configuration"""
    env_content = """# API Keys (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://aioptimization:password123@localhost:5432/aioptimization
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=40

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_SSL=false
REDIS_DB=0

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application Settings
DEBUG=true
ENVIRONMENT=development
LOG_LEVEL=INFO

# CORS Settings
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001","http://127.0.0.1:3000"]

# Tracking Settings
ENABLE_REAL_TRACKING=true
TRACKING_API_ENDPOINT=/track-bot
TRACKING_SCRIPT_VERSION=1.0.0

# LLM Settings
CLAUDE_MODEL=claude-3-sonnet-20240229
GPT_MODEL=gpt-4
MAX_TOKENS=1000
TEMPERATURE=0.3
REQUEST_TIMEOUT=30

# File Upload Settings
MAX_UPLOAD_SIZE=104857600
TEMP_UPLOAD_PATH=./uploads

# Analysis Settings
MAX_CONCURRENT_ANALYSES=10
ANALYSIS_TIMEOUT=300
MAX_QUERIES_PER_ANALYSIS=50
MAX_CONTENT_CHUNKS=1000
"""
    
    env_path = Path(".env")
    if env_path.exists():
        print("⚠️  .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Skipping .env file creation")
            return
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    print("✅ Created .env file")
    print("   Please edit .env file and add your API keys")

def install_python_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")
    
    requirements_path = Path("backend/requirements.txt")
    if not requirements_path.exists():
        print("❌ requirements.txt not found")
        return False
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', str(requirements_path)], check=True)
        print("✅ Python dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def setup_database():
    """Setup database tables"""
    print("\n🗄️  Setting up database...")
    
    # Change to backend directory
    os.chdir("backend")
    
    try:
        # Run database migrations
        subprocess.run([sys.executable, '-m', 'alembic', 'upgrade', 'head'], check=True)
        print("✅ Database migrations completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Database setup failed: {e}")
        print("   Make sure PostgreSQL is running and DATABASE_URL is correct")
        return False
    finally:
        # Change back to root directory
        os.chdir("..")

def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")
    
    directories = [
        "uploads",
        "logs",
        "backend/logs",
        "backend/uploads"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Created {directory}")

def print_next_steps():
    """Print next steps for the user"""
    print("\n" + "=" * 60)
    print("🎉 Setup Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Edit .env file and add your API keys:")
    print("   - ANTHROPIC_API_KEY (required)")
    print("   - OPENAI_API_KEY (optional)")
    print("   - Update DATABASE_URL if needed")
    print("\n2. Start Redis server:")
    print("   redis-server")
    print("\n3. Start PostgreSQL (if not already running)")
    print("\n4. Run the application:")
    print("   cd backend")
    print("   python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload")
    print("\n5. Access the API:")
    print("   - API: http://localhost:8000")
    print("   - Docs: http://localhost:8000/docs")
    print("\n6. Test the API:")
    print("   curl http://localhost:8000/health")

def main():
    print_header()
    
    if not check_python_version():
        sys.exit(1)
    
    if not check_dependencies():
        print("\n❌ Please install missing dependencies and try again")
        sys.exit(1)
    
    create_env_file()
    
    if not install_python_dependencies():
        print("\n❌ Failed to install Python dependencies")
        sys.exit(1)
    
    create_directories()
    
    if not setup_database():
        print("\n⚠️  Database setup failed. You may need to:")
        print("   1. Start PostgreSQL")
        print("   2. Create database: createdb aioptimization")
        print("   3. Update DATABASE_URL in .env")
        print("   4. Run setup again")
    
    print_next_steps()

if __name__ == "__main__":
    main() 
#!/usr/bin/env python3
"""
Local Startup Script for AI Optimization Engine
Quick start the application without Docker
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_services():
    """Check if required services are running"""
    print("🔍 Checking required services...")
    
    # Check Redis
    try:
        result = subprocess.run(['redis-cli', 'ping'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0 and 'PONG' in result.stdout:
            print("✅ Redis - Running")
        else:
            print("❌ Redis - Not responding")
            return False
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ Redis - Not running")
        print("   Start Redis with: redis-server")
        return False
    
    # Check PostgreSQL
    try:
        result = subprocess.run(['psql', '-d', 'aioptimization', '-c', 'SELECT 1;'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            print("✅ PostgreSQL - Running")
        else:
            print("❌ PostgreSQL - Connection failed")
            return False
    except (FileNotFoundError, subprocess.TimeoutExpired):
        print("❌ PostgreSQL - Not running")
        print("   Start PostgreSQL or check DATABASE_URL in .env")
        return False
    
    return True

def check_env_file():
    """Check if .env file exists and has required keys"""
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found")
        print("   Run setup_local.py first or create .env file manually")
        return False
    
    # Check for required environment variables
    required_vars = ['ANTHROPIC_API_KEY', 'DATABASE_URL']
    missing_vars = []
    
    with open(env_path, 'r') as f:
        content = f.read()
        for var in required_vars:
            if f'{var}=' not in content or f'{var}=your_' in content:
                missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing or invalid environment variables: {', '.join(missing_vars)}")
        print("   Please update your .env file")
        return False
    
    print("✅ Environment configuration - OK")
    return True

def start_server():
    """Start the FastAPI server"""
    print("\n🚀 Starting AI Optimization Engine...")
    
    # Change to backend directory
    backend_path = Path("backend")
    if not backend_path.exists():
        print("❌ Backend directory not found")
        return False
    
    os.chdir(backend_path)
    
    # Check if virtual environment exists
    venv_path = Path("venv")
    if venv_path.exists():
        print("📦 Using virtual environment")
        if os.name == 'nt':  # Windows
            activate_script = venv_path / "Scripts" / "activate"
        else:  # Unix/Linux/macOS
            activate_script = venv_path / "bin" / "activate"
        
        if activate_script.exists():
            print("✅ Virtual environment found")
        else:
            print("⚠️  Virtual environment incomplete, using system Python")
    
    # Start the server
    try:
        print("🌐 Starting server on http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("🏥 Health Check: http://localhost:8000/health")
        print("\nPress Ctrl+C to stop the server")
        print("-" * 50)
        
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'api:app', 
            '--host', '0.0.0.0', 
            '--port', '8000', 
            '--reload'
        ])
        
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False
    
    return True

def main():
    print("=" * 60)
    print("AI Optimization Engine - Local Startup")
    print("=" * 60)
    
    # Check prerequisites
    if not check_env_file():
        sys.exit(1)
    
    if not check_services():
        print("\n❌ Required services are not running")
        print("Please start Redis and PostgreSQL before running this script")
        sys.exit(1)
    
    # Start the server
    start_server()

if __name__ == "__main__":
    main() 
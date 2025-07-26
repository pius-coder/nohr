@echo off
REM 🚀 NOHR Server Startup Script for Windows
REM This script builds and starts the NOHR server

echo 🔨 Building server...
node esbuild.config.js server

echo 🚀 Starting NOHR server...
node dist/server.js

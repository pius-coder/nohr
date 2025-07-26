#!/bin/bash

# 🚀 NOHR Server Startup Script
# This script builds and starts the NOHR server

set -e

echo "🔨 Building server..."
node esbuild.config.js server

echo "🚀 Starting NOHR server..."
node dist/server.js

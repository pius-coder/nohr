#!/usr/bin/env node

// 🔥 HMR Demo Script
// This script demonstrates the HMR functionality by starting the server and making live changes

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(status, message) {
  const timestamp = new Date().toLocaleTimeString();
  const statusColors = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
    demo: colors.magenta,
    hmr: colors.cyan,
  };
  
  const color = statusColors[status] || colors.reset;
  console.log(`${color}[${timestamp}] [DEMO] ${message}${colors.reset}`);
}

class HMRDemo {
  constructor() {
    this.serverProcess = null;
    this.ws = null;
    this.demoStep = 0;
    this.demoSteps = [
      'Starting HMR server',
      'Connecting to WebSocket',
      'Creating demo component',
      'Making live changes',
      'Demonstrating error handling',
      'Cleanup and summary'
    ];
  }

  async runDemo() {
    console.log(`${colors.bright}${colors.magenta}🔥 NOHR HMR Implementation Demo${colors.reset}`);
    console.log(`${colors.cyan}This demo showcases the Hot Module Replacement functionality${colors.reset}`);
    console.log('');

    try {
      await this.step1_StartServer();
      await this.step2_ConnectWebSocket();
      await this.step3_CreateDemoComponent();
      await this.step4_MakeLiveChanges();
      await this.step5_DemonstrateErrorHandling();
      await this.step6_Cleanup();
      
      this.showSummary();
      
    } catch (error) {
      log('error', `Demo failed: ${error.message}`);
      await this.cleanup();
      process.exit(1);
    }
  }

  nextStep() {
    this.demoStep++;
    const step = this.demoSteps[this.demoStep - 1];
    log('demo', `Step ${this.demoStep}: ${step}`);
  }

  async step1_StartServer() {
    this.nextStep();
    
    return new Promise((resolve, reject) => {
      log('info', 'Starting HMR development server...');
      
      this.serverProcess = spawn('node', ['scripts/hmr-dev-server.js'], {
        stdio: 'pipe',
        env: { ...process.env, NODE_ENV: 'development' }
      });

      let output = '';
      
      this.serverProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        // Show relevant output
        if (text.includes('[HMR]')) {
          console.log(text.trim());
        }
        
        if (output.includes('HMR Dev server ready!')) {
          log('success', '✅ HMR server started successfully');
          setTimeout(resolve, 2000); // Wait a bit for full startup
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error(error);
        if (error.includes('Error') || error.includes('Failed')) {
          reject(new Error(error));
        }
      });

      // Timeout after 45 seconds
      setTimeout(() => {
        reject(new Error('Server start timeout'));
      }, 45000);
    });
  }

  async step2_ConnectWebSocket() {
    this.nextStep();
    
    return new Promise((resolve, reject) => {
      log('info', 'Connecting to HMR WebSocket server...');
      
      try {
        this.ws = new WebSocket('ws://localhost:3002');
        
        this.ws.on('open', () => {
          log('success', '✅ WebSocket connection established');
          resolve();
        });

        this.ws.on('error', (error) => {
          log('error', `WebSocket error: ${error.message}`);
          reject(error);
        });

        this.ws.on('message', (data) => {
          try {
            const update = JSON.parse(data.toString());
            log('hmr', `📡 Received HMR update: ${update.type} (${update.updateType || 'N/A'})`);
          } catch (e) {
            log('warning', 'Received invalid JSON from WebSocket');
          }
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 10000);

      } catch (error) {
        reject(error);
      }
    });
  }

  async step3_CreateDemoComponent() {
    this.nextStep();
    
    log('info', 'Creating demo React component...');
    
    const demoComponentPath = path.join(projectRoot, 'app/(pages)/hmr-demo.tsx');
    const demoComponent = `
import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#ff6b6b' }}>🔥 HMR Demo Component</h1>
      <p>This component was created at: {new Date().toLocaleTimeString()}</p>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        margin: '10px 0'
      }}>
        <h3>HMR Features:</h3>
        <ul>
          <li>⚡ Fast rebuilds with esbuild</li>
          <li>🔌 WebSocket communication</li>
          <li>🎨 CSS hot reloading</li>
          <li>🚨 Error overlays</li>
          <li>🔄 Graceful fallbacks</li>
        </ul>
      </div>
      <p style={{ color: '#6bcf7f' }}>
        Try editing this file to see HMR in action!
      </p>
    </div>
  )
})
    `;

    writeFileSync(demoComponentPath, demoComponent);
    log('success', '✅ Demo component created at app/(pages)/hmr-demo.tsx');
    
    // Wait for HMR to process the new file
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  async step4_MakeLiveChanges() {
    this.nextStep();
    
    log('info', 'Making live changes to demonstrate HMR...');
    
    const demoComponentPath = path.join(projectRoot, 'app/(pages)/hmr-demo.tsx');
    
    // Make several changes with delays
    const changes = [
      {
        description: 'Changing the title color',
        find: "color: '#ff6b6b'",
        replace: "color: '#4ecdc4'"
      },
      {
        description: 'Adding a new feature',
        find: '<li>🔄 Graceful fallbacks</li>',
        replace: '<li>🔄 Graceful fallbacks</li>\n          <li>🎯 Live component updates</li>'
      },
      {
        description: 'Updating the timestamp',
        find: 'This component was created at:',
        replace: 'This component was last updated at:'
      }
    ];

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i];
      log('info', `Change ${i + 1}: ${change.description}`);
      
      let content = readFileSync(demoComponentPath, 'utf8');
      content = content.replace(change.find, change.replace);
      writeFileSync(demoComponentPath, content);
      
      log('hmr', '📝 File updated, waiting for HMR...');
      
      // Wait for HMR to process
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    log('success', '✅ Live changes completed');
  }

  async step5_DemonstrateErrorHandling() {
    this.nextStep();
    
    log('info', 'Demonstrating error handling...');
    
    const demoComponentPath = path.join(projectRoot, 'app/(pages)/hmr-demo.tsx');
    let originalContent = readFileSync(demoComponentPath, 'utf8');
    
    // Introduce a syntax error
    const brokenContent = originalContent.replace('return c.render(', 'return c.render(((((');
    writeFileSync(demoComponentPath, brokenContent);
    
    log('warning', '💥 Introduced syntax error to test error handling');
    
    // Wait for error to be processed
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Fix the error
    writeFileSync(demoComponentPath, originalContent);
    log('success', '🔧 Fixed the syntax error');
    
    // Wait for recovery
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log('success', '✅ Error handling demonstration completed');
  }

  async step6_Cleanup() {
    this.nextStep();
    
    log('info', 'Cleaning up demo files...');
    
    const demoComponentPath = path.join(projectRoot, 'app/(pages)/hmr-demo.tsx');
    
    try {
      if (existsSync(demoComponentPath)) {
        const fs = await import('fs');
        fs.unlinkSync(demoComponentPath);
        log('success', '🗑️ Demo component removed');
      }
    } catch (error) {
      log('warning', `Could not remove demo component: ${error.message}`);
    }
    
    await this.cleanup();
    log('success', '✅ Cleanup completed');
  }

  async cleanup() {
    if (this.ws) {
      this.ws.close();
    }
    
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  showSummary() {
    console.log('');
    console.log(`${colors.bright}${colors.green}🎉 HMR Demo Completed Successfully!${colors.reset}`);
    console.log('');
    console.log(`${colors.cyan}What was demonstrated:${colors.reset}`);
    console.log('  ✅ HMR server startup and WebSocket connection');
    console.log('  ✅ Live component creation and updates');
    console.log('  ✅ Real-time file change detection');
    console.log('  ✅ Error handling and recovery');
    console.log('  ✅ Graceful cleanup');
    console.log('');
    console.log(`${colors.yellow}Next steps:${colors.reset}`);
    console.log('  1. Run `pnpm dev:hmr` to start development with HMR');
    console.log('  2. Open http://localhost:3000 in your browser');
    console.log('  3. Edit files in app/ directory to see live updates');
    console.log('  4. Check the browser console for HMR messages');
    console.log('');
    console.log(`${colors.magenta}For more information, see HMR_IMPLEMENTATION.md${colors.reset}`);
  }
}

// Run demo if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new HMRDemo();
  demo.runDemo().catch((error) => {
    console.error('Demo failed:', error);
    process.exit(1);
  });
}

// 🔥 HMR Client Runtime for NOHR
// This module provides Hot Module Replacement functionality for React components

interface HMRUpdate {
  type: 'update' | 'error' | 'connected';
  updateType?: 'client' | 'css' | 'component';
  file?: string;
  timestamp?: number;
  error?: string;
}

interface HMRModule {
  id: string;
  hot?: {
    accept: (callback?: () => void) => void;
    dispose: (callback: () => void) => void;
    invalidate: () => void;
  };
}

declare global {
  interface Window {
    __HMR_RUNTIME__: HMRRuntime;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
  }
}

class HMRRuntime {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000;
  private modules = new Map<string, HMRModule>();
  private updateQueue: HMRUpdate[] = [];
  private isProcessingUpdates = false;

  constructor(private port: number = 3002) {
    this.connect();
    this.setupErrorHandling();
  }

  private connect() {
    try {
      this.ws = new WebSocket(`ws://localhost:${this.port}`);
      
      this.ws.onopen = () => {
        console.log('[HMR] 🔥 Connected to HMR server');
        this.reconnectAttempts = 0;
        this.processUpdate({ type: 'connected' });
      };

      this.ws.onmessage = (event) => {
        try {
          const update: HMRUpdate = JSON.parse(event.data);
          this.handleUpdate(update);
        } catch (error) {
          console.error('[HMR] Failed to parse update:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('[HMR] 🔌 Disconnected from HMR server');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[HMR] WebSocket error:', error);
      };

    } catch (error) {
      console.error('[HMR] Failed to connect:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[HMR] Max reconnection attempts reached. Please refresh the page.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`[HMR] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleUpdate(update: HMRUpdate) {
    this.updateQueue.push(update);
    if (!this.isProcessingUpdates) {
      this.processUpdateQueue();
    }
  }

  private async processUpdateQueue() {
    this.isProcessingUpdates = true;

    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift()!;
      await this.processUpdate(update);
    }

    this.isProcessingUpdates = false;
  }

  private async processUpdate(update: HMRUpdate) {
    switch (update.type) {
      case 'update':
        await this.handleModuleUpdate(update);
        break;
      case 'error':
        this.handleError(update);
        break;
      case 'connected':
        this.handleConnected();
        break;
    }
  }

  private async handleModuleUpdate(update: HMRUpdate) {
    console.log(`[HMR] 🔄 Processing ${update.updateType} update for ${update.file}`);

    switch (update.updateType) {
      case 'client':
        await this.handleClientUpdate(update);
        break;
      case 'css':
        await this.handleCSSUpdate(update);
        break;
      case 'component':
        await this.handleComponentUpdate(update);
        break;
      default:
        console.warn('[HMR] Unknown update type:', update.updateType);
    }
  }

  private async handleClientUpdate(update: HMRUpdate) {
    // For client updates, we need to reload the page
    // In the future, we could implement more granular updates
    console.log('[HMR] 🔄 Reloading page for client update...');
    
    // Add a small delay to ensure the build is complete
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  private async handleCSSUpdate(update: HMRUpdate) {
    console.log('[HMR] 🎨 Hot reloading CSS...');
    
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link: HTMLLinkElement) => {
      const href = link.href.split('?')[0]; // Remove existing query params
      link.href = `${href}?t=${Date.now()}`;
    });

    // Also handle style tags
    const styles = document.querySelectorAll('style[data-hmr]');
    styles.forEach((style) => {
      // Trigger re-evaluation of CSS modules
      style.setAttribute('data-hmr-timestamp', Date.now().toString());
    });
  }

  private async handleComponentUpdate(update: HMRUpdate) {
    console.log('[HMR] ⚛️ Hot reloading React component...');
    
    // This is where we would implement React Fast Refresh
    // For now, we'll fall back to page reload
    if (this.canHotReloadComponent(update.file)) {
      await this.hotReloadComponent(update.file!);
    } else {
      console.log('[HMR] Component cannot be hot reloaded, falling back to page reload');
      window.location.reload();
    }
  }

  private canHotReloadComponent(file?: string): boolean {
    if (!file) return false;
    
    // Check if the file is a React component
    const isReactFile = /\.(tsx|jsx)$/.test(file);
    const isInAppDirectory = file.includes('/app/');
    
    return isReactFile && isInAppDirectory;
  }

  private async hotReloadComponent(file: string) {
    try {
      // Attempt to hot reload the specific component
      // This would require more sophisticated module tracking
      console.log(`[HMR] Attempting to hot reload component: ${file}`);
      
      // For now, we'll reload the page
      // In a full implementation, we would:
      // 1. Track component instances
      // 2. Re-import the updated module
      // 3. Replace component instances
      // 4. Preserve component state where possible
      
      window.location.reload();
    } catch (error) {
      console.error('[HMR] Failed to hot reload component:', error);
      window.location.reload();
    }
  }

  private handleError(update: HMRUpdate) {
    console.error('[HMR] ❌ Build error:', update.error);
    
    // Show error overlay
    this.showErrorOverlay(update.error || 'Unknown build error');
  }

  private handleConnected() {
    // Hide any existing error overlays
    this.hideErrorOverlay();
  }

  private showErrorOverlay(error: string) {
    // Remove existing overlay
    this.hideErrorOverlay();

    const overlay = document.createElement('div');
    overlay.id = 'hmr-error-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      padding: 20px;
      z-index: 999999;
      overflow: auto;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: #1e1e1e;
      border: 1px solid #ff6b6b;
      border-radius: 8px;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    `;

    content.innerHTML = `
      <h2 style="color: #ff6b6b; margin-top: 0;">🔥 HMR Build Error</h2>
      <pre style="white-space: pre-wrap; color: #ffd93d;">${error}</pre>
      <p style="color: #6bcf7f; margin-bottom: 0;">
        Fix the error and save the file to continue.
      </p>
    `;

    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Close overlay on click
    overlay.addEventListener('click', () => {
      this.hideErrorOverlay();
    });
  }

  private hideErrorOverlay() {
    const overlay = document.getElementById('hmr-error-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  private setupErrorHandling() {
    // Catch and display runtime errors
    window.addEventListener('error', (event) => {
      console.error('[HMR] Runtime error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('[HMR] Unhandled promise rejection:', event.reason);
    });
  }

  // Public API for modules to register for HMR
  public accept(moduleId: string, callback?: () => void) {
    const module: HMRModule = {
      id: moduleId,
      hot: {
        accept: callback || (() => {}),
        dispose: () => {},
        invalidate: () => {
          console.log(`[HMR] Module ${moduleId} invalidated`);
        }
      }
    };

    this.modules.set(moduleId, module);
    console.log(`[HMR] Module ${moduleId} registered for HMR`);
  }

  public dispose() {
    if (this.ws) {
      this.ws.close();
    }
    this.modules.clear();
    this.hideErrorOverlay();
  }
}

// Initialize HMR runtime
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const hmrPort = parseInt(process.env.HMR_PORT || '3002', 10);
  window.__HMR_RUNTIME__ = new HMRRuntime(hmrPort);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (window.__HMR_RUNTIME__) {
      window.__HMR_RUNTIME__.dispose();
    }
  });
}

export default window.__HMR_RUNTIME__;

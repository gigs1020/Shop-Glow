/**
 * MASTERMIND CORE - The Single Strategic Brain
 * Write once, use everywhere philosophy
 */

// === STATE MANAGEMENT MASTERMIND ===
const MasterState = {
  data: new Map(),
  subscribers: new Map(),
  
  set(key, value) {
    this.data.set(key, value);
    this.notify(key, value);
  },
  
  get(key) {
    return this.data.get(key);
  },
  
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) this.subscribers.set(key, []);
    this.subscribers.get(key).push(callback);
  },
  
  notify(key, value) {
    const callbacks = this.subscribers.get(key) || [];
    callbacks.forEach(cb => cb(value));
  }
};

// === UNIVERSAL COMPONENT SYSTEM ===
const MasterComponents = {
  create(template, data = {}) {
    const element = document.createElement('div');
    element.innerHTML = this.interpolate(template, data);
    return element.firstElementChild;
  },
  
  interpolate(str, data) {
    return str.replace(/{{(\w+)}}/g, (match, key) => data[key] || '');
  },
  
  render(selector, component) {
    const container = document.querySelector(selector);
    if (container) {
      container.innerHTML = '';
      container.appendChild(component);
    }
  }
};

// === UNIVERSAL UTILITIES ===
const MasterUtils = {
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      return null;
    }
  },
  
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },
  
  throttle(func, delay) {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  },
  
  lazy(selector, callback) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });
    
    document.querySelectorAll(selector).forEach(el => observer.observe(el));
  }
};

// === PERFORMANCE PSYCHOLOGY ===
const MasterPerformance = {
  preload(urls) {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      document.head.appendChild(link);
    });
  },
  
  criticalCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  },
  
  loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  },
  
  measure(name, fn) {
    performance.mark(`${name}-start`);
    const result = fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    return result;
  }
};

// === ROUTER MASTERMIND ===
const MasterRouter = {
  routes: new Map(),
  current: '',
  
  add(path, handler) {
    this.routes.set(path, handler);
  },
  
  navigate(path) {
    if (this.current !== path) {
      this.current = path;
      history.pushState(null, '', path);
      this.resolve(path);
    }
  },
  
  resolve(path = location.pathname) {
    const handler = this.routes.get(path) || this.routes.get('*');
    if (handler) handler();
  },
  
  init() {
    window.addEventListener('popstate', () => this.resolve());
    this.resolve();
  }
};

// === FORM MASTERMIND ===
const MasterForms = {
  validate(form) {
    const errors = {};
    const formData = new FormData(form);
    
    for (let [name, value] of formData.entries()) {
      const field = form.querySelector(`[name="${name}"]`);
      const rules = field.dataset.rules?.split('|') || [];
      
      for (let rule of rules) {
        if (rule === 'required' && !value) {
          errors[name] = 'This field is required';
          break;
        }
        if (rule.startsWith('min:') && value.length < parseInt(rule.split(':')[1])) {
          errors[name] = `Minimum ${rule.split(':')[1]} characters`;
          break;
        }
        if (rule === 'email' && !/\S+@\S+\.\S+/.test(value)) {
          errors[name] = 'Invalid email format';
          break;
        }
      }
    }
    
    return Object.keys(errors).length ? errors : null;
  },
  
  submit(form, callback) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errors = this.validate(form);
      if (errors) {
        this.showErrors(form, errors);
        return;
      }
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      await callback(data);
    });
  },
  
  showErrors(form, errors) {
    Object.keys(errors).forEach(name => {
      const field = form.querySelector(`[name="${name}"]`);
      const errorEl = field.parentNode.querySelector('.error');
      if (errorEl) errorEl.textContent = errors[name];
    });
  }
};

// === ANIMATION MASTERMIND ===
const MasterAnimations = {
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },
  
  slideIn(element, direction = 'left', duration = 300) {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      up: 'translateY(-100%)',
      down: 'translateY(100%)'
    };
    
    element.style.transform = transforms[direction];
    element.style.transition = `transform ${duration}ms ease`;
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0)';
    });
  },
  
  pulse(element, scale = 1.1, duration = 200) {
    element.style.transition = `transform ${duration}ms ease`;
    element.style.transform = `scale(${scale})`;
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, duration);
  }
};

// Global exposure for strategic access
window.Master = {
  State: MasterState,
  Components: MasterComponents,
  Utils: MasterUtils,
  Performance: MasterPerformance,
  Router: MasterRouter,
  Forms: MasterForms,
  Animations: MasterAnimations
};
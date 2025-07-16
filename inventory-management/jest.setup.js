require('@testing-library/jest-dom')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock fetch globally
global.fetch = jest.fn()

// Mock Web APIs for Next.js testing
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock URL and URLSearchParams
global.URL = require('url').URL
global.URLSearchParams = require('url').URLSearchParams

// Simple mocks for Web APIs needed by Next.js
global.Headers = class MockHeaders extends Map {
  constructor(init) {
    super()
    if (init) {
      if (Array.isArray(init)) {
        for (const [key, value] of init) {
          this.set(key, value)
        }
      } else if (typeof init === 'object') {
        for (const [key, value] of Object.entries(init)) {
          this.set(key, value)
        }
      }
    }
  }
  
  get(name) {
    return super.get(name.toLowerCase())
  }
  
  set(name, value) {
    return super.set(name.toLowerCase(), value)
  }
  
  append(name, value) {
    const existing = this.get(name)
    if (existing) {
      this.set(name, `${existing}, ${value}`)
    } else {
      this.set(name, value)
    }
  }
}

global.Request = class MockRequest {
  constructor(input, options = {}) {
    // Use Object.defineProperty to avoid setter conflicts
    Object.defineProperty(this, 'url', {
      value: typeof input === 'string' ? input : input.url,
      writable: false,
      enumerable: true,
      configurable: true
    })
    
    Object.defineProperty(this, 'method', {
      value: options.method || 'GET',
      writable: false,
      enumerable: true,
      configurable: true
    })
    
    this.headers = new global.Headers(options.headers)
    this.body = options.body || null
    this._bodyUsed = false
  }
  
  get bodyUsed() {
    return this._bodyUsed
  }
  
  async json() {
    this._bodyUsed = true
    return JSON.parse(this.body || '{}')
  }
  
  clone() {
    return new MockRequest(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body
    })
  }
}

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.statusText = options.statusText || 'OK'
    this.headers = new global.Headers(options.headers)
    this.ok = this.status >= 200 && this.status < 300
  }
  
  async json() {
    if (typeof this.body === 'string') {
      return JSON.parse(this.body)
    }
    return this.body
  }
  
  clone() {
    return new MockResponse(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    })
  }
  
  static json(object, options = {}) {
    return new MockResponse(JSON.stringify(object), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }
}

// Mock console methods in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
}

// Mock localStorage and sessionStorage - only in jsdom environment
if (typeof window !== 'undefined') {
  const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
  })

  Object.defineProperty(window, 'sessionStorage', {
    value: mockStorage,
  })
}

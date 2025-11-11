// 性能优化工具集

/**
 * 防抖函数 - 延迟执行，如果在延迟期间再次调用则重新计时
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @param immediate 是否立即执行第一次调用
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T, 
  delay: number, 
  immediate = false
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return ((...args: Parameters<T>) => {
    const callNow = immediate && !timeout
    
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func(...args)
    }, delay)
    
    if (callNow) func(...args)
  }) as T
}

/**
 * 节流函数 - 限制函数调用频率
 * @param func 要节流的函数
 * @param limit 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): T {
  let inThrottle: boolean
  let lastResult: ReturnType<T>
  let lastRan: number
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      inThrottle = true
      lastRan = Date.now()
      lastResult = func(...args)
      setTimeout(() => {
        inThrottle = false
      }, limit)
    } else {
      clearTimeout(lastRan && limit - (Date.now() - lastRan))
      setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          lastResult = func(...args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
    return lastResult
  }) as T
}

/**
 * 防抖节流组合 - 结合防抖和节流的优势
 * @param func 要处理的函数
 * @param delay 防抖延迟时间
 * @param limit 节流时间间隔
 * @returns 处理后的函数
 */
export function debounceThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  limit: number
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastCall = 0
  
  return ((...args: Parameters<T>) => {
    const now = Date.now()
    
    if (now - lastCall >= limit) {
      lastCall = now
      func(...args)
    } else {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        lastCall = Date.now()
        func(...args)
      }, delay)
    }
  }) as T
}

/**
 * 性能监控器
 */
export const performanceMonitor = {
  marks: new Map<string, number>(),
  measurements: new Map<string, number>(),

  mark(name: string) {
    if (typeof performance !== 'undefined') {
      this.marks.set(name, performance.now())
    }
  },

  measure(name: string, startMark?: string, endMark?: string) {
    if (typeof performance !== 'undefined') {
      const start = startMark ? this.marks.get(startMark) : performance.now()
      const end = endMark ? this.marks.get(endMark) : performance.now()
      if (start !== undefined && end !== undefined) {
        this.measurements.set(name, end - start)
        console.log(`Performance measurement - ${name}: ${this.measurements.get(name)?.toFixed(2)}ms`)
      }
    }
  },

  getMeasurement(name: string): number | undefined {
    return this.measurements.get(name)
  },

  clearMarks() {
    this.marks.clear()
  },

  clearMeasurements() {
    this.measurements.clear()
  },
}

/**
 * 图像压缩函数
 * @param file 要压缩的图片文件
 * @param quality 压缩质量 (0-1)
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @returns 压缩后的Blob
 */
export function compressImage(
  file: File, 
  quality = 0.8, 
  maxWidth = 800, 
  maxHeight = 600
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // 保持图片比例
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Canvas toBlob failed'))
            }
          },
          file.type,
          quality
        )
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

/**
 * 内存管理器
 */
export const memoryManager = {
  cache: new Map<string, any>(),
  maxSize: 100,

  set(key: string, value: any) {
    if (this.cache.size >= this.maxSize) {
      // LRU策略：删除最旧的
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    this.cache.set(key, value)
  },

  get(key: string): any | undefined {
    const value = this.cache.get(key)
    if (value) {
      // 刷新LRU顺序
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  },

  delete(key: string) {
    this.cache.delete(key)
  },

  clear() {
    this.cache.clear()
  },

  size(): number {
    return this.cache.size
  },
}

/**
 * 虚拟滚动工具
 */
export class VirtualScroll {
  private container: HTMLElement
  private itemHeight: number
  private visibleCount: number
  private scrollTop: number = 0
  private totalHeight: number = 0
  private startIndex: number = 0
  private endIndex: number = 0

  constructor(container: HTMLElement, itemHeight: number) {
    this.container = container
    this.itemHeight = itemHeight
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2
    this.setupScrollListener()
  }

  private setupScrollListener() {
    this.container.addEventListener('scroll', throttle(() => {
      this.scrollTop = this.container.scrollTop
      this.updateVisibleRange()
    }, 16))
  }

  private updateVisibleRange() {
    this.startIndex = Math.floor(this.scrollTop / this.itemHeight)
    this.endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.totalHeight / this.itemHeight
    )
  }

  setTotalItems(count: number) {
    this.totalHeight = count * this.itemHeight
    this.updateVisibleRange()
  }

  getVisibleRange() {
    return { start: this.startIndex, end: this.endIndex }
  }

  scrollToItem(index: number) {
    this.container.scrollTop = index * this.itemHeight
  }
}

/**
 * 懒加载工具
 */
export class LazyLoader {
  private observer: IntersectionObserver
  private loadedImages: Set<string> = new Set()

  constructor(options: IntersectionObserverInit = {}) {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options
      }
    )
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        this.loadImage(img)
        this.observer.unobserve(img)
      }
    })
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src
    if (src && !this.loadedImages.has(src)) {
      img.src = src
      img.classList.add('loaded')
      this.loadedImages.add(src)
    }
  }

  observe(img: HTMLImageElement) {
    this.observer.observe(img)
  }

  unobserve(img: HTMLImageElement) {
    this.observer.unobserve(img)
  }

  disconnect() {
    this.observer.disconnect()
  }
}

/**
 * 请求去重工具
 */
export class RequestDeduplicator {
  private pendingRequests: Map<string, Promise<any>> = new Map()

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  clear() {
    this.pendingRequests.clear()
  }
}

/**
 * 批量处理工具
 */
export class BatchProcessor<T> {
  private queue: T[] = []
  private processor: (items: T[]) => void
  private delay: number
  private maxSize: number
  private timeout: ReturnType<typeof setTimeout> | null = null

  constructor(
    processor: (items: T[]) => void,
    delay = 100,
    maxSize = 10
  ) {
    this.processor = processor
    this.delay = delay
    this.maxSize = maxSize
  }

  add(item: T) {
    this.queue.push(item)

    if (this.queue.length >= this.maxSize) {
      this.flush()
    } else if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.flush()
      }, this.delay)
    }
  }

  flush() {
    if (this.queue.length > 0) {
      this.processor([...this.queue])
      this.queue = []
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}
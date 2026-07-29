const frame = document.getElementById('asciiFrame')
const colorToggle = document.getElementById('heroColorToggle')
const colorButtons = colorToggle ? [...colorToggle.querySelectorAll('[data-channel]')] : []
const heroScroll = document.querySelector('.hero-scroll')
const projectsSection = document.getElementById('projects')
let selectedChannel = 'rgb'
let asciiFrameReady = false
let asciiKickInterval = null

if (window.location.pathname === '/mog-ai' && new URLSearchParams(window.location.search).has('revision')) {
  window.history.replaceState(null, '', '/mog-ai')
}

function updateHeroViewportHeight() {
  const vvHeight = window.visualViewport?.height || 0
  const vh = Math.max(window.innerHeight, vvHeight) * 0.01
  document.documentElement.style.setProperty('--hero-vh', `${vh}px`)
}

function postToAscii(message) {
  if (!frame || !frame.contentWindow) return
  frame.contentWindow.postMessage(message, window.location.origin)
}

function syncColorMode() {
  postToAscii({ type: 'ascii:setColorChannel', channel: selectedChannel })
}

function setActiveChannel(channel) {
  selectedChannel = channel
  for (const btn of colorButtons) {
    const isActive = btn.dataset.channel === channel
    btn.classList.toggle('is-active', isActive)
    btn.setAttribute('aria-checked', isActive ? 'true' : 'false')
  }
}

if (frame) {
  const resumeAscii = () => {
    postToAscii({ type: 'ascii:resume' })
    postToAscii({ type: 'ascii:refresh' })
  }

  frame.addEventListener('load', () => {
    asciiFrameReady = false
    syncColorMode()
    resumeAscii()
    if (asciiKickInterval) clearInterval(asciiKickInterval)
    asciiKickInterval = window.setInterval(() => {
      if (asciiFrameReady) return
      resumeAscii()
    }, 500)
    window.setTimeout(() => {
      if (asciiKickInterval) {
        clearInterval(asciiKickInterval)
        asciiKickInterval = null
      }
    }, 10000)
  })

  window.addEventListener('pageshow', resumeAscii)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) resumeAscii()
  })
  window.addEventListener('touchstart', resumeAscii, { passive: true })
  window.addEventListener('pointerdown', resumeAscii, { passive: true })
  window.addEventListener('scroll', resumeAscii, { passive: true })
}

window.addEventListener('message', (event) => {
  if (event.origin !== window.location.origin) return
  if (event.data?.type === 'ascii:frame') {
    asciiFrameReady = true
    if (asciiKickInterval) {
      clearInterval(asciiKickInterval)
      asciiKickInterval = null
    }
  }
})

updateHeroViewportHeight()
window.addEventListener('resize', updateHeroViewportHeight)
window.visualViewport?.addEventListener('resize', updateHeroViewportHeight)

function scrollToCurrentRoute(behavior = 'auto') {
  if (window.location.pathname === '/projects') {
    projectsSection?.scrollIntoView({ behavior, block: 'start' })
    return
  }

  if (window.location.pathname === '/') {
    window.scrollTo({ top: 0, behavior })
  }
}

if (projectsSection) {
  const loadedProjectsRoute = window.location.pathname === '/projects' || window.location.pathname === '/projects/'
  const requestedProjectsSection = new URLSearchParams(window.location.search).get('section') === 'projects'

  if (loadedProjectsRoute) {
    window.location.replace('/')
  } else {
    if (requestedProjectsSection) {
      window.history.replaceState(null, '', '/projects')
      projectsSection.scrollIntoView({ block: 'start' })
    } else {
      scrollToCurrentRoute()
    }

    window.addEventListener('popstate', () => scrollToCurrentRoute('smooth'))
  }
}

if (heroScroll && projectsSection) {
  heroScroll.addEventListener('click', (event) => {
    event.preventDefault()
    if (window.location.pathname !== '/projects') {
      window.history.pushState(null, '', '/projects')
    }
    projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

if (colorButtons.length > 0) {
  for (const btn of colorButtons) {
    btn.addEventListener('click', () => {
      const channel = btn.dataset.channel || 'rgb'
      setActiveChannel(channel)
      syncColorMode()
    })
  }
}

const revealItems = document.querySelectorAll('.reveal')
if (revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.35 },
  )

  revealItems.forEach((el) => observer.observe(el))
}

const blurSequences = document.querySelectorAll('.blur-sequence')
if (blurSequences.length > 0) {
  const blurObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-visible')
        blurObserver.unobserve(entry.target)
      }
    },
    { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
  )

  blurSequences.forEach((sequence) => blurObserver.observe(sequence))
}

const wrapFrame = (index, count) => ((index % count) + count) % count

function createSpinFrameCache(frameBase, frameCount, framePrefix, preloadDirection) {
  const cache = new Array(frameCount)
  const load = (index) => {
    const wrapped = wrapFrame(index, frameCount)
    if (!cache[wrapped]) {
      cache[wrapped] = new Image()
      cache[wrapped].src = `${frameBase}/${framePrefix}${String(wrapped).padStart(3, '0')}.webp`
    }
    return cache[wrapped]
  }

  ;[0, 1, 2, frameCount - 2, frameCount - 1].forEach(load)

  const cacheStep = preloadDirection < 0 ? -1 : 1
  let nextFrame = cacheStep < 0 ? frameCount - 3 : 3
  const warmBatch = () => {
    let loaded = 0
    while (loaded < 8 && nextFrame > 2 && nextFrame < frameCount - 2) {
      load(nextFrame)
      nextFrame += cacheStep
      loaded += 1
    }
    if (nextFrame > 2 && nextFrame < frameCount - 2) window.setTimeout(warmBatch, 24)
  }
  window.setTimeout(warmBatch, 80)

  return load
}

function hydrateSpinViewer(rotator) {
  const frame = rotator.querySelector('.spin-viewer-frame')
  const frameCount = Number(rotator.dataset.frameCount)
  const frameBase = rotator.dataset.frameBase
  const framePrefix = rotator.dataset.framePrefix || 'frame-'
  const configuredFrameRate = Number(rotator.dataset.frameRate)
  const autoDirection = Number(rotator.dataset.autoDirection) < 0 ? -1 : 1
  const dragDirection = Number(rotator.dataset.dragDirection) < 0 ? -1 : 1
  if (!frame || !frameBase || !Number.isFinite(frameCount) || frameCount < 2) return

  const loadFrame = createSpinFrameCache(frameBase, frameCount, framePrefix, autoDirection)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const frameRate = Number.isFinite(configuredFrameRate) && configuredFrameRate > 0 ? configuredFrameRate : frameCount / 10
  const frameScale = frameCount / 140
  const framesPerPixel = (1 / 5.5) * frameScale
  const decayPerMs = 0.0022
  const stopVelocity = 0.00055 * frameScale
  const maxMomentumVelocity = 0.22 * frameScale
  const autoResumeDelayMs = 1600

  let framePosition = 0
  let renderedFrame = 0
  let startX = 0
  let startFramePosition = 0
  let lastDragPosition = 0
  let lastDragTime = 0
  let velocity = 0
  let isDragging = false
  let momentumFrame = 0
  let autoFrame = 0
  let autoResumeTimer = 0

  const render = () => {
    framePosition = wrapFrame(framePosition, frameCount)
    const nextFrame = wrapFrame(Math.round(framePosition), frameCount)
    if (nextFrame === renderedFrame && frame.src) return
    renderedFrame = nextFrame
    frame.src = loadFrame(nextFrame).src
  }

  const cancelMomentum = () => {
    if (momentumFrame) cancelAnimationFrame(momentumFrame)
    momentumFrame = 0
  }

  const pauseAutoSpin = () => {
    if (autoFrame) cancelAnimationFrame(autoFrame)
    if (autoResumeTimer) window.clearTimeout(autoResumeTimer)
    autoFrame = 0
    autoResumeTimer = 0
  }

  const startAutoSpin = () => {
    if (reduceMotion || autoFrame || isDragging || momentumFrame) return
    let previousTime = performance.now()
    const tick = (currentTime) => {
      if (isDragging || momentumFrame) {
        autoFrame = 0
        return
      }
      const elapsed = Math.min(currentTime - previousTime, 50)
      previousTime = currentTime
      framePosition += (elapsed / 1000) * frameRate * autoDirection
      render()
      autoFrame = requestAnimationFrame(tick)
    }
    autoFrame = requestAnimationFrame(tick)
  }

  const scheduleAutoSpin = () => {
    if (reduceMotion) return
    if (autoResumeTimer) window.clearTimeout(autoResumeTimer)
    autoResumeTimer = window.setTimeout(() => {
      autoResumeTimer = 0
      startAutoSpin()
    }, autoResumeDelayMs)
  }

  const startMomentum = () => {
    cancelMomentum()
    velocity = Math.max(-maxMomentumVelocity, Math.min(maxMomentumVelocity, velocity))
    if (reduceMotion || Math.abs(velocity) < stopVelocity) {
      velocity = 0
      scheduleAutoSpin()
      return
    }

    let previousTime = performance.now()
    const tick = (currentTime) => {
      const elapsed = Math.min(currentTime - previousTime, 32)
      previousTime = currentTime
      framePosition += velocity * elapsed
      velocity *= Math.exp(-decayPerMs * elapsed)
      render()

      if (Math.abs(velocity) >= stopVelocity) {
        momentumFrame = requestAnimationFrame(tick)
      } else {
        velocity = 0
        momentumFrame = 0
        scheduleAutoSpin()
      }
    }
    momentumFrame = requestAnimationFrame(tick)
  }

  const beginDrag = (clientX) => {
    pauseAutoSpin()
    cancelMomentum()
    velocity = 0
    isDragging = true
    startX = clientX
    startFramePosition = framePosition
    lastDragPosition = framePosition
    lastDragTime = performance.now()
    rotator.classList.add('is-dragging')
  }

  const updateDrag = (clientX) => {
    if (!isDragging) return
    const now = performance.now()
    const nextPosition = startFramePosition + (clientX - startX) * framesPerPixel * dragDirection
    const elapsed = Math.max(now - lastDragTime, 1)
    const instantVelocity = (nextPosition - lastDragPosition) / elapsed
    velocity = velocity * 0.48 + instantVelocity * 0.52
    framePosition = nextPosition
    lastDragPosition = nextPosition
    lastDragTime = now
    render()
  }

  const endDrag = () => {
    if (!isDragging) return
    isDragging = false
    rotator.classList.remove('is-dragging')
    if (performance.now() - lastDragTime > 80) velocity = 0
    startMomentum()
  }

  rotator.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    beginDrag(event.clientX)
    rotator.setPointerCapture(event.pointerId)
  })
  rotator.addEventListener('pointermove', (event) => updateDrag(event.clientX))

  const stopPointerDrag = (event) => {
    endDrag()
    if (rotator.hasPointerCapture(event.pointerId)) rotator.releasePointerCapture(event.pointerId)
  }

  rotator.addEventListener('pointerup', stopPointerDrag)
  rotator.addEventListener('pointercancel', stopPointerDrag)
  rotator.addEventListener('lostpointercapture', endDrag)

  rotator.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    pauseAutoSpin()
    cancelMomentum()
    velocity = 0
    framePosition += event.key === 'ArrowLeft' ? -1 : 1
    render()
    scheduleAutoSpin()
  })

  startAutoSpin()
}

document.querySelectorAll('[data-spin-viewer]').forEach(hydrateSpinViewer)

const backFab = document.querySelector('.back-fab')
const projectHero = document.querySelector('.project-hero')

if (backFab) {
  if (!projectHero) {
    backFab.classList.add('is-dark')
  } else {
    const updateBackFabTone = () => {
      const heroBottom = projectHero.getBoundingClientRect().bottom
      backFab.classList.toggle('is-dark', heroBottom <= 72)
    }

    updateBackFabTone()
    window.addEventListener('scroll', updateBackFabTone, { passive: true })
    window.addEventListener('resize', updateBackFabTone)
  }
}

const autoplayVideos = document.querySelectorAll('video[autoplay]')
if (autoplayVideos.length > 0) {
  const playAllVideos = () => {
    for (const video of autoplayVideos) {
      video.muted = true
      video.defaultMuted = true
      video.loop = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      video.controls = false
      const started = video.play()
      if (started && typeof started.catch === 'function') started.catch(() => {})
    }
  }

  playAllVideos()
  window.addEventListener('pageshow', playAllVideos)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) playAllVideos()
  })
  window.addEventListener('touchstart', playAllVideos, { passive: true })
  window.addEventListener('pointerdown', playAllVideos, { passive: true })
}

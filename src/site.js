const frame = document.getElementById('asciiFrame')
const colorToggle = document.getElementById('heroColorToggle')
const colorButtons = colorToggle ? [...colorToggle.querySelectorAll('[data-channel]')] : []
let selectedChannel = 'rgb'
let asciiFrameReady = false
let asciiKickInterval = null

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

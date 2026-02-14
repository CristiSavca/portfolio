const frame = document.getElementById('asciiFrame')
const colorToggle = document.getElementById('heroColorToggle')
const colorButtons = colorToggle ? [...colorToggle.querySelectorAll('[data-channel]')] : []
let selectedChannel = 'rgb'

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
  frame.addEventListener('load', () => {
    syncColorMode()
    postToAscii({ type: 'ascii:refresh' })
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

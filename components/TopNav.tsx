import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"

interface NavLink {
  label: string
  href: string
}

interface TopNavOptions {
  links?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Methodology", href: "/Methodology" },
  { label: "Brain Sharing", href: "/Brain-Sharing" },
  { label: "BugForge", href: "/BugForge" },
  { label: "Hackthebox", href: "/Hackthebox" },
  { label: "HackingHub", href: "/HackingHub" },
  { label: "Pwnedlabs", href: "/Pwnedlabs" },
]

export default ((opts?: TopNavOptions) => {
  const links = opts?.links ?? defaultLinks

  const TopNav: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
    const currentSlug = "/" + (fileData.slug === "index" ? "" : fileData.slug ?? "")

    return (
      <nav class={`top-nav ${displayClass ?? ""}`}>
        <div class="top-nav-links">
          {links.map((link) => {
            const isActive = currentSlug === link.href ||
              (link.href !== "/" && currentSlug.startsWith(link.href))
            return (
              <a href={link.href} class={`top-nav-link ${isActive ? "active" : ""}`}>
                {link.label}
              </a>
            )
          })}
        </div>
        <div class="top-nav-right">
          <button class="top-nav-search" id="top-nav-search-btn" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button class="top-nav-hamburger" id="top-nav-hamburger" aria-label="Menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
        <div class="mobile-menu" id="mobile-menu">
          {links.map((link) => {
            const isActive = currentSlug === link.href ||
              (link.href !== "/" && currentSlug.startsWith(link.href))
            return (
              <a href={link.href} class={`mobile-menu-link ${isActive ? "active" : ""}`}>
                {link.label}
              </a>
            )
          })}
        </div>
      </nav>
    )
  }

  TopNav.css = `
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(13, 13, 13, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px dashed var(--border-dashed, rgba(255,255,255,0.15));
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
}

.top-nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.top-nav-link {
  color: var(--darkgray, #e8e6e3);
  text-decoration: none !important;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: color 150ms ease;
  background: none !important;
  padding: 0 !important;
  padding-bottom: 4px !important;
  position: relative;
}

.top-nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.3);
  transition: width 0.3s ease;
}

.top-nav-link:hover { color: var(--dark, #fff) !important; }
.top-nav-link:hover::after { width: 100%; }

.top-nav-link.active { color: var(--dark, #fff) !important; }
.top-nav-link.active::after {
  width: 100%;
  border-bottom-color: rgba(255, 255, 255, 0.5);
}

.top-nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.top-nav-search {
  background: transparent;
  border: none;
  color: var(--darkgray, #e8e6e3);
  cursor: pointer;
  padding: 0.5rem;
  transition: color 150ms ease;
}

.top-nav-search:hover { color: var(--dark, #fff); }

.top-nav-hamburger {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  gap: 4px;
  width: 28px;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--darkgray, #e8e6e3);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.top-nav-hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(5.5px) rotate(45deg);
}
.top-nav-hamburger.open .hamburger-line:nth-child(2) { opacity: 0; }
.top-nav-hamburger.open .hamburger-line:nth-child(3) {
  transform: translateY(-5.5px) rotate(-45deg);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px dashed var(--border-dashed, rgba(255,255,255,0.15));
  padding: 1rem 2rem 1.5rem;
  flex-direction: column;
  gap: 0;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu.open {
  display: flex;
  opacity: 1;
  transform: translateY(0);
}

.mobile-menu-link {
  color: var(--darkgray, #e8e6e3) !important;
  text-decoration: none !important;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 0.75rem 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
  transition: color 150ms ease;
  background: none !important;
}

.mobile-menu-link:last-child { border-bottom: none; }
.mobile-menu-link:hover { color: var(--dark, #fff) !important; }
.mobile-menu-link.active { color: var(--accent-brass, #cda54b) !important; }

@media (max-width: 768px) {
  .top-nav { padding: 0.75rem 1rem; }
  .top-nav-links { display: none; }
  .top-nav-hamburger { display: flex; }
}
`

  TopNav.afterDOMLoaded = `
// Search button
document.getElementById('top-nav-search-btn')?.addEventListener('click', () => {
  const sc = document.getElementById('search-container')
  if (sc) {
    sc.classList.add('active')
    const input = sc.querySelector('input')
    if (input) input.focus()
  }
})

// Hamburger
const hamburger = document.getElementById('top-nav-hamburger')
const mobileMenu = document.getElementById('mobile-menu')
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open')
    mobileMenu.classList.toggle('open')
  })
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open')
      mobileMenu.classList.remove('open')
    })
  })
}

// Boot sequence (first visit only)
function initBoot() {
  if (sessionStorage.getItem('booted')) return
  sessionStorage.setItem('booted', '1')

  const overlay = document.createElement('div')
  overlay.className = 'boot-overlay'
  const container = document.createElement('div')
  container.className = 'boot-lines'
  overlay.appendChild(container)
  document.body.appendChild(overlay)

  const lines = [
    { text: 'BIOS v4.2.0 -- POST check', delay: 0 },
    { text: 'Memory: 32768 MB ................ <span class="ok">[OK]</span>', delay: 150 },
    { text: 'CPU: Apple Silicon M-series ..... <span class="ok">[OK]</span>', delay: 250 },
    { text: 'Loading kernel modules .......... <span class="ok">[OK]</span>', delay: 400 },
    { text: 'Mounting /dev/brain ............. <span class="ok">[OK]</span>', delay: 550 },
    { text: 'Starting offensive toolkit ...... <span class="ok">[OK]</span>', delay: 700 },
    { text: 'Initializing pentest-env ........ <span class="ok">[OK]</span>', delay: 850 },
    { text: '<span class="dim">root@kali</span>:~$ <span class="ok">ready</span>', delay: 1000 },
  ]

  lines.forEach(function(line) {
    const el = document.createElement('div')
    el.className = 'boot-line'
    el.innerHTML = line.text
    container.appendChild(el)
    setTimeout(function() { el.classList.add('show') }, line.delay)
  })

  setTimeout(function() {
    overlay.classList.add('done')
    setTimeout(function() { overlay.remove() }, 500)
  }, 1600)
}
initBoot()

// Page wipe element
function ensureWipe() {
  if (!document.querySelector('.page-wipe')) {
    const wipe = document.createElement('div')
    wipe.className = 'page-wipe'
    document.body.appendChild(wipe)
  }
}
ensureWipe()

// Terminal typewriter
function initTypewriter() {
  const el = document.getElementById('terminal-text')
  if (!el) return

  const commands = [
    'nmap -sC -sV target',
    'phantom detect bac',
    'GPEN // Penetration Tester',
    'sqlmap --batch --dbs',
    'GCFA // Forensic Analyst',
    'burp-go send POST /api/auth',
    'GSEC // Security Essentials',
    'ffuf -w wordlist -u FUZZ',
    'GCIA // Intrusion Analyst',
  ]

  let cmdIdx = 0
  let charIdx = 0
  let deleting = false
  let pauseTimer = null

  function tick() {
    const current = commands[cmdIdx]
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1)
      charIdx++
      if (charIdx >= current.length) {
        deleting = true
        pauseTimer = setTimeout(tick, 2000)
        return
      }
      pauseTimer = setTimeout(tick, 60 + Math.random() * 40)
    } else {
      el.textContent = current.substring(0, charIdx)
      charIdx--
      if (charIdx < 0) {
        deleting = false
        charIdx = 0
        cmdIdx = (cmdIdx + 1) % commands.length
        pauseTimer = setTimeout(tick, 400)
        return
      }
      pauseTimer = setTimeout(tick, 30)
    }
  }

  tick()
  window.addCleanup?.(() => clearTimeout(pauseTimer))
}
initTypewriter()

// Matrix rain -- green, slow, fading
function initMatrix() {
  const canvas = document.getElementById('particle-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let animId, lastTime = 0
  const frameInterval = 80
  const katakana = '\u30A0\u30A1\u30A2\u30A3\u30A4\u30A5\u30A6\u30A7\u30A8\u30A9\u30AA\u30AB\u30AC\u30AD\u30AE\u30AF'
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nums = '0123456789'
  const symbols = ':.<>{}[]|/='
  const chars = katakana + latin + nums + symbols
  const fontSize = 14
  let columns, streams

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    columns = Math.floor(canvas.width / fontSize)
    if (!streams || streams.length !== columns) {
      streams = []
      for (let i = 0; i < columns; i++) {
        streams.push({
          y: Math.random() * -100,
          speed: 0.3 + Math.random() * 0.4,
          length: 8 + Math.floor(Math.random() * 16),
          chars: [],
          active: Math.random() > 0.3,
          respawnDelay: Math.floor(Math.random() * 60),
          wait: 0,
        })
        for (let j = 0; j < streams[i].length; j++) {
          streams[i].chars.push(chars[Math.floor(Math.random() * chars.length)])
        }
      }
    }
  }
  resize()

  function draw(timestamp) {
    animId = requestAnimationFrame(draw)
    if (timestamp - lastTime < frameInterval) return
    lastTime = timestamp

    ctx.fillStyle = 'rgba(10, 10, 10, 0.12)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = fontSize + 'px monospace'

    for (let i = 0; i < columns; i++) {
      const s = streams[i]

      if (!s.active) {
        s.wait++
        if (s.wait > s.respawnDelay) {
          s.active = true
          s.y = Math.random() * -20
          s.speed = 0.3 + Math.random() * 0.4
          s.wait = 0
        }
        continue
      }

      const x = i * fontSize

      for (let j = 0; j < s.length; j++) {
        const charY = (s.y - j) * fontSize
        if (charY < 0 || charY > canvas.height) continue

        if (Math.random() < 0.03) {
          s.chars[j] = chars[Math.floor(Math.random() * chars.length)]
        }

        const fade = 1 - (j / s.length)

        if (j === 0) {
          ctx.fillStyle = 'rgba(180, 255, 180, ' + (0.9 * fade) + ')'
          ctx.shadowColor = '#00ff41'
          ctx.shadowBlur = 8
        } else if (j < 3) {
          ctx.fillStyle = 'rgba(0, 255, 65, ' + (0.7 * fade) + ')'
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = 'rgba(0, 180, 40, ' + (0.5 * fade) + ')'
          ctx.shadowBlur = 0
        }

        ctx.fillText(s.chars[j], x, charY)
      }
      ctx.shadowBlur = 0

      s.y += s.speed

      if ((s.y - s.length) * fontSize > canvas.height) {
        s.active = false
        s.respawnDelay = 20 + Math.floor(Math.random() * 80)
        s.wait = 0
        s.length = 8 + Math.floor(Math.random() * 16)
        s.chars = []
        for (let j = 0; j < s.length; j++) {
          s.chars.push(chars[Math.floor(Math.random() * chars.length)])
        }
      }
    }
  }
  animId = requestAnimationFrame(draw)

  const ro = new ResizeObserver(resize)
  ro.observe(canvas.parentElement)

  window.addCleanup?.(() => {
    cancelAnimationFrame(animId)
    ro.disconnect()
  })
}
initMatrix()

// Cursor trail
function initCursorTrail() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if ('ontouchstart' in window) return

  const dotCount = 8
  const dots = []

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    dot.style.width = (6 - i * 0.5) + 'px'
    dot.style.height = (6 - i * 0.5) + 'px'
    dot.style.opacity = '0'
    document.body.appendChild(dot)
    dots.push({ el: dot, x: 0, y: 0 })
  }

  let mouseX = 0, mouseY = 0, trailAnimId

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  function animateTrail() {
    dots[0].x += (mouseX - dots[0].x) * 0.3
    dots[0].y += (mouseY - dots[0].y) * 0.3

    for (let i = 1; i < dotCount; i++) {
      dots[i].x += (dots[i - 1].x - dots[i].x) * 0.2
      dots[i].y += (dots[i - 1].y - dots[i].y) * 0.2
    }

    for (let i = 0; i < dotCount; i++) {
      dots[i].el.style.left = dots[i].x + 'px'
      dots[i].el.style.top = dots[i].y + 'px'
      dots[i].el.style.opacity = String(0.5 - i * 0.06)
    }

    trailAnimId = requestAnimationFrame(animateTrail)
  }
  animateTrail()

  window.addCleanup?.(() => {
    cancelAnimationFrame(trailAnimId)
    dots.forEach(d => d.el.remove())
  })
}
initCursorTrail()

// 3D tilt on cards
function initTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if ('ontouchstart' in window) return

  const sel = '.cert-card, .home-card'
  document.querySelectorAll(sel).forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-2px)'
    })
    card.addEventListener('mouseleave', function() {
      card.style.transform = ''
    })
  })
}
initTiltCards()

// Code block typing animation
function initCodeTyping() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const pres = document.querySelectorAll('pre')
  if (pres.length === 0) return

  const codeObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return
      codeObs.unobserve(e.target)
      const code = e.target.querySelector('code')
      if (!code || code.dataset.typed) return
      code.dataset.typed = '1'

      const fullText = code.textContent || ''
      if (fullText.length > 500 || fullText.length < 5) return

      const wrapper = document.createElement('span')
      wrapper.className = 'code-typed'
      wrapper.textContent = ''
      code.textContent = ''
      code.appendChild(wrapper)

      let idx = 0
      function typeChar() {
        if (idx < fullText.length) {
          wrapper.textContent = fullText.substring(0, idx + 1)
          idx++
          setTimeout(typeChar, 8 + Math.random() * 4)
        } else {
          wrapper.className = ''
          wrapper.style.borderRight = 'none'
        }
      }
      typeChar()
    })
  }, { threshold: 0.3 })

  pres.forEach(function(p) { codeObs.observe(p) })
}
initCodeTyping()

// Progress bar animation
function initProgressBars() {
  const fills = document.querySelectorAll('.progress-fill')
  if (fills.length === 0) return
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const target = e.target.getAttribute('data-width')
        if (target) e.target.style.width = target
        obs.unobserve(e.target)
      }
    })
  }, { threshold: 0.3 })
  fills.forEach((f) => obs.observe(f))
}
initProgressBars()

// Copy feedback
function initCopyFeedback() {
  document.querySelectorAll('.clipboard-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('pre')
      if (pre) {
        pre.classList.add('copy-flash')
        btn.classList.add('copied')
        btn.textContent = '\\u2713'
        setTimeout(() => {
          pre.classList.remove('copy-flash')
          btn.classList.remove('copied')
          btn.textContent = 'Copy'
        }, 1500)
      }
    })
  })
}
initCopyFeedback()

// Scroll-reveal observer
function observeRevealElements() {
  const sel = '.cert-card, .section-li, .machine-card, h2, pre, .stats-header, .home-card, .featured-card, .progress-item'
  const els = document.querySelectorAll(sel)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })
  els.forEach((el) => {
    if (!el.classList.contains('reveal')) el.classList.add('reveal')
    observer.observe(el)
  })

  const hrs = document.querySelectorAll('hr')
  const hrObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        hrObs.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })
  hrs.forEach((hr) => hrObs.observe(hr))

  const statVals = document.querySelectorAll('.stat-value')
  if (statVals.length === 0) return
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const el = e.target
      const target = parseInt(el.textContent, 10)
      if (isNaN(target)) return
      statObs.unobserve(el)
      let current = 0
      const step = Math.max(1, Math.ceil(target / 20))
      const interval = setInterval(() => {
        current = Math.min(current + step, target)
        el.textContent = String(current)
        if (current >= target) clearInterval(interval)
      }, 30)
    })
  }, { threshold: 0.5 })
  statVals.forEach((el) => statObs.observe(el))
}
observeRevealElements()

// SPA page transitions with wipe
document.addEventListener('prenav', () => {
  const wipe = document.querySelector('.page-wipe')
  const center = document.querySelector('.center')
  if (center) center.style.opacity = '0'
  if (wipe) {
    wipe.classList.remove('wipe-out')
    wipe.classList.add('wipe-in')
  }
})

document.addEventListener('nav', () => {
  observeRevealElements()
  initTypewriter()
  initMatrix()
  initProgressBars()
  initCopyFeedback()
  initTiltCards()
  initCodeTyping()
  ensureWipe()

  const wipe = document.querySelector('.page-wipe')
  const center = document.querySelector('.center')

  if (wipe) {
    wipe.classList.remove('wipe-in')
    wipe.classList.add('wipe-out')
    setTimeout(() => wipe.classList.remove('wipe-out'), 350)
  }

  if (center) {
    center.style.opacity = ''
    center.classList.add('page-enter')
    setTimeout(() => center.classList.remove('page-enter'), 300)
  }

  const h = document.getElementById('top-nav-hamburger')
  const m = document.getElementById('mobile-menu')
  if (h) h.classList.remove('open')
  if (m) m.classList.remove('open')
})
`

  return TopNav
}) satisfies QuartzComponentConstructor

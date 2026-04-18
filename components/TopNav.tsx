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

// Terminal typewriter
function initTypewriter() {
  const el = document.getElementById('terminal-text')
  if (!el) return

  const commands = [
    'phantom detect bac --dir engagements/target',
    'nmap -sC -sV 10.10.10.x',
    'burp-go send POST /api/auth',
    'sqlmap --batch --dbs',
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
        pauseTimer = setTimeout(tick, 2500)
        return
      }
      pauseTimer = setTimeout(tick, 55 + Math.random() * 35)
    } else {
      el.textContent = current.substring(0, charIdx)
      charIdx--
      if (charIdx < 0) {
        deleting = false
        charIdx = 0
        cmdIdx = (cmdIdx + 1) % commands.length
        pauseTimer = setTimeout(tick, 500)
        return
      }
      pauseTimer = setTimeout(tick, 25)
    }
  }

  tick()
  window.addCleanup?.(() => clearTimeout(pauseTimer))
}
initTypewriter()

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

// Clean SPA page transitions (fade only)
document.addEventListener('prenav', () => {
  const center = document.querySelector('.center')
  if (center) {
    center.style.opacity = '0'
    center.style.transform = 'translateY(6px)'
  }
})

document.addEventListener('nav', () => {
  observeRevealElements()
  initTypewriter()
  initProgressBars()
  initCopyFeedback()

  const center = document.querySelector('.center')
  if (center) {
    center.style.opacity = ''
    center.style.transform = ''
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

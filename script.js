// Auritan Landing Page Scripts: 2W12 Dice App, Modals, Cookie Banner & Lead Capture
// Powered by BAALPHEMOR GAMING (baalphemor-gaming.de / www.baalphemor.de)

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. INTERAKTIVE WÜRFEL-APP: 2W12 VS. VERTEIDIGUNG 8, 12, 14
  // ========================================================
  const rollBtn = document.getElementById('roll-action-btn')
  const die1Box = document.getElementById('die-1')
  const die2Box = document.getElementById('die-2')
  const die1Val = document.getElementById('die-1-val')
  const die2Val = document.getElementById('die-2-val')
  const totalVal = document.getElementById('dice-total-val')

  const outcome8 = document.getElementById('outcome-8')
  const outcome12 = document.getElementById('outcome-12')
  const outcome14 = document.getElementById('outcome-14')

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
  }

  // Auritan Regel-Auswertung für einen spezifischen Verteidigungswert
  function evaluateDefense(sum, vt, isCrit, isFumble) {
    const hit = sum >= vt
    const margin = sum - vt
    // Auritan-Kanon: EG_THRESHOLD = 4 (Pro volle 4 Punkte Differenz +1 EG)
    const eg = hit ? Math.floor(Math.max(0, margin) / 4) : 0

    let statusText = hit ? '✅ Probe Gelingt' : '❌ Abgewehrt'
    let statusClass = hit ? 'is-hit' : 'is-miss'

    let hint = ''
    if (isFumble) {
      statusText = '☠️ Patzer'
      statusClass = 'is-miss'
      hint = 'Dramatischer Fehlschlag (Doppel-1)!'
    } else if (isCrit) {
      statusText = '💥 Kritischer Erfolg'
      statusClass = 'is-hit'
      hint = 'Epischer Volltreffer (Doppel-12)! Maximale Wirkung.'
    } else if (hit) {
      if (eg >= 2) hint = '⚔️ Verheerender Durchschlag (+2 EG Bonusschaden)!'
      else if (eg === 1) hint = '⚔️ Starker Treffer (+1 EG Zusatzwirkung)'
      else hint = '🗡️ Regulärer Treffer (volle Grundwirkung)'
    } else {
      if (margin >= -2) hint = '🛡️ Knappe Parade des Verteidigers'
      else hint = '🛡️ Klinge gleitet wirkungslos an Panzerung ab'
    }

    const marginDisplay = margin >= 0 ? `+${margin}` : `${margin}`

    return `
      <div class="outcome-status ${statusClass}">${statusText}</div>
      <div class="outcome-margin">Wurf <strong>${sum}</strong> vs VT ${vt} (Differenz: ${marginDisplay})</div>
      <div class="outcome-eg">
        <span class="eg-number">${hit ? (eg > 0 ? '+' + eg : '0') : '0'}</span>
        <span class="eg-text">Erfolgsgrad${eg === 1 ? '' : 'e'} (EG)</span>
      </div>
      <div class="outcome-hint">${hint}</div>
    `
  }

  function runDiceRoll() {
    if (!rollBtn) return

    // Buttons sperren während des Würfelns
    rollBtn.disabled = true
    die1Box.classList.add('is-rolling')
    die2Box.classList.add('is-rolling')

    // Würfel-App Taumel-Animation: Zufallszahlen flackern
    let rollInterval = setInterval(() => {
      die1Val.textContent = rollDie(12)
      die2Val.textContent = rollDie(12)
    }, 60)

    setTimeout(() => {
      clearInterval(rollInterval)

      // Endgültige Würfelwürfe
      const d1 = rollDie(12)
      const d2 = rollDie(12)
      const sum = d1 + d2
      const isCrit = (d1 === 12 && d2 === 12)
      const isFumble = (d1 === 1 && d2 === 1)

      die1Val.textContent = d1
      die2Val.textContent = d2
      totalVal.textContent = sum

      die1Box.classList.remove('is-rolling')
      die2Box.classList.remove('is-rolling')

      // Auswertung gegen die 3 Verteidigungswerte (8, 12, 14)
      if (outcome8) outcome8.innerHTML = evaluateDefense(sum, 8, isCrit, isFumble)
      if (outcome12) outcome12.innerHTML = evaluateDefense(sum, 12, isCrit, isFumble)
      if (outcome14) outcome14.innerHTML = evaluateDefense(sum, 14, isCrit, isFumble)

      rollBtn.disabled = false
    }, 600)
  }

  if (rollBtn) {
    rollBtn.addEventListener('click', runDiceRoll)
  }

  // ========================================================
  // 2. LEAD-FORMULAR (2 OPTIONEN & JANUAR 2027 HINWEIS)
  // ========================================================
  const signupForm = document.getElementById('signup-form')
  const emailInput = document.getElementById('email-input')
  const optNewsletter = document.getElementById('opt-newsletter')
  const optTester = document.getElementById('opt-tester')
  const feedback = document.getElementById('lead-feedback')

  if (signupForm && emailInput && feedback) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const email = emailInput.value.trim()
      if (!email) return

      const wantsNewsletter = optNewsletter ? optNewsletter.checked : true
      const wantsTester = optTester ? optTester.checked : true

      const interests = []
      if (wantsNewsletter) interests.push('Newsletter (Auritan-Depesche)')
      if (wantsTester) interests.push('Interesse als Tester (Frühe Alpha ab 2027)')

      try {
        const raw = localStorage.getItem('auritan_newsletter_leads')
        const leads = raw ? JSON.parse(raw) : []
        leads.push({
          email,
          interests,
          wantsNewsletter,
          wantsTester,
          timestamp: new Date().toISOString(),
          source: 'auritan.de pre-launch',
        })
        localStorage.setItem('auritan_newsletter_leads', JSON.stringify(leads))
      } catch (err) {
        console.warn('LocalStorage nicht beschreibbar:', err)
      }

      let optionsListText = interests.length > 0 ? interests.join(' & ') : 'Allgemeines Interesse'

      feedback.innerHTML = `⚔️ <strong>Vormerkung erfolgreich:</strong> Deine Adresse (<em>${email}</em>) ist eingetragen für: <strong>${optionsListText}</strong>.<br>Mit einer frühen Alpha ist ab <strong>2027</strong> zu rechnen. Du wirst rechtzeitig benachrichtigt!`
      feedback.className = 'lead-feedback is-success'
      feedback.style.display = 'block'
      emailInput.value = ''
    })
  }

  // ========================================================
  // 3. MOBILE MENU DRAWER
  // ========================================================
  const mobileBtn = document.getElementById('mobile-menu-btn')
  const mobileDrawer = document.getElementById('mobile-drawer')

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('is-open')
    })

    mobileDrawer.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open')
      })
    })
  }

  // ========================================================
  // 4. MODALS (IMPRESSUM, DATENSCHUTZ, DISCLAIMER, WIKI)
  // ========================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (!modal) return
    modal.classList.add('is-open')
    document.body.style.overflow = 'hidden'
  }

  function closeModal(modal) {
    if (!modal) return
    modal.classList.remove('is-open')
    if (!document.querySelector('.modal-overlay.is-open')) {
      document.body.style.overflow = ''
    }
  }

  document.querySelectorAll('.modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = trigger.getAttribute('data-modal')
      if (targetId) openModal(targetId)
    })
  })

  document.querySelectorAll('.open-privacy-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      openModal('modal-datenschutz')
    })
  })

  const wikiTriggers = [
    document.getElementById('nav-wiki-btn'),
    document.getElementById('mobile-wiki-btn'),
    document.getElementById('wiki-teaser-btn'),
    ...document.querySelectorAll('.open-wiki-modal-link')
  ]

  wikiTriggers.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        openModal('modal-wiki-notice')
      })
    }
  })

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal))
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })

    const actionBtn = modal.querySelector('.modal-action-btn')
    if (actionBtn) {
      actionBtn.addEventListener('click', () => {
        closeModal(modal)
      })
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(modal => {
        closeModal(modal)
      })
    }
  })

  // ========================================================
  // 5. DSGVO COOKIE-CONSENT BANNER
  // ========================================================
  const cookieBanner = document.getElementById('cookie-banner')
  const btnAcceptNecessary = document.getElementById('cookie-necessary-btn')
  const btnAcceptAll = document.getElementById('cookie-accept-all-btn')
  const btnOpenCookieSettings = document.getElementById('open-cookie-settings-btn')

  function getStoredConsent() {
    try {
      const stored = localStorage.getItem('auritan_cookie_consent')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  function saveConsent(level) {
    try {
      const consentData = {
        level: level,
        timestamp: new Date().toISOString(),
        version: '1.1'
      }
      localStorage.setItem('auritan_cookie_consent', JSON.stringify(consentData))
    } catch (e) {
      console.warn('Cookie Consent Fehler:', e)
    }
    if (cookieBanner) {
      cookieBanner.style.display = 'none'
    }
  }

  const existingConsent = getStoredConsent()
  if (!existingConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.style.display = 'block'
    }, 600)
  }

  if (btnAcceptNecessary) {
    btnAcceptNecessary.addEventListener('click', () => saveConsent('necessary'))
  }

  if (btnAcceptAll) {
    btnAcceptAll.addEventListener('click', () => saveConsent('all'))
  }

  if (btnOpenCookieSettings && cookieBanner) {
    btnOpenCookieSettings.addEventListener('click', (e) => {
      e.preventDefault()
      cookieBanner.style.display = 'block'
      cookieBanner.scrollIntoView({ behavior: 'smooth' })
    })
  }

})

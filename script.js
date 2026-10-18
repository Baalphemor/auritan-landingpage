// Auritan Landing Page Scripts: 2W12 Dice Simulator & Newsletter Lead Capture

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Interaktiver 2W12 vs 1W20 Simulator ---
  const btn2w12 = document.getElementById('roll-2w12-btn')
  const btn1w20 = document.getElementById('roll-1w20-btn')
  const card2w12 = document.getElementById('result-card-2w12')
  const card1w20 = document.getElementById('result-card-1w20')
  const val2w12 = document.getElementById('val-2w12')
  const val1w20 = document.getElementById('val-1w20')
  const detail2w12 = document.getElementById('detail-2w12')
  const detail1w20 = document.getElementById('detail-1w20')
  const insightBox = document.getElementById('simulator-insight')

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1
  }

  if (btn2w12 && val2w12) {
    btn2w12.addEventListener('click', () => {
      const d1 = rollDie(12)
      const d2 = rollDie(12)
      const sum = d1 + d2

      card2w12.classList.add('is-active')
      card1w20.classList.remove('is-active')

      val2w12.textContent = sum

      let rating = 'Solider Treffer im Mittelfeld'
      if (sum === 24) rating = '💥 Epischer Kritischer Erfolg (Chance 0,7 %)'
      else if (sum === 2) rating = '☠️ Dramatischer Patzer (Chance 0,7 %)'
      else if (sum >= 18) rating = '⚔️ Überlegener Erfolg'
      else if (sum <= 6) rating = '⚠️ Schwacher Wurf'

      detail2w12.innerHTML = `Gewürfelt: [${d1}] + [${d2}] = <strong>${sum}</strong><br><span style="color: #ffd700;">${rating}</span>`
      insightBox.innerHTML = `🎯 <strong>2W12-Ergebnis: ${sum}</strong> — Beachte: Bei 2W12 ist die 13 der wahrscheinlichste Wurf (~8,3 %). Werte zwischen 10 und 16 decken über 55 % aller Würfe ab. Taktik und Flankenboni machen den echten Unterschied!`
    })
  }

  if (btn1w20 && val1w20) {
    btn1w20.addEventListener('click', () => {
      const d = rollDie(20)

      card1w20.classList.add('is-active')
      card2w12.classList.remove('is-active')

      val1w20.textContent = d

      let rating = '5 % Wahrscheinlichkeit (Reiner Zufall)'
      if (d === 20) rating = 'Natürliche 20 (5 % Chance)'
      else if (d === 1) rating = 'Natürliche 1 (5 % Chance)'

      detail1w20.innerHTML = `Gewürfelt: [${d}]<br><span style="color: #ff8787;">${rating}</span>`
      insightBox.innerHTML = `🎲 <strong>1W20-Ergebnis: ${d}</strong> — Jede Zahl von 1 bis 20 hat exakt 5 % Chance. Ein genialer Plan wird genauso oft durch eine 1 zerstört wie durch eine 20 gerettet. Pure Willkür.`
    })
  }

  // --- 2. Newsletter Lead Capture ---
  const signupForm = document.getElementById('signup-form')
  const emailInput = document.getElementById('email-input')
  const feedback = document.getElementById('lead-feedback')

  if (signupForm && emailInput) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const email = emailInput.value.trim()
      if (!email) return

      try {
        const raw = localStorage.getItem('auritan_newsletter_leads')
        const leads = raw ? JSON.parse(raw) : []
        leads.push({
          email,
          timestamp: new Date().toISOString(),
          source: 'landingpage',
        })
        localStorage.setItem('auritan_newsletter_leads', JSON.stringify(leads))
      } catch (err) {
        console.warn('LocalStorage error:', err)
      }

      feedback.innerHTML = `✅ <strong>Hervorragend!</strong> Deine E-Mail (${email}) ist als Alpha-Pionier vorgemerkt. Die nächste Balurea-Depesche erreicht dich am Sonntag um 18:00 Uhr!`
      feedback.className = 'lead-feedback is-success'
      emailInput.value = ''
    })
  }

})

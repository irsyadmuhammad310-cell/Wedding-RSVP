(() => {
  // ============================================================
  // ⚠️ REPLACE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
  // ============================================================
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7pp5zKP0-UL8X-3tCIWytM5loDb7MpTPBKhROROKIEm1WUqyI3Cfc0nhNxa68UlT6/exec';
  // ============================================================

  // Countdown
  function updateCountdown() {
    const wedding = new Date('2026-10-18T11:00:00+08:00');
    const now = new Date();
    const diff = wedding - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<div style="font-size:0.85rem;color:var(--sage);font-weight:600">Today is the day! 🎉</div>';
      return;
    }

    document.getElementById('cdDays').textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('cdHours').textContent = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById('cdMins').textContent = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  }

  updateCountdown();
  setInterval(updateCountdown, 60000);

  // Form state
  let attending = null;
  let guestCount = 1;
  let dietary = 'none';

  const nameIn = document.getElementById('guestName');
  const phoneIn = document.getElementById('guestPhone');
  const relationIn = document.getElementById('guestRelation');
  const msgIn = document.getElementById('guestMsg');
  const submitBtn = document.getElementById('submitBtn');

  // Attending toggle
  document.querySelectorAll('input[name="attending"]').forEach(r => {
    r.onchange = () => {
      attending = r.value;
      document.getElementById('guestCountField').style.display = attending === 'yes' ? 'block' : 'none';
      document.getElementById('dietField').style.display = attending === 'yes' ? 'block' : 'none';
      validateForm();
    };
  });

  // Stepper
  document.getElementById('stepDown').onclick = () => {
    if (guestCount > 1) {
      guestCount--;
      document.getElementById('stepVal').textContent = guestCount;
    }
  };

  document.getElementById('stepUp').onclick = () => {
    if (guestCount < 10) {
      guestCount++;
      document.getElementById('stepVal').textContent = guestCount;
    }
  };

  // Diet
  document.querySelectorAll('.diet-pill').forEach(p => {
    p.onclick = () => {
      document.querySelectorAll('.diet-pill').forEach(x => x.classList.remove('selected'));
      p.classList.add('selected');
      dietary = p.dataset.val;
    };
  });

  // Validate
  function validateForm() {
    submitBtn.disabled = !(nameIn.value.trim() && attending);
  }

  nameIn.oninput = validateForm;

  // Submit
  submitBtn.onclick = async () => {
    const data = {
      name: nameIn.value.trim(),
      phone: phoneIn.value.trim(),
      relation: relationIn.value,
      attending: attending === 'yes' ? 'Yes' : 'No',
      guests: attending === 'yes' ? guestCount : 0,
      dietary: attending === 'yes' ? dietary : 'N/A',
      message: msgIn.value.trim(),
      timestamp: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
    };

    // Show loading
    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('loadingState').classList.add('show');
    document.getElementById('errorMsg').classList.remove('show');

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // no-cors always returns opaque response, so we assume success
      document.getElementById('loadingState').classList.remove('show');
      document.getElementById('successState').classList.add('show');
      document.getElementById('successMsg').textContent =
        attending === 'yes'
          ? `Your RSVP for ${guestCount} guest${guestCount > 1 ? 's' : ''} has been recorded. We look forward to celebrating with you! 🎉`
          : 'We understand and appreciate you letting us know. You will be missed! 💛';
    } catch (err) {
      document.getElementById('loadingState').classList.remove('show');
      document.getElementById('rsvpForm').style.display = 'block';
      const errEl = document.getElementById('errorMsg');
      errEl.textContent = 'Failed to submit. Please check your internet connection and try again.';
      errEl.classList.add('show');
    }
  };
})();

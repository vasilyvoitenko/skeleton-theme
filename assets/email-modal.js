// Email modal for fake checkout
(function() {
  // Вставляем HTML модали, если её нет
  if (!document.getElementById('fake-checkout-modal')) {
    var modalHtml = `
      <div id="fake-checkout-modal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); align-items:center; justify-content:center;">
        <form id="fake-checkout-form" style="background:#fff; padding:2.5rem 2rem 2rem 2rem; border-radius:1.2rem; max-width:400px; margin:auto; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.25); position:relative; min-width:320px;">
          <button type="button" id="fake-checkout-close" style="position:absolute; top:1rem; right:1rem; background:none; border:none; font-size:1.7rem; color:#888; cursor:pointer;">&times;</button>
          <h2 style="font-size:1.4rem; font-weight:900; margin-bottom:1.5rem; color:#18182f;">Zadejte svůj email</h2>
          <input type="email" id="fake-checkout-email" required placeholder="Email" style="margin:1rem 0 1.5rem 0; padding:0.8rem 1rem; width:90%; border:1.5px solid #dadada; border-radius:8px; font-size:1.1rem; color:#18182f; background:#f7f7fa; outline:none; transition:border 0.2s;" onfocus="this.style.borderColor='#7c3aed'" onblur="this.style.borderColor='#dadada'">
          <button type="submit" style="padding:0.7rem 2.5rem; background:#7c3aed; color:#fff; border:none; border-radius:8px; font-weight:900; font-size:1.1rem; letter-spacing:0.03em; margin-top:0.5rem; cursor:pointer; transition:background 0.2s;">Odeslat</button>
          <div id="fake-checkout-message" style="margin-top:1.5rem; display:none; font-weight:700; font-size:1.1rem; border-radius:8px; padding:1em; box-shadow:0 2px 12px rgba(124,58,237,0.10); background:#7c3aed; color:#fff; transition:opacity 0.3s; text-align:center;"></div>
        </form>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  window.showEmailForm = function() {
    document.getElementById('fake-checkout-modal').style.display = 'flex';
  };

  document.getElementById('fake-checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('fake-checkout-email').value;
    var messageDiv = document.getElementById('fake-checkout-message');
    messageDiv.style.opacity = 0;
    messageDiv.style.display = 'none';
    var formData = new FormData();
    formData.append('form_type', 'customer');
    formData.append('contact[email]', email);
    fetch('/contact', {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(text => {
      if (text.includes('Thank you') || text.includes('Děkujeme')) {
        messageDiv.textContent = 'Děkujeme! Očekávejte naši odpověď.';
        messageDiv.style.background = '#7c3aed';
        messageDiv.style.color = '#fff';
        messageDiv.style.display = 'block';
        setTimeout(function(){ messageDiv.style.opacity = 1; }, 10);
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'newsletter_signup', { event_category: 'newsletter', event_label: 'Modal signup' });
        }
        setTimeout(function() {
          messageDiv.style.opacity = 0;
          setTimeout(function(){
            messageDiv.style.display = 'none';
            document.getElementById('fake-checkout-modal').style.display = 'none';
            document.getElementById('fake-checkout-email').value = '';
          }, 300);
        }, 2500);
      } else {
        messageDiv.textContent = 'Chyba: Email se nepodařilo uložit. Zkuste to prosím znovu.';
        messageDiv.style.background = '#ef4444';
        messageDiv.style.color = '#fff';
        messageDiv.style.display = 'block';
        setTimeout(function(){ messageDiv.style.opacity = 1; }, 10);
        setTimeout(function() {
          messageDiv.style.opacity = 0;
          setTimeout(function(){
            messageDiv.style.display = 'none';
          }, 300);
        }, 2500);
      }
    })
    .catch(() => {
      messageDiv.textContent = 'Chyba: Email se nepodařilo uložit. Zkuste to prosím znovu.';
      messageDiv.style.background = '#ef4444';
      messageDiv.style.color = '#fff';
      messageDiv.style.display = 'block';
      setTimeout(function(){ messageDiv.style.opacity = 1; }, 10);
      setTimeout(function() {
        messageDiv.style.opacity = 0;
        setTimeout(function(){
          messageDiv.style.display = 'none';
        }, 300);
      }, 2500);
    });
  });

  document.getElementById('fake-checkout-close').addEventListener('click', function() {
    document.getElementById('fake-checkout-modal').style.display = 'none';
  });
})(); 
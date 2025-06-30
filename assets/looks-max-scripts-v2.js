// Looks Max Store - Complete JavaScript Functionality

console.log('[LM] Скрипт looks-max-scripts.js загружен');

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[LM] DOMContentLoaded старт');
    // Initialize all functionality
    initAddToCart();
    initSmoothScrolling();
    // initMobileMenu();
    // initSearchFunctionality();
    initCartCounter();
    // initProductHovers();
    // initLazyLoading();
    console.log('[LM] Перед вызовом createMiniCart');
    if (typeof createMiniCart === 'function') {
      console.log('[LM] createMiniCart определена, вызываю...');
    } else {
      console.log('[LM] createMiniCart НЕ определена');
    }
    createMiniCart();
    console.log('[LM] После вызова createMiniCart');
});

console.log('[LM] После объявления DOMContentLoaded');

// Add to Cart Functionality with real Shopify integration
function initAddToCart() {
    console.log('Initializing add to cart functionality...');
    document.querySelectorAll('.add-to-cart-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('.add-to-cart-btn');
            if (!btn) return;
            const originalText = btn.textContent;
            const originalClasses = btn.className;
            btn.textContent = 'ADDING...';
            btn.className = btn.className.replace('bg-white text-black', 'bg-yellow-500 text-white');
            btn.disabled = true;
            const variantId = form.querySelector('input[name="id"]').value;
            // Для карточек: количество может быть в qty-input или hidden-qty-input
            let quantity = 1;
            const qtyInput = form.closest('.product-card')?.querySelector('.qty-input') || form.querySelector('.qty-input') || form.querySelector('input[name="quantity"]');
            if (qtyInput) quantity = parseInt(qtyInput.value) || 1;
            // Add to Shopify cart via AJAX
            fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: variantId,
                    quantity: quantity
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status) {
                    // Error occurred
                    console.error('Error adding to cart:', data.description);
                    btn.textContent = 'ERROR';
                    btn.className = btn.className.replace('bg-yellow-500 text-white', 'bg-red-500 text-white');
                } else {
                    // Success
                    btn.textContent = 'ADDED!';
                    btn.className = btn.className.replace('bg-yellow-500 text-white', 'bg-green-500 text-white');
                    updateCartCounter();
                    if (typeof window.updateMiniCart === 'function') window.updateMiniCart();
                    if (typeof window.showMiniCartModal === 'function') window.showMiniCartModal();
                    btn.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        btn.style.transform = 'scale(1)';
                    }, 150);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                btn.textContent = 'ERROR';
                btn.className = btn.className.replace('bg-yellow-500 text-white', 'bg-red-500 text-white');
            })
            .finally(() => {
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.className = originalClasses;
                    btn.disabled = false;
                }, 2000);
            });
        });
    });
}

// Update cart counter dynamically
function updateCartCounter() {
    console.log('Updating cart counter...');
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            console.log('Cart data:', cart);
            const cartCounter = document.querySelector('a[href*="/cart"] span');
            if (cartCounter) {
                console.log('Updating cart counter from', cartCounter.textContent, 'to', cart.item_count);
                cartCounter.textContent = cart.item_count;
                
                // Add animation
                cartCounter.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartCounter.style.transform = 'scale(1)';
                }, 200);
            } else {
                console.log('Cart counter element not found');
            }
        })
        .catch(error => console.error('Error updating cart counter:', error));
}

// Initialize cart counter on page load
function initCartCounter() {
    updateCartCounter();
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function createMiniCart() {
  console.log('[LM] Вошли в функцию createMiniCart');
  if (!document.getElementById('mini-cart-btn')) {
    const btn = document.createElement('button');
    btn.id = 'mini-cart-btn';
    btn.style.position = 'fixed';
    btn.style.bottom = '32px';
    btn.style.right = '32px';
    btn.style.zIndex = '9999';
    btn.style.background = '#2a2a4a';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.width = '64px';
    btn.style.height = '64px';
    btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
    btn.style.display = 'flex';
    btn.style.flexDirection = 'column';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '18px';
    btn.innerHTML = '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"/></svg><span id="mini-cart-count" style="font-size:14px; margin-top:2px;">0</span>';
    btn.onclick = showMiniCartModal;
    document.body.appendChild(btn);
    console.log('[LM] Кнопка мини-корзины добавлена в DOM');
  } else {
    console.log('[LM] Кнопка мини-корзины уже есть в DOM');
  }
  updateMiniCart();
}

function updateMiniCart() {
  console.log('[LM] Вошли в функцию updateMiniCart');
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      document.getElementById('mini-cart-count').textContent = cart.item_count;
      console.log('[LM] Мини-корзина обновлена, товаров:', cart.item_count);
    });
}

function showMiniCartModal() {
  console.log('[LM] Вошли в функцию showMiniCartModal');
  fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
      let modal = document.getElementById('mini-cart-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mini-cart-modal';
        modal.style.position = 'fixed';
        modal.style.right = '32px';
        modal.style.bottom = '110px';
        modal.style.background = '#18182f';
        modal.style.color = '#fff';
        modal.style.padding = '2rem';
        modal.style.borderRadius = '1rem';
        modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
        modal.style.zIndex = '10000';
        modal.style.minWidth = '320px';
        modal.style.maxWidth = '90vw';
        modal.style.maxHeight = '60vh';
        modal.style.overflowY = 'auto';
        modal.innerHTML = '';
        document.body.appendChild(modal);
        console.log('[LM] Модальное окно мини-корзины добавлено в DOM');
      }
      let html = `<h3 style="font-size:1.3rem; font-weight:900; margin-bottom:1rem;">Váš košík</h3>`;
      if (cart.items.length === 0) {
        html += '<div style="color:#aaa;">Košík je prázdný</div>';
      } else {
        html += '<ul style="list-style:none; padding:0; margin:0;">';
        cart.items.forEach(item => {
          html += `<li style="margin-bottom:1rem; display:flex; align-items:center;">
            <img src="${item.image}" alt="${item.title}" style="width:48px; height:48px; object-fit:contain; border-radius:8px; margin-right:1rem; background:#222;">
            <div style="flex:1;">
              <div style="font-weight:700;">${item.product_title}</div>
              <div style="font-size:0.95em; color:#aaa;">x${item.quantity} — ${(item.final_line_price/100).toFixed(2)} €</div>
            </div>
          </li>`;
        });
        html += '</ul>';
        html += `<div style="margin-top:1rem; font-weight:900; font-size:1.1em;">Celkem: ${(cart.total_price/100).toFixed(2)} €</div>`;
        html += `<button id="mini-cart-checkout-btn" style="margin-top:1.5rem; width:100%; background:#fff; color:#18182f; font-weight:900; font-size:1.1em; border:none; border-radius:8px; padding:0.8em 0; cursor:pointer;">Pokračovat</button>`;
      }
      html += `<button onclick="document.getElementById('mini-cart-modal').remove()" style="position:absolute; top:0.5em; right:0.7em; background:none; border:none; color:#fff; font-size:1.5em; cursor:pointer;">&times;</button>`;
      modal.innerHTML = html;
      modal.style.display = 'block';
      document.getElementById('mini-cart-checkout-btn')?.addEventListener('click', function() {
        console.log('[LM] Клик по кнопке Pokračovat');
        document.getElementById('mini-cart-modal').remove();
        if (typeof window.showEmailForm === 'function') {
          console.log('[LM] showEmailForm определена, вызываю...');
          window.showEmailForm();
        } else {
          console.log('[LM] showEmailForm НЕ определена');
        }
      });
    });
}

window.createMiniCart = createMiniCart;
window.updateMiniCart = updateMiniCart;
window.showMiniCartModal = showMiniCartModal; 
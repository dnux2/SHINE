document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-price');
    
    function renderCart() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>سلة التسوق فارغة</p>';
            subtotalElement.textContent = '0 ر.س';
            totalElement.textContent = '0 ر.س';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.price} ر.س</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        subtotalElement.textContent = `${subtotal} ر.س`;
        totalElement.textContent = `${subtotal} ر.س`;
    }
    
    function updateCart(updatedCart) {
        cart = updatedCart;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount(); // هذه الدالة من الملف الرئيسي
    }
    
    // أحداث الزيادة والنقصان
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('minus')) {
            const id = e.target.dataset.id;
            const updatedCart = cart.map(item => 
                item.id === id ? {...item, quantity: Math.max(1, item.quantity - 1)} : item
            );
            updateCart(updatedCart);
        }
        
        if (e.target.classList.contains('plus')) {
            const id = e.target.dataset.id;
            const updatedCart = cart.map(item => 
                item.id === id ? {...item, quantity: item.quantity + 1} : item
            );
            updateCart(updatedCart);
        }
        
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const id = e.target.dataset.id || e.target.closest('.remove-btn').dataset.id;
            const updatedCart = cart.filter(item => item.id !== id);
            updateCart(updatedCart);
        }
    });
    
    renderCart();
});


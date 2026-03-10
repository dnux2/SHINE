document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            faqItem.classList.toggle('active');
            
            faqQuestions.forEach(q => {
                if (q !== question && q.parentElement.classList.contains('active')) {
                    q.parentElement.classList.remove('active');
                }
            });
        });
    });

    // Form validation for registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            alert('Registration successful!');
            window.location.href = 'index.html';
        });
    }

    // Form validation for login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            alert('Login successful!');
            window.location.href = 'index.html';
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            alert(`Thank you for subscribing with ${emailInput.value}!`);
            emailInput.value = '';
        });
    }
});

class ShoppingCart {
    constructor() {
        this.VAT_RATE = 0.15;
        this.cart = JSON.parse(localStorage.getItem('shine-cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        if (this.isCartPage()) this.renderCartPage();
        this.setupEventListeners();
    }

    isCartPage() {
        return window.location.pathname.includes('cart.html');
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    }

    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        existingItem ? existingItem.quantity++ : this.cart.push({...product, quantity: 1});
        this.saveCart();
        this.showNotification(`${product.name} added to cart`);
    }

    updateItemQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
        }
    }

    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed');
    }

    saveCart() {
        localStorage.setItem('shine-cart', JSON.stringify(this.cart));
        this.updateCartCount();
        if (this.isCartPage()) this.renderCartPage();
    }

    renderCartPage() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummaryContainer = document.querySelector('.cart-summary');
        
        if (!cartItemsContainer || !cartSummaryContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = this.getEmptyCartHTML();
            cartSummaryContainer.innerHTML = this.getSummaryHTML(0);
            return;
        }
        
        let subtotal = 0;
        cartItemsContainer.innerHTML = this.cart.map(item => {
            subtotal += item.price * item.quantity;
            return this.createCartItemHTML(item);
        }).join('');
        
        cartSummaryContainer.innerHTML = this.getSummaryHTML(subtotal);
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${item.color ? `<p class="item-color">${item.color}</p>` : ''}
                    <p class="item-price">${item.price.toFixed(2)} SAR</p>
                    <div class="item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    getEmptyCartHTML() {
        return `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-bag"></i>
                <h3>Your shopping bag is empty</h3>
                <p>Start shopping to add items to your bag</p>
                <a href="index.html" class="shop-now-btn">SHOP NOW</a>
            </div>
        `;
    }

    getSummaryHTML(subtotal) {
        const vat = subtotal * this.VAT_RATE;
        const total = subtotal + vat;
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        return `
            <h2>ORDER SUMMARY</h2>
            <div class="summary-details">
                <div class="summary-row">
                    <span>Subtotal (${itemCount} items)</span>
                    <span>${subtotal.toFixed(2)} SAR</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span class="free">FREE</span>
                </div>
                <div class="summary-row">
                    <span>VAT (15%)</span>
                    <span>${vat.toFixed(2)} SAR</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)} SAR</span>
                </div>
            </div>
            <button class="checkout-btn" ${this.cart.length ? '' : 'disabled'}>
                PROCEED TO CHECKOUT
            </button>
            <p class="continue-shopping">
                <a href="index.html"><i class="fas fa-arrow-left"></i> Continue Shopping</a>
            </p>
            <div class="payment-methods">
                <p>We accept:</p>
                <div class="payment-icons">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-amex"></i>
                    <i class="fab fa-cc-paypal"></i>
                </div>
            </div>
        `;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>${message}</span>
            <a href="cart.html">View Cart</a>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addItem({
                        id: parseInt(productCard.dataset.id, 10),
                        name: productCard.querySelector('h3').textContent,
                        price: parseFloat(productCard.querySelector('.price').textContent.replace(/[^0-9.]/g, '')),
                        image: productCard.querySelector('img').src,
                        color: productCard.querySelector('.item-color')?.textContent.replace('Color: ', '') || ''
                    });
                }
            }
        });

        // Cart interactions (Fixed Event Listener)
        document.addEventListener('click', (e) => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            
            if (!cartItem) return;
            
            const productId = parseInt(cartItem.dataset.id, 10);
            
            if (target.closest('.remove-item') || target.closest('.fa-trash')) {
                this.removeItem(productId);
            }
            else if (target.classList.contains('minus')) {
                const item = this.cart.find(item => item.id === productId);
                if (item) this.updateItemQuantity(productId, item.quantity - 1);
            }
            else if (target.classList.contains('plus')) {
                const item = this.cart.find(item => item.id === productId);
                if (item) this.updateItemQuantity(productId, item.quantity + 1);
            }
        });
    }
}

// Initialize cart
window.shoppingCart = new ShoppingCart();
//ادمن
document.addEventListener('DOMContentLoaded', function() {
    // بيانات الطلبات المثالبة
    const orders = [
        {
            id: 'SH1001',
            customer: 'Sarah Johnson',
            date: 'Today, 10:30 AM',
            amount: '94 SAR',
            status: 'completed'
        },
        {
            id: 'SH1002',
            customer: 'Michael Brown',
            date: 'Today, 09:15 AM',
            amount: '131 SAR',
            status: 'completed'
        },
        {
            id: 'SH1003',
            customer: 'Emily Davis',
            date: 'Yesterday',
            amount: '172 SAR',
            status: 'pending'
        },
        {
            id: 'SH1004',
            customer: 'Robert Wilson',
            date: 'Yesterday',
            amount: '75 SAR',
            status: 'completed'
        }
    ];

    // عرض الطلبات في القسم
    const ordersList = document.querySelector('.orders-list');
    
    if (ordersList) {
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            orderItem.innerHTML = `
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p>${order.customer} • ${order.date}</p>
                </div>
                <div class="order-amount">
                    <strong>${order.amount}</strong>
                </div>
                <div class="order-status status-${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
            `;
            
            ordersList.appendChild(orderItem);
        });
    }

    // تحديث الإحصائيات تلقائياً (مثال)
    function updateStats() {
        const statCards = document.querySelectorAll('.stat-card p');
        if (statCards.length >= 3) {
            // زيادة عشوائية للإحصائيات كمثال
            statCards[0].textContent = Math.floor(Math.random() * 10) + 20;
            statCards[1].textContent = Math.floor(Math.random() * 500) + 5000 + ' SAR';
            statCards[2].textContent = Math.floor(Math.random() * 5) + 5;
        }
    }
    
    // تحديث كل 10 ثواني (لأغراض العرض فقط)
    setInterval(updateStats, 10000);
});
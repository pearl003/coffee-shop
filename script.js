let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    let item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCount();
    saveCart();
}

function updateCartCount() {
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").innerText = count;
}

function viewCart() {
    let cartModal = document.getElementById("cart-modal");
    let cartItems = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} x ${item.quantity} - ¥${item.price * item.quantity}
            <button onclick="removeFromCart(${index})">❌</button>`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    totalPrice.innerText = total;
    cartModal.style.display = "block";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    saveCart();
    viewCart();
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

function checkout() {
    if (cart.length === 0) {
        alert("购物车为空！");
        return;
    }
    alert("订单提交成功！感谢您的购买！");
    cart = [];
    updateCartCount();
    saveCart();
    closeCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 初始化购物车数量
updateCartCount();
function openCart() {
    let cartModal = document.getElementById("cart-modal");
    cartModal.style.display = "block";
    cartModal.style.opacity = 0;
    setTimeout(() => {
        cartModal.style.opacity = 1;
    }, 10);
}

function closeCart() {
    let cartModal = document.getElementById("cart-modal");
    cartModal.style.opacity = 0;
    setTimeout(() => {
        cartModal.style.display = "none";
    }, 300);
}

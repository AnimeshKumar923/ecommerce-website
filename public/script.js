document.addEventListener('DOMContentLoaded', () => {
  // Update cart count in the header
  function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = `(${cart.length})`;
    }
}

  updateCartCount();

  // Load products on the home page
  if (document.getElementById('product-list')) {
      fetch('/api/products')
          .then(response => response.json())
          .then(products => {
              const productContainer = document.getElementById('product-list');
              products.forEach(product => {
                  const productElement = document.createElement('div');
                  productElement.innerHTML = `
                      <h2>${product.name}</h2>
                      <p>${product.description}</p>
                      <p>Price: Rs. ${product.price}</p>
                      <a href="product.html?id=${product.id}">View Product</a>
                  `;
                  productContainer.appendChild(productElement);
              });
          });
  }

  // Load the specific product details
  if (document.getElementById('product-details')) {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get('id');

      fetch(`/api/products/${productId}`)
          .then(response => response.json())
          .then(product => {
              const productDetailsContainer = document.getElementById('product-details');
              productDetailsContainer.innerHTML = `
                  <h2>${product.name}</h2>
                  <p>${product.description}</p>
                  <p>Price: $${product.price}</p>
                  <button id="add-to-cart">Add to Cart</button>
              `;

              document.getElementById('add-to-cart').addEventListener('click', () => {
                  addToCart(product.id);
                  updateCartCount();
              });
          });
  }

  // Add to cart functionality
  function addToCart(productId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart');
  }

  // Load cart items
  if (document.getElementById('cart-items')) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length > 0) {
        cart.forEach(productId => {
            fetch(`/api/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.innerHTML = `
                        <h2>${product.name}</h2>
                        <p>Price: $${product.price}</p>
                        <button class="remove-from-cart" data-id="${product.id}">Remove</button>
                    `;
                    cartItemsContainer.appendChild(cartItemElement);
                })
                .catch(error => console.error('Error fetching product:', error));
        });

        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart')) {
                const productIdToRemove = e.target.getAttribute('data-id');
                removeFromCart(productIdToRemove);
                e.target.parentElement.remove();
                updateCartCount();
            }
        });
    } else {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
}

  // Load checkout items
if (document.getElementById('checkout-items')) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const checkoutItemsContainer = document.getElementById('checkout-items');

  if (cart.length > 0) {
      let total = 0;

      cart.forEach(productId => {
          fetch(`/api/products/${productId}`)
              .then(response => response.json())
              .then(product => {
                  total += product.price;
                  const checkoutItemElement = document.createElement('div');
                  checkoutItemElement.innerHTML = `
                      <h2>${product.name}</h2>
                      <p>Price: $${product.price}</p>
                  `;
                  checkoutItemsContainer.appendChild(checkoutItemElement);
              });
      });

      const totalElement = document.createElement('div');
      totalElement.innerHTML = `<h3>Total: $${total}</h3>`;
      checkoutItemsContainer.appendChild(totalElement);

  } else {
      checkoutItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  }
}

});

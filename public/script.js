document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-list')) {
      // Load products on the home page
      fetch('/api/products')
          .then(response => response.json())
          .then(products => {
              const productContainer = document.getElementById('product-list');
              products.forEach(product => {
                  const productElement = document.createElement('div');
                  productElement.innerHTML = `
                      <h2>${product.name}</h2>
                      <p>${product.description}</p>
                      <p>Price: $${product.price}</p>
                      <a href="product.html?id=${product.id}">View Product</a>
                  `;
                  productContainer.appendChild(productElement);
              });
          });
  }

  if (document.getElementById('product-details')) {
      // Load the specific product details based on the ID from the URL
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

              // Add to cart functionality
              document.getElementById('add-to-cart').addEventListener('click', () => {
                  addToCart(product.id);
              });
          });
  }

  // Cart functionality
  function addToCart(productId) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(productId);
      localStorage.setItem('cart', JSON.stringify(cart));
      alert('Product added to cart');
  }

  if (document.getElementById('cart-items')) {
      // Load cart items from localStorage
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
                  });
          });

          // Remove item from cart functionality
          cartItemsContainer.addEventListener('click', (e) => {
              if (e.target.classList.contains('remove-from-cart')) {
                  const productIdToRemove = e.target.getAttribute('data-id');
                  removeFromCart(productIdToRemove);
                  e.target.parentElement.remove();
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
});

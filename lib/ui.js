import { formatPrice } from './helpers.js';


function deleteLineFromCart(event) {
  event.preventDefault();
  console.log('Eyða!', event.submitter)
  const lineToDelete = event.submitter.closest('tr')
  console.log(lineToDelete)

  lineToDelete.parentElement.removeChild(lineToDelete)

  const cartTableBodyElement = document.querySelector('.cart table tbody');
  const isCartEmpty = cartTableBodyElement.children.length === 0;
  showCartContent(!isCartEmpty);
  updateCartTotal();
}

export function updateCartTotal() {
  const cartItems = document.querySelectorAll('.cart table tbody tr');
  let total = 0;

  cartItems.forEach((item) => {
    const quantity = parseInt(item.querySelector('.quantity').textContent, 10);
    const price = parseFloat(item.querySelector('.price').textContent.replace(/[^\d.-]/g, ''));
    total += quantity * price;
  });

  const totalElement = document.querySelector('.cart tfoot .price');
  if (totalElement) {
    totalElement.textContent = formatPrice(total); // Assuming formatPrice is a function you've written
  }
}

export function createCartLine(product, quantity) {
  // TODO útfæra þannig að búin sé til lína í körfu á forminu:

  /*
  <tr data-cart-product-id="1">
    <td>HTML húfa</td>
    <td>1</td>
    <td><span class="price">5.000 kr.-</span></td>
    <td><span class="price">5.000 kr.-</span></td>
    <td>
      <form class="remove" method="post">
        <button>Eyða</button>
      </form>
    </td>
  </tr>
  */

  const cartLineElement = document.createElement('tr');
  cartLineElement.dataset.cartProductId = product.id.toString();

  const titleElement = document.createElement('td');
  titleElement.textContent = product.title;
  cartLineElement.appendChild(titleElement);

  var quantityElement = document.createElement('td');

  var quantityElement = document.createElement('td');
  quantityElement.textContent = quantity.toString();
  quantityElement.classList.add('quantity'); 
  cartLineElement.appendChild(quantityElement);

  const priceElement = document.createElement('td');
  const priceSpanElement = document.createElement('span');
  priceSpanElement.classList.add('price'); 
  priceSpanElement.textContent = formatPrice(product.price);
  priceElement.appendChild(priceSpanElement); 
  cartLineElement.appendChild(priceElement);
  
  const totalElement = document.createElement('td');
  const totalPriceSpanElement = document.createElement('span'); 
  totalPriceSpanElement.classList.add('price');
  totalPriceSpanElement.classList.add('total-price'); 
  totalPriceSpanElement.textContent = formatPrice(product.price * quantity);
  totalElement.appendChild(totalPriceSpanElement); 
  cartLineElement.appendChild(totalElement);
  
  const formTdElement = document.createElement('td');

  const formElement = document.createElement('form');
  formElement.addEventListener('submit', deleteLineFromCart);
  
  const buttonElement = document.createElement('button');
  buttonElement.textContent = 'Eyða';

  formElement.appendChild(buttonElement);
  formTdElement.appendChild(formElement);
  cartLineElement.appendChild(formTdElement)

   
  // TODO hér þarf að búa til eventListener sem leyfir að eyða línu úr körfu

  return cartLineElement;
}

/**
 * Sýna efni körfu eða ekki.
 * @param {boolean} show Sýna körfu eða ekki
 */
export function showCartContent(show = true) {
  // Finnum element sem inniheldur körfuna
  const cartElement = document.querySelector('.cart');

  if (!cartElement) {
    console.warn('fann ekki .cart');
    return;
  }

  const emptyMessage = cartElement.querySelector('.empty-message');
  const cartContent = cartElement.querySelector('.cart-content');

  if (!emptyMessage || !cartContent) {
    console.warn('fann ekki element');
    return;
  }

  if (show) {
    emptyMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
  } else {
    emptyMessage.classList.remove('hidden');
    cartContent.classList.add('hidden');
  }
}

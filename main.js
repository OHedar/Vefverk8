import { createCartLine, showCartContent } from './lib/ui.js';
import { formatPrice } from './lib/helpers.js';

const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
];

/** Bæta vöru í körfu */

function addProductToCart(product, quantity) {


  const cartTableBodyElement = document.querySelector('.cart table tbody');



  if (!cartTableBodyElement) {
    console.warn('fann ekki .cart');
    return;
  }
  
  // TODO hér þarf að athuga hvort lína fyrir vöru na sé þegar til
  let cartItem = cartTableBodyElement.querySelector(`[data-cart-product-id="${product.id}"]`);
  if (!cartItem) {
    const newCartItem = createCartLine(product, quantity);
    cartTableBodyElement.appendChild(newCartItem);
  } else {
    const quantityDisplay = cartItem.querySelector('.quantity');
    const totalDisplay = cartItem.querySelector('.total-price'); 
    if (quantityDisplay) {
      let newQuantity = parseInt(quantityDisplay.textContent, 10) + parseInt(quantity, 10);
      quantityDisplay.textContent = newQuantity;
      if (totalDisplay) {
        totalDisplay.textContent = formatPrice(newQuantity * product.price); 
      }
    }
  }
  updateCartTotal();
  const isCartEmpty = cartTableBodyElement.children.length === 0;
  showCartContent(!isCartEmpty);
  // Sýna efni körfu
  showCartContent(true);
}

function updateCartTotal() {
  const cartTableBodyElement = document.querySelector('.cart table tbody');
  let total = 0;

  cartTableBodyElement.querySelectorAll('tr').forEach(row => {
    const quantityElement = row.querySelector('.quantity');
    const totalElement = row.querySelector('.total-price');
    const price = parseFloat(totalElement.textContent.replace(/[^0-9]/g, ''));
    const quantity = parseInt(quantityElement.textContent, 10);
    total += price * quantity;
  });

  const footerTotalElement = document.querySelector('.cart table tfoot .price');
  if (footerTotalElement) {
    footerTotalElement.textContent = formatPrice(total); 
  }
  showCartContent(true);
}

function submitHandler(event) {
  // Komum í veg fyrir að form submiti
  event.preventDefault();
  
  // Finnum næsta element sem er `<tr>`
  const parent = event.target.closest('tr');

  // Það er með attribute sem tiltekur auðkenni vöru, t.d. `data-product-id="1"`
  const productId = Number.parseInt(parent.dataset.productId);

  // Finnum vöru með þessu productId
  const product = products.find((i) => i.id === productId);

  if (!product){
    return;
  }

  // TODO hér þarf að finna fjölda sem á að bæta við körfu með því að athuga
  // á input
  const quantityInput = parent.querySelector('.quantity-input');;

  let quantity = parseInt(quantityInput.value, 10);
  quantity = !isNaN(quantity) && quantity > 0 ? quantity : 1;
  // Bætum vöru í körfu (hér væri gott að bæta við athugun á því að varan sé til)
  addProductToCart(product, quantity);
}

// Finna öll form með class="add"
const addToCartForms = document.querySelectorAll('.add')

// Ítra í gegnum þau sem fylki (`querySelectorAll` skilar NodeList)
for (const form of Array.from(addToCartForms)) {
  // Bæta submit event listener við hvert
  form.addEventListener('submit', submitHandler);
}

document.querySelectorAll('.cart .remove').forEach(form => {
  form.addEventListener('submit', deleteLineFromCart);
});
// TODO bæta við event handler á form sem submittar pöntun


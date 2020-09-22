// @ts-check
const stripe = Stripe(window.gb.stripe.publishable);
const {origin} = window.location;
const priceElements = document.querySelectorAll('input[name="prices"]');
const customAmountWrapper = document.getElementById('slider-value');
const customAmountTrigger = document.getElementById('price-other');
const customAmountVisual = document.getElementById('coffee-count');
const customAmountInput = document.getElementById("coffee-slider");
const donateForm = document.getElementById('donate');

customAmountInput.addEventListener('input', () => {
	customAmountVisual.textContent = `$${customAmountInput.value}`;
});

Array.prototype.forEach.call(priceElements, price => {
	price.addEventListener('input', syncSliderState);
});

donateForm.addEventListener('submit', event => {
	event.preventDefault();
	let quantity = Array.prototype.find.call(priceElements, element => element.checked).value;
	if (quantity === 'other') {
		quantity = customAmountInput.value;
	}

	quantity = Number(quantity);
	console.log(new URL('/thank-you?session_id={CHECKOUT_SESSION_ID}', origin).href);
	console.log(new URL('/donate', origin).href);

	// Make the call to Stripe.js to redirect to the checkout page with the current quantity
	stripe.redirectToCheckout({
		mode: 'payment',
		lineItems: [{price: window.gb.stripe.donate, quantity: quantity}],
		successUrl: new URL('/thank-you?session_id={CHECKOUT_SESSION_ID}', origin).href,
		cancelUrl: new URL('/donate', origin).href
	});
});

function syncSliderState() {
	if (customAmountTrigger.checked) {
		customAmountVisual.textContent = '$10';
		customAmountInput.value = 10;
		customAmountWrapper.classList.remove("hide");
	} else {
		customAmountWrapper.classList.add("hide");
	}
}

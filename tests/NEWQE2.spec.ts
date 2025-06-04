import { test, expect, request } from '@playwright/test';
import { customAlphabet } from 'nanoid';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const customNanoid = customAlphabet(alphabet, 3);
console.log(customNanoid());
const randomNumber = Math.floor(100 + Math.random() * 900);
const randomUsername1 = customNanoid() + randomNumber;
const pw = 'Password123';
const firstName = 'John';
const lastName = 'Doe';
const address1 = 'Hacana 319';
const city1 = "Manila";
const postalcode1 = '1680';  

test('test', async ({ page }) => {
  
  test.setTimeout(60000);
  //Navigate to site (1)
  await page.goto('https://demo.spreecommerce.org/');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(2000)
  //Register a new user(2)
  await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).waitFor({ state: 'visible' });
  await expect(page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2)).toBeVisible();
  await expect(page).toHaveURL('https://demo.spreecommerce.org/');
  await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).click();
  await expect(page).toHaveURL('https://demo.spreecommerce.org/');
 // await page.locator('a[href="/user/sign_up"]').waitFor({ state: 'visible' });
  await expect(page.locator('a[href="/user/sign_up"]')).toBeVisible();
  await page.locator('a[href="/user/sign_up"]').click();
  await expect(page.locator('input[name="user[password_confirmation]"]')).toBeVisible();
  await page.fill('input[name="user[email]"]', randomUsername1 + '@gmail.com');
  await page.fill('input[name="user[password]"]', pw);
  await page.fill('input[name="user[password_confirmation]"]', pw);
  await page.locator('input[type="submit"][name="commit"][value="Sign Up"]').click();
  await expect(page).toHaveURL('https://demo.spreecommerce.org/');
  await expect(page.locator('p.flash-message')).toHaveText(/Welcome! You have signed up successfully\./i);

  //Logged in to Logout(2)

  await expect(page.locator('a[href="/account"]').first()).toBeVisible();
  await page.locator('a[href="/account"]').first().click();
  await expect(page).toHaveURL('https://demo.spreecommerce.org/account/orders');
  await page.getByRole('button', { name: 'Log out' }).click();

  //Log in with recent user
  await expect(page).toHaveURL('https://demo.spreecommerce.org/');
  await expect(page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2)).toBeVisible();
  await page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2).click();
  await page.fill('input[name="user[email]"]', randomUsername1 + '@gmail.com');
  await page.fill('input[name="user[password]"]', pw);
  await page.locator('input[type="submit"][name="commit"][value="Login"]').click();
  await expect(page).toHaveURL('https://demo.spreecommerce.org/');

  //Browse a product and open detail page (4)

await page.getByLabel('Top').getByRole('link', { name: 'Shop All' }).click();
await expect(page).toHaveURL('https://demo.spreecommerce.org/products');
const rippedTShirtTitle = page.locator('h3.line-clamp-1.product-card-title', { hasText: 'Ripped T-Shirt' });
await expect(rippedTShirtTitle).toBeVisible();
await rippedTShirtTitle.click();

// Add product to cart with specific options(5)

const rippedTShirtHeading = page.locator('h1.text-2xl.uppercase.tracking-tight.mb-4.mt-2.font-medium');
const rippedTShirtText = await rippedTShirtHeading.textContent();
console.log('Ripped T-Shirt heading text:', rippedTShirtText);

const secondColorOption = page.locator('ul.flex.items-center.flex-wrap.gap-1 > li').nth(1);
await expect(secondColorOption).toBeVisible();
await secondColorOption.click();
const colorTealSpan = page.locator('span.text-sm.leading-4.uppercase.tracking-widest', { hasText: 'Teal' });
const colorTealTextRaw = await colorTealSpan.textContent();
const colorTealText = colorTealTextRaw?.replace('Color:', '').trim();
console.log('Color span text:', colorTealText);

const sizeLegend = page.locator('legend.mr-2#option-23-value', { hasText: 'Please choose Size' });
await sizeLegend.waitFor({ state: 'visible' });
await expect(sizeLegend).toBeVisible();
await sizeLegend.click();

const sizeMLabel = page.locator('label.text-sm.cursor-pointer.flex.items-center.justify-between', { hasText: 'M' });
await expect(sizeMLabel).toBeVisible();
await sizeMLabel.click();
await sizeMLabel.click();
await page.waitForTimeout(4000);
const sizeMSpan = page.locator('span.option-value-text', { hasText: 'M' });
const sizeMText = await sizeMSpan.textContent();
console.log('Size M span text:', sizeMText);

const increaseQuantityButton = page.locator('button.increase-quantity');
await expect(increaseQuantityButton).toBeVisible();
await increaseQuantityButton.click();
await increaseQuantityButton.click();
const quantityInput = page.locator('input.quantity-input[name="quantity"]');
const quantityValue = await quantityInput.inputValue();
console.log('Quantity input value:', quantityValue);


// const rippedTShirtHeading = page.locator('h1.text-2xl.uppercase.tracking-tight.mb-4.mt-2.font-medium');
// const rippedTShirtText = await rippedTShirtHeading.textContent();
// console.log('Ripped T-Shirt heading text:', rippedTShirtText);

const addToCartButton = page.getByRole('button', { name: /add to cart/i });
await expect(addToCartButton).toBeVisible();
await addToCartButton.click();

const cartTitle = page.locator('span.text-xl.font-medium.uppercase.leading-loose', { hasText: 'Cart' });
await expect(cartTitle).toBeVisible();

const cartProductLink = page.locator('a.font-semibold.text-text[href="https://demo.spreecommerce.org/products/ripped-t-shirt"]', { hasText: 'Ripped T-Shirt' });
const cartProductText = await cartProductLink.textContent();
expect(cartProductText?.trim()).toBe(rippedTShirtText?.trim());

const tealColorDiv = page.locator('div.text-sm.px-2', { hasText: 'Teal' });
await expect(tealColorDiv).toBeVisible();
const tealColorDivText = await tealColorDiv.textContent();
expect(tealColorDivText?.trim()).toBe(colorTealText?.trim());

const sizeMDiv = page.locator('div.h-\\[30px\\].border.border-default.px-2.inline-flex.items-center.text-sm', { hasText: 'M' });
await expect(sizeMDiv).toBeVisible();
const sizeMDivText = await sizeMDiv.textContent();
expect(sizeMDivText?.trim()).toBe(sizeMText?.trim());

await page.waitForTimeout(2000);

await page.getByRole('link', { name: /checkout/i }).click();

await page.waitForTimeout(2000);

const countrySelect = page.locator('#order_ship_address_attributes_country_id');
await expect(countrySelect).toBeVisible();
await countrySelect.selectOption({ label: 'Philippines' }); // Change 'Canada' to any country you want
const selectedCountryText = await countrySelect.locator('option:checked').textContent();
console.log('Selected country:', selectedCountryText);

const firstNameInput = page.locator('#order_ship_address_attributes_firstname');
await expect(firstNameInput).toBeVisible();
await firstNameInput.click();
await firstNameInput.fill(firstName);
const enteredFirstName = await firstNameInput.inputValue();
console.log('Entered first name:', enteredFirstName);

const lastNameInput = page.locator('#order_ship_address_attributes_lastname');
await expect(lastNameInput).toBeVisible();
await lastNameInput.click();
await lastNameInput.fill(lastName);
const enteredLastName = await lastNameInput.inputValue();
console.log('Entered last name:', enteredLastName);

const addressInput = page.locator('#order_ship_address_attributes_address1');
await expect(addressInput).toBeVisible();
await addressInput.click();
await addressInput.fill(address1);
const enteredAddress = await addressInput.inputValue();
console.log('Entered address:', enteredAddress);

const cityInput = page.locator('#order_ship_address_attributes_city');
await expect(cityInput).toBeVisible();
await cityInput.click();
await cityInput.fill(city1);
const enteredCity = await cityInput.inputValue();
console.log('Entered city:', enteredCity);

// const stateSelect = page.locator('#order_ship_address_attributes_state_id');
// await expect(stateSelect).toBeVisible();
// await stateSelect.selectOption({ label: 'Armed Forces Pacific' });
// const selectedStateText = await stateSelect.locator('option:checked').textContent();
// console.log('Selected state:', selectedStateText);

const postalCodeInput = page.locator('#order_ship_address_attributes_zipcode');
await expect(postalCodeInput).toBeVisible();
await postalCodeInput.click();
await postalCodeInput.fill(postalcode1);
const enteredPostalCode = await postalCodeInput.inputValue();
console.log('Entered postal code:', enteredPostalCode);

// Click the "Save and Continue" button on the checkout address form
await page.waitForSelector('button.checkout-content-save-continue-button', { state: 'visible' });
const saveAndContinueBtn = page.locator('button.checkout-content-save-continue-button');
await expect(saveAndContinueBtn).toBeVisible();
await saveAndContinueBtn.click();
//await page.waitForTimeout(5000);

// await expect(page.locator('h5.checkout-content-header', { hasText: 'Delivery method' })).toBeVisible({ timeout: 2000 });
// Select and click the "Premium" shipping option
// Wait for the label with text "Premium" to be visible and then click it
const premiumLabel = page.locator('label[for^="shipping-rate-"]', { hasText: 'Premium' });
await premiumLabel.waitFor({ state: 'visible' });
await expect(premiumLabel).toBeVisible();
await expect(premiumLabel).toBeEnabled();
await premiumLabel.click();

// Verify the Standard shipping list item has style "pointer-events: none"
// Click the Premium shipping rate radio button
// const premiumShippingRadio = page.locator('input[type="radio"]#shipping-rate-2592');
// await expect(premiumShippingRadio).toBeVisible();
// await expect(premiumShippingRadio).toBeEnabled();
// await premiumShippingRadio.check();

// const standardListItem = page.locator('li.list-group-item[data-checkout-delivery-target="shippingRate"][style*="pointer-events: none"]', { hasText: 'Standard' });
// await expect(standardListItem).toBeVisible();

// // Click the "Save and Continue" button on the checkout shipping form
await page.waitForSelector('button.checkout-content-save-continue-button', { state: 'visible' });
await expect(saveAndContinueBtn).toBeVisible();
const isDisabled = await saveAndContinueBtn.getAttribute('disabled');
console.log('Save and Continue button disabled:', isDisabled !== null);
await expect(saveAndContinueBtn).toBeEnabled();
await saveAndContinueBtn.click();

// // Select the card number input, wait for it to be visible, and input a value
const cardNumber ='4242 4242 4242 4242';
const expiryDate = '01/30';
const cvc = '333'; 

// const cardNumberInput = page.locator('#Field-numberInput');
// await expect(cardNumberInput).toBeVisible();
// await cardNumberInput.fill(cardNumber); // Example Visa test card number
await page.waitForTimeout(3000);
// Select the card number input, wait for it to be attached and visible, then input the value
// Check if the "Add a new card" span is visible
// Wait for the payment section or Stripe element to be visible first
await page.waitForSelector('[data-checkout-stripe-target="paymentElement"]', { state: 'visible', timeout: 15000 });
const stripePaymentLink = page.locator('a.custom-control.custom-radio', { hasText: 'Stripe' });
await expect(stripePaymentLink).toBeVisible();
await expect(stripePaymentLink).toBeEnabled
// Now check for the "Add a new card" span
// const addNewCardSpan = page.locator('span.cursor-pointer', { hasText: 'Add a new card' });
// await expect(addNewCardSpan).toBeVisible({ timeout: 15000 });
const cardNumberInput = page.locator('input[name="number"]');
await expect(cardNumberInput).toBeEnabled();
await expect(cardNumberInput).toBeVisible();


// await page.waitForSelector('#Field-numberInput', { state: 'visible', timeout: 3000 });
// const cardNumberInput = page.locator('#Field-numberInput');
// await expect(cardNumberInput).toBeVisible({ timeout: 3000 });
await cardNumberInput.fill(cardNumber);

const expiryDateInput = page.locator('#Field-expiryInput');
await expect(expiryDateInput).toBeVisible();
await expiryDateInput.fill(expiryDate);

const cvcInput = page.locator('#Field-cvcInput');
await expect(cvcInput).toBeVisible();
await cvcInput.fill(cvc);

const payNowBtn = page.locator('#checkout-payment-submit');
await expect(payNowBtn).toBeVisible();
await payNowBtn.click();

const orderNumber = await page.locator('strong').textContent();
console.log('Order number:', orderNumber);
expect(orderNumber).toMatch(/^R\d+$/);

// Get the value from the <h5> element confirming the order
const confirmationMessage = await page.locator('h5.mb-3.font-semibold.pb-3.border-b.font-body').textContent();
console.log('Confirmation message:', confirmationMessage);
expect(confirmationMessage?.trim()).toBe('Your order is confirmed!');

// Get the value from the <span> element with class "badge-paid"
const paymentStatus = await page.locator('span.badge-paid').textContent();
console.log('Payment status:', paymentStatus);
expect(paymentStatus?.trim()).toBe('Paid');



});
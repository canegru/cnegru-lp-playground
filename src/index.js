// Stylesheet
import './stylesheets/global.less';
import { get } from 'lodash';

const purchaseProduct = (total) => {
  window.lpTag.sdes.push(
    {
      type: 'purchase', // MANDATORY
      total, // TOTAL VALUE OF THE TRANSACTION AFTER DISCOUNT
      currency: 'USD', // CURRENCY CODE
      orderId: 'DRV1534XC', // UNIQUE ORDER ID OR RECEIPT ID
      cart: {
        products: [
          {
            product: {
              name: 'Iphone 14', // PRODUCT NAME
              category: 'smartphones', // PRODUCT CATEGORY NAME
              sku: 'iphone14sku', // PRODUCT SKU OR UNIQUE IDENTIFIER
              price: total, // SINGLE PRODUCT PRICE
            },
            quantity: 1, // QUANTITY OF THIS PRODUCT
          },
        ],
      },
    },
  );
};

const converMp4Link = (text) => {
  console.log("converMp4Link -> text", text)
  setTimeout(() => {
    document.querySelectorAll(`[href="${text}"]`)[2].innerHTML = `
    <video width="100%" controls>
      <source src="${text}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    `;
  }, 100);
};

window.lpTag.hooks.push({
  name: 'AFTER_GET_LINES',
  callback(options) {
    options.data.lines.forEach((line) => {
      const text = get(line, 'text', '');
      if (text.includes('.mp4')) {
        converMp4Link(text);
      }
    });
  },
});


window.purchaseProduct = purchaseProduct;


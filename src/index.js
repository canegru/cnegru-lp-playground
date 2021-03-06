import 'regenerator-runtime/runtime';
// Stylesheet
import './stylesheets/global.less';
import { get } from 'lodash';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
import convInfo from './utils/convInfo';
import autoStartConversation from './plugins/autoStart';
import closeConversation from './plugins/closeConversation';

convInfo();
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

const converMp4Link = async (text) => {
  await delay(100);
  const videoDivs = document.querySelectorAll(`[href="${text}"]`);

  [].forEach.call(videoDivs, (div) => {
    div.innerHTML = `
      <video width="100%" controls>
        <source src="${text}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      `;
  });
};

/**
 * Converts Text
 * EX: Hello Bob, {tooltip text="blablabla" description="blablabla"} is great.
 * @param {*} text 
 */
const convertToolTip = async (text) => {
  await delay(100);
  const lpChatDiv = document.getElementById('lpChat');
  const allChatLines = lpChatDiv.getElementsByClassName('lpc_message__text_agent');
  const foundDiv = [...allChatLines]
    .map((d, index) => ({ value: d.innerHTML, index }))
    .find(({ value }) => value.includes(text)).index;
  const selectedDiv = allChatLines[foundDiv];
  const selectedHtml = selectedDiv.innerHTML;

  // Get index
  const firstCharacterIndex = selectedHtml.lastIndexOf('{{{');
  const lastCharacterIndex = selectedHtml.lastIndexOf('}}}');

  // Extract tooltip
  const toolTipExtract = selectedHtml.substring(firstCharacterIndex + 12, lastCharacterIndex - 1);
  console.log(toolTipExtract)
  const parsedJson = JSON.parse(JSON.parse(toolTipExtract)); // TODO: fix

  // Extract first segment and last from message
  const firstMessageExtra = selectedHtml.substring(0, firstCharacterIndex);
  const lastCharacterExtra = selectedHtml.substring(lastCharacterIndex + 3, selectedHtml.length + 2);


  const tooltipHtml = `<span class="tooltip-test">
    ${parsedJson.text}
    <span class="tooltip-description">
    ${parsedJson.description}
    </span>
  </span>`

  // Modify Div
  selectedDiv.innerHTML = `
  ${firstMessageExtra} ${tooltipHtml} ${lastCharacterExtra}
  `;

}

const addAriaLivePolite = async (text) => {
  await delay(100);
  const lpChatDiv = document.getElementById('lpChat');
  const allChatLines = lpChatDiv.getElementsByClassName('lp-json-pollock');
  [].forEach.call(allChatLines, (div) => {
    if (div.getAttribute('aria-live') !== 'polite') {
      div.setAttribute('aria-live', 'polite');
    }
  });
}

window.lpTag.hooks.push({
  name: 'AFTER_GET_LINES',
  callback(options) {
    options.data.lines.forEach((line) => {
      const text = get(line, 'text', '');
      const type = get(line, 'type', '');

      if (type === 'richContent') {
        //addAriaLivePolite(line);
      }

      // Conver video and such
      if (text.includes('.mp4')) {
        converMp4Link(text);
      } else if (text.includes('{tooltip')) {
        convertToolTip(text);
      }

    });
  },
});

// add  aria-live="polite"
window.purchaseProduct = purchaseProduct;

lpTag.taglets = { lpDragManager: () => null };

function addAccessibility(text) {
  const lpChatDiv = document.getElementById('lpChat');
  const allChatLines = lpChatDiv.getElementsByClassName('lp-json-pollock');
  console.log('hereeeee');
  [].forEach.call(allChatLines, (div) => {
    if (div.getAttribute('aria-live') !== 'polite') {
      div.setAttribute('aria-live', 'polite');
    }
  });
}


const customWidgetIfame = document.getElementsByClassName('custom-widget-iframe');
[].forEach.call(customWidgetIfame, (div) => {
  div.src = "about:blank"
});

window.lpTag.hooks.push({
  name: 'AFTER_GET_LINES',
  callback(options) {
    try {
      options.data.lines.forEach((line) => {
        if (line && line.type === 'richContent') {
          setTimeout(function test() {
            addAccessibility(line)
          }, 100);
        }
      });
    } catch (e) {
      console.error(e);
    }
  },
});

/*
window.lpTag.hooks.push({
  name: 'AFTER_GET_LINES',
  callback(options) {
    options.data.lines.forEach((line) => {
      //To hide the input box
      if (line.isWelcomeMessage) {
        setTimeout(function hideInput() {
          document.getElementsByClassName('lpview_bottom_container')[0].style.display = 'none';
        }, 100); // DOM rendering
      }

      //To show the input box
      if (line.text === 'You got it! Let me connect with the right business expert now.') {
        document.getElementsByClassName('lpview_bottom_container')[0].style.display = 'block';
      }
    });
  }
});

*/

autoStartConversation();
closeConversation();
const { get, has, isNil } = require('lodash');
const { delay, searchTargetParentDiv } = require('./utils');

const config = {
  autLaunch: {
    launchRetryMax: 10,
    launchRetryDelay: 100, // ms
  },
  autoStart: {
    firstMessage: '::Support Case 1234::' // set the consumer's first message
  }
};

const store = {
  firstLineHidden: false,
  conversationInitiated: false,
  currentChatState: '',
  previousChatState: '',
}

const launchMessagingWindow = async (payload) => {
  console.log("🚀 ~ file: autoStart.js ~ line 25 ~ launchMessagingWindow ~ payload", payload)
  // If conversation has started, don't run
  if (store.conversationInitiated) return;

  const isFloatingEngagement = get(payload, 'engagementType', 0) === 6;
  const engagementId = get(payload, 'engagementId', '');

  // Click to launch messaging window
  if (isFloatingEngagement && engagementId) {
    lpTag.taglets.rendererStub.click(engagementId);
  }

}

// Note: Could use a mutation observer to monitor the chat lines and hide when match
const hideFirstLine = async () => {
  const lpChatDiv = document.getElementById('lpChat');
  const transcriptLines = lpChatDiv.getElementsByClassName('lpc_message__text_visitor');

  // Search for div with first line message and hide it
  const foundDiv = [...transcriptLines]
    .map((d, index) => ({ value: d.innerHTML, index }))
    .find(({ value }) => value.includes(config.autoStart.firstMessage)).index;
  const selectedDiv = transcriptLines[foundDiv];
  selectedDiv.parentNode.parentNode.parentNode.style.display = 'none';

  store.firstLineHidden = true;
}

const startMessagingSession = async ({ data }) => {
  try {
    if (!store.firstLineHidden && store.conversationInitiated) hideFirstLine();
    // To stop inner execution, if we have a conversation started - we'll stop
    if (store.conversationInitiated) return;
    console.log("store.conversationInitiated", store.conversationInitiated)

    // Only execute function when the dialog contains a welcome message, will require a welcome message set in LE (CC)
    const chatLines = get(data, 'lines', []);
    const welcomeMessage = chatLines.find((chatLine) => get(chatLine, 'isWelcomeMessage', false))
    if (!welcomeMessage) return;

    welcomeMessage.type = null;
    welcomeMessage.source = 'system';
    welcomeMessage.text = 'Please Wait...';
    welcomeMessage.time = null;

    const [chatInputDiv, chatSendButton] = await Promise.all([
      searchTargetParentDiv({
        parent: 'lpChat',
        target: '[data-lp-point="chat_input"]',
        retryMax: 20,
        retryDelay: 200,
      }),
      searchTargetParentDiv({
        parent: 'lpChat',
        target: '[data-lp-point="send_button"]',
        retryMax: 20,
        retryDelay: 200,
      })
    ]);

    // Set consumer first message
    chatInputDiv.value = config.autoStart.firstMessage;

    // Start Chat
    await delay(100);
    chatSendButton.disabled = false;
    chatSendButton.click();

    // Tell the store that we've started a conversation
    store.conversationInitiated = true;

  } catch (e) {
    console.error({ error: e, message: 'Failed to auto start conversation from script.' })
  }
}

const conversationState = ({ state }) => {
  if (state === 'chatting' || state === 'interactive') {
    store.conversationInitiated = true;
  }
}

/**
 * Automatically starts conversation
 * 1. Launch the chat window by programatically clicking it
 * 2. Wait for lpChat window to load and then start the conversation
 */
const autoStartConversation = () => {
  // Bind event to listen for when lp offers load onto the webpage
  window.lpTag.events.bind('LP_OFFERS', 'OFFER_DISPLAY', launchMessagingWindow);
  // Event that will let the store know if a conversation is in progress
  window.lpTag.events.bind('lpUnifiedWindow', 'state', conversationState);
  // Bind event to listen for welcomeMessage which will allow us to auto start the conversation
  window.lpTag.hooks.push({ name: 'AFTER_GET_LINES', callback: startMessagingSession });
}




module.exports = autoStartConversation;
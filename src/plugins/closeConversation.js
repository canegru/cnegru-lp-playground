// BEGIN state check, processing logic, and listener
const chatState = {
  previousState: '',
  currentState: '',
}

const conversationState = ({ state }) => {
  console.log("conversationState -> state", state)

  // Set current chat state and previous
  chatState.previousState = chatState.currentState;
  chatState.currentState = state;

  if (state === 'ended' && chatState.previousState === 'waiting') {
    const lpChatDiv = document.getElementById('lpChat');
    if (lpChatDiv) {
      document.querySelector('[data-lp-point="close"]').click();
    }
  }
}

const closeConversation = () => {
  // Event that will let the store know if a conversation is in progress
  window.lpTag.events.bind('lpUnifiedWindow', 'state', conversationState);
}

module.exports = closeConversation;
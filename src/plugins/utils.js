/**
 * Finds the lp click event within a parent div
 * @param {string} divName 
 * @param {object} config 
 */
const searchTargetParentDiv= (
  {
    parent,
    target,
    retryMax = 10,
    retryDelay = 100,
  },
) => new Promise((resolve) => {

  const isTargetDivLoaded = async (retry = 0) => {
    // Read the container div
    const targetedDiv = document.getElementById(parent);

    // Query container div and look for the LivePerson div that initiates messaging
    const lpInitiateElement = targetedDiv.querySelector(target);

    // If we found the click element, return it, if not retry until max is reached
    if (lpInitiateElement) {
      resolve(lpInitiateElement);
    } else if (retry >= retryMax) {
      resolve(null);
    } else {
      await utils.delay(retryDelay);
      isTargetDivLoaded(retry + 1)
    }
  };
  isTargetDivLoaded();
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  delay,
  searchTargetParentDiv,
}
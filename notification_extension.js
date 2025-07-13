export const NotificationExtension = {
  name: 'NotificationExtension',
  type: 'effect',
  match: ({ trace }) =>
    trace.type === 'ext_notification' ||
    trace.payload?.name === 'ext_notification',
  effect: async ({ trace, element }) => {
    try {
      // Get delay from trace payload or default to 5000 (5s)
      const delay = trace.payload?.delay * 1000 || 5000
      const animDelay = trace.payload?.anim_delay || 5 // Default to 5 seconds if not specified
      const message = trace.payload?.message || 'Your custom message here'

      // Make the request to httpstat.us
      const response = await fetch(`https://httpstat.us/200?sleep=${delay}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Get the chat container element
      const chatDiv = document.getElementById('voiceflow-chat')
      if (!chatDiv) {
        console.error('Chat div not found')
        return
      }

      const shadowRoot = chatDiv.shadowRoot
      if (!shadowRoot) {
        console.error('Shadow root not found')
        return
      }

      // Get the dialog container from shadow DOM
      const chatContainer = shadowRoot.querySelector(
        '[class*="vfrc-chat--dialog"]'
      )
      if (!chatContainer) {
        console.error('Chat container not found')
        return
      }

      // Create notification container
      const notificationContainer = document.createElement('div')
      notificationContainer.className = 'notification-container'
      notificationContainer.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        padding: 10px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      `

      // Create notification message
      const notificationMessage = document.createElement('div')
      notificationMessage.className = 'notification-message'
      notificationMessage.style.cssText = `
        background-color: rgb(255, 255, 255);
        color: #000;
        padding: 8px 16px;
        border-radius: 30px;
        font-size: 0.8em;
        text-align: center;
        max-width: 80%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1.5px solid #0058ff;
      `
      notificationMessage.textContent = message

      // Assemble notification
      notificationContainer.appendChild(notificationMessage)
      chatContainer.appendChild(notificationContainer)

      // Fade in
      requestAnimationFrame(() => {
        notificationContainer.style.opacity = '1'
      })

      // After animDelay seconds, fade out and remove
      setTimeout(() => {
        notificationContainer.style.opacity = '0'
        // Remove the element after fade out completes
        setTimeout(() => {
          notificationContainer.remove()
        }, 500) // Match the transition duration
      }, animDelay * 1000) // Convert seconds to milliseconds

      console.log('Request completed successfully!')
    } catch (error) {
      console.error('Error in HttpStatExtension:', error)
    }
  },
}

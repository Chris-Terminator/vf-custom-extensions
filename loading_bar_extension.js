export const LoadingExtension = {
  name: 'Loading',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_loading' || trace.payload?.name === 'ext_loading',
  render: ({ trace, element }) => {
    const loadingContainer = document.createElement('div')
    
    // Get configuration from trace payload
    const config = trace.payload || {}
    const duration = config.duration || 3000 // Default 3 seconds
    const message = config.message || 'Loading...'
    const color = config.color || '#2e6ee1'
    const showPercentage = config.showPercentage !== false // Default true
    
    loadingContainer.innerHTML = `
      <style>
        .loading-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px;
          max-width: 300px;
        }
        .loading-message {
          font-size: 0.9em;
          color: #666;
          text-align: center;
        }
        .loading-bar-container {
          width: 100%;
          height: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .loading-bar {
          height: 100%;
          background: linear-gradient(90deg, ${color}, ${color}aa);
          border-radius: 4px;
          width: 0%;
          transition: width 0.1s ease;
          position: relative;
        }
        .loading-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite;
        }
        .loading-percentage {
          font-size: 0.8em;
          color: #888;
          text-align: center;
          margin-top: 5px;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      </style>
      <div class="loading-wrapper">
        <div class="loading-message">${message}</div>
        <div class="loading-bar-container">
          <div class="loading-bar"></div>
        </div>
        ${showPercentage ? '<div class="loading-percentage">0%</div>' : ''}
      </div>
    `
    
    element.appendChild(loadingContainer)
    
    const loadingBar = loadingContainer.querySelector('.loading-bar')
    const percentageDisplay = loadingContainer.querySelector('.loading-percentage')
    
    let progress = 0
    const increment = 100 / (duration / 50) // Update every 50ms
    
    const interval = setInterval(() => {
      progress += increment
      
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Complete the loading and continue the conversation
        setTimeout(() => {
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { completed: true }
          })
        }, 200)
      }
      
      loadingBar.style.width = `${progress}%`
      
      if (percentageDisplay) {
        percentageDisplay.textContent = `${Math.round(progress)}%`
      }
    }, 50)
  }
}

const StarFeedbackExtension = {
  name: 'Feedback',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'star_feedback' || trace.payload?.name === 'star_feedback',
  render: ({ trace, element }) => {
    // SVG for star icon
    const SVG_Star = `
      <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `
    
    const feedbackContainer = document.createElement('div')
    feedbackContainer.innerHTML = `
          <style>
            .vfrc-feedback {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .vfrc-feedback--description {
                font-size: 0.8em;
                color: grey;
                pointer-events: none;
            }
            .vfrc-feedback--buttons {
                display: flex;
            }
            .vfrc-feedback--button {
                margin: 0;
                padding: 0;
                margin-left: 2px;
                border: none;
                background: none;
                opacity: 0.2;
            }
            .vfrc-feedback--button:hover {
              opacity: 0.5;
            }
            .vfrc-feedback--button.hovered {
              opacity: 0.7;
            }
            .vfrc-feedback--button.selected {
              opacity: 0.6;
            }
            .vfrc-feedback--button.disabled {
                pointer-events: none;
            }
            .vfrc-feedback--button svg {
                fill: #ffd700;
                stroke: none;
            }
          </style>
          <div class="vfrc-feedback">
            <div class="vfrc-feedback--description">Was this helpful?</div>
            <div class="vfrc-feedback--buttons">
              <button class="vfrc-feedback--button" data-feedback="1">${SVG_Star}</button>
              <button class="vfrc-feedback--button" data-feedback="2">${SVG_Star}</button>
              <button class="vfrc-feedback--button" data-feedback="3">${SVG_Star}</button>
              <button class="vfrc-feedback--button" data-feedback="4">${SVG_Star}</button>
              <button class="vfrc-feedback--button" data-feedback="5">${SVG_Star}</button>
            </div>
          </div>
        `
    feedbackContainer
      .querySelectorAll('.vfrc-feedback--button')
      .forEach((button, index) => {
        // Add hover effects for interactive star highlighting
        button.addEventListener('mouseenter', function() {
          if (!this.classList.contains('disabled')) {
            highlightStars(index + 1)
          }
        })
        
        button.addEventListener('mouseleave', function() {
          if (!this.classList.contains('disabled')) {
            clearHoverHighlight()
          }
        })
        
        button.addEventListener('click', function (event) {
          const feedback = this.getAttribute('data-feedback')
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { feedback: feedback },
          })
          feedbackContainer
            .querySelectorAll('.vfrc-feedback--button')
            .forEach((btn) => {
              btn.classList.add('disabled')
              btn.classList.remove('hovered') // Clear hover state
              if (btn === this) {
                btn.classList.add('selected')
              }
            })
        })
      })
    
    // Helper functions for interactive highlighting
    function highlightStars(rating) {
      const buttons = feedbackContainer.querySelectorAll('.vfrc-feedback--button')
      buttons.forEach((btn, index) => {
        if (index < rating) {
          btn.classList.add('hovered')
        } else {
          btn.classList.remove('hovered')
        }
      })
    }
    
    function clearHoverHighlight() {
      feedbackContainer
        .querySelectorAll('.vfrc-feedback--button')
        .forEach(btn => btn.classList.remove('hovered'))
    }
    element.appendChild(feedbackContainer)
  },
}

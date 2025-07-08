const SliderExtension = {
  name: 'Slider',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'slider' || trace.payload?.name === 'slider',
  render: ({ trace, element }) => {
    const sliderContainer = document.createElement('div')
    sliderContainer.innerHTML = `
          <style>
            .vfrc-slider {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 16px;
                border-radius: 8px;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .vfrc-slider--header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .vfrc-slider--label {
                font-size: 0.9em;
                color: #1a1e23;
                font-family: 'UCity Pro', sans-serif;
            }
            .vfrc-slider--value {
                font-size: 1.1em;
                font-weight: bold;
                color: #1a1e23;
                font-family: 'UCity Pro', sans-serif;
                min-width: 40px;
                text-align: center;
                background: #f0f0f0;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .vfrc-slider--track {
                position: relative;
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                margin: 10px 0;
            }
            .vfrc-slider--input {
                position: absolute;
                top: -6px;
                left: 0;
                width: 100%;
                height: 18px;
                background: transparent;
                outline: none;
                -webkit-appearance: none;
                cursor: pointer;
            }
            .vfrc-slider--input::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 20px;
                height: 20px;
                background: #007bff;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .vfrc-slider--input::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #007bff;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .vfrc-slider--fill {
                height: 100%;
                background: #007bff;
                border-radius: 3px;
                transition: width 0.1s ease;
            }
            .vfrc-slider--buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            .vfrc-slider--button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                font-size: 0.9em;
                font-family: 'UCity Pro', sans-serif;
                cursor: pointer;
                transition: opacity 0.2s ease;
            }
            .vfrc-slider--button:hover {
                opacity: 0.8;
            }
            .vfrc-slider--button.cancel {
                background: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
            }
            .vfrc-slider--button.submit {
                background: #007bff;
                color: white;
            }
            .vfrc-slider--button.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
          </style>
          <div class="vfrc-slider">
            <div class="vfrc-slider--header">
              <div class="vfrc-slider--label">Select a value:</div>
              <div class="vfrc-slider--value">50</div>
            </div>
            <div class="vfrc-slider--track">
              <div class="vfrc-slider--fill"></div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value="50" 
                class="vfrc-slider--input"
              >
            </div>
            <div class="vfrc-slider--buttons">
              <button class="vfrc-slider--button cancel">Cancel</button>
              <button class="vfrc-slider--button submit">Submit</button>
            </div>
          </div>
        `
    
    const slider = sliderContainer.querySelector('.vfrc-slider--input')
    const valueDisplay = sliderContainer.querySelector('.vfrc-slider--value')
    const fillBar = sliderContainer.querySelector('.vfrc-slider--fill')
    const submitButton = sliderContainer.querySelector('.vfrc-slider--button.submit')
    const cancelButton = sliderContainer.querySelector('.vfrc-slider--button.cancel')
    
    let currentValue = 50
    
    // Update fill bar width based on slider value
    function updateFillBar(value) {
      const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100
      fillBar.style.width = percentage + '%'
    }
    
    // Initialize fill bar
    updateFillBar(currentValue)
    
    // Handle slider input
    slider.addEventListener('input', function(event) {
      currentValue = parseInt(event.target.value)
      valueDisplay.textContent = currentValue
      updateFillBar(currentValue)
    })
    
    // Handle submit button
    submitButton.addEventListener('click', function(event) {
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { value: currentValue },
      })
      
      // Disable buttons after submission
      submitButton.classList.add('disabled')
      cancelButton.classList.add('disabled')
      slider.disabled = true
    })
    
    // Handle cancel button
    cancelButton.addEventListener('click', function(event) {
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { cancelled: true },
      })
      
      // Disable buttons after cancellation
      submitButton.classList.add('disabled')
      cancelButton.classList.add('disabled')
      slider.disabled = true
    })
    
    element.appendChild(sliderContainer)
  },
}
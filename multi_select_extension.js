export const MultiSelectExtension = {
  name: 'MultiSelect',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'multi_select' || trace.payload?.name === 'multi_select',
  render: ({ trace, element }) => {
    const options = trace.payload?.options || ["Option 1", "Option 2", "Option 3"]
    const title = trace.payload?.title || 'Select Items'
    const maxSelections = trace.payload?.max || 99
    const submitText = trace.payload?.submitText || 'Submit Selection'
    const cancelText = trace.payload?.cancelText || 'Cancel'
    
    let selectedItems = []
    
    const multiSelectContainer = document.createElement('div')
    multiSelectContainer.innerHTML = `
          <style>
            .vfrc-multiselect {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 0;
                background: transparent;
                max-width: 400px;
                width: 100%;
                font-family: 'UCity Pro', sans-serif;
            }
            .vfrc-multiselect--title {
                font-size: 1.1em;
                font-weight: bold;
                color: #1a1e23;
                text-align: center;
                margin-bottom: 10px;
            }
            .vfrc-multiselect--options {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .vfrc-multiselect--option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }
            .vfrc-multiselect--option:hover {
                border-color: var(--vf-color-primary, #007bff);
                background: #f8f9fa;
            }
            .vfrc-multiselect--option.selected {
                border-color: var(--vf-color-primary, #007bff);
                background: rgba(0, 123, 255, 0.1);
            }
            .vfrc-multiselect--checkbox {
                width: 18px;
                height: 18px;
                border: 2px solid #ddd;
                border-radius: 3px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            .vfrc-multiselect--option.selected .vfrc-multiselect--checkbox {
                background: var(--vf-color-primary, #007bff);
                border-color: var(--vf-color-primary, #007bff);
                color: white;
            }
            .vfrc-multiselect--option-text {
                flex: 1;
                font-size: 0.9em;
                color: #333;
            }
            .vfrc-multiselect--selected-count {
                font-size: 0.8em;
                color: #666;
                text-align: center;
                margin: 5px 0;
            }
            .vfrc-multiselect--buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 10px;
            }
            .vfrc-multiselect--button {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                font-size: 0.9em;
                font-family: 'UCity Pro', sans-serif;
                cursor: pointer;
                transition: opacity 0.2s ease;
            }
            .vfrc-multiselect--button.multiselect-cancel {
                background: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
            }
            .vfrc-multiselect--button.multiselect-submit {
                background: var(--vf-color-primary, #007bff);
                color: white;
            }
            .vfrc-multiselect--button:hover {
                opacity: 0.9;
            }
            .vfrc-multiselect--button.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .vfrc-multiselect--max-warning {
                font-size: 0.8em;
                color: #ff6b6b;
                text-align: center;
                font-style: italic;
            }
          </style>
          <div class="vfrc-multiselect">
            <div class="vfrc-multiselect--title">${title}</div>
            <div class="vfrc-multiselect--options">
              ${options.map((option, index) => `
                <div class="vfrc-multiselect--option" data-value="${option}" data-index="${index}">
                  <div class="vfrc-multiselect--checkbox">✓</div>
                  <div class="vfrc-multiselect--option-text">${option}</div>
                </div>
              `).join('')}
            </div>
            <div class="vfrc-multiselect--selected-count">
              0 of ${maxSelections} selected
            </div>
            <div class="vfrc-multiselect--max-warning" style="display: none;">
              Maximum ${maxSelections} selections allowed
            </div>
            <div class="vfrc-multiselect--buttons">
              <button class="vfrc-multiselect--button multiselect-cancel">${cancelText}</button>
              <button class="vfrc-multiselect--button multiselect-submit">${submitText}</button>
            </div>
          </div>
        `
    
    const optionElements = multiSelectContainer.querySelectorAll('.vfrc-multiselect--option')
    const countDisplay = multiSelectContainer.querySelector('.vfrc-multiselect--selected-count')
    const maxWarning = multiSelectContainer.querySelector('.vfrc-multiselect--max-warning')
    const submitButton = multiSelectContainer.querySelector('.vfrc-multiselect--button.multiselect-submit')
    const cancelButton = multiSelectContainer.querySelector('.vfrc-multiselect--button.multiselect-cancel')
    
    // Handle option clicks
    optionElements.forEach(optionElement => {
      optionElement.addEventListener('click', function() {
        const value = this.getAttribute('data-value')
        const isSelected = this.classList.contains('selected')
        
        if (isSelected) {
          // Remove selection
          this.classList.remove('selected')
          selectedItems = selectedItems.filter(item => item !== value)
          maxWarning.style.display = 'none'
        } else {
          // Add selection (if under max limit)
          if (selectedItems.length < maxSelections) {
            this.classList.add('selected')
            selectedItems.push(value)
          } else {
            maxWarning.style.display = 'block'
            setTimeout(() => {
              maxWarning.style.display = 'none'
            }, 3000)
          }
        }
        
        updateDisplay()
      })
    })
    
    function updateDisplay() {
      countDisplay.textContent = `${selectedItems.length} of ${maxSelections} selected`
      
      // Enable/disable submit button based on selections
      if (selectedItems.length === 0) {
        submitButton.classList.add('disabled')
      } else {
        submitButton.classList.remove('disabled')
      }
    }
    
    // Handle submit
    submitButton.addEventListener('click', function() {
      if (selectedItems.length === 0) return
      
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { 
          selected: selectedItems,
          cancelled: false
        },
      })
      
      // Disable buttons after submission
      submitButton.classList.add('disabled')
      cancelButton.classList.add('disabled')
      optionElements.forEach(el => el.style.pointerEvents = 'none')
    })
    
    // Handle cancel
    cancelButton.addEventListener('click', function() {
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { 
          selected: [],
          cancelled: true
        },
      })
      
      submitButton.classList.add('disabled')
      cancelButton.classList.add('disabled')
      optionElements.forEach(el => el.style.pointerEvents = 'none')
    })
    
    // Initial display update
    updateDisplay()
    
    element.appendChild(multiSelectContainer)
  },
}

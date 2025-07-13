export const EnhancedFormExtension = {
  name: 'EnhancedForms',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_enhanced_form' || trace.payload?.name === 'ext_enhanced_form',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')
    formContainer.innerHTML = `
          <style>
            .enhanced-form label {
              font-size: 0.8em;
              color: #888;
              display: block;
              margin-top: 15px;
              margin-bottom: 5px;
            }
            .enhanced-form input[type="text"], .enhanced-form input[type="email"], .enhanced-form input[type="tel"], .enhanced-form select, .enhanced-form textarea {
              width: 100%;
              border: none;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              background: transparent;
              margin: 5px 0;
              outline: none;
              font-family: inherit;
              padding: 8px 0;
            }
            .enhanced-form select {
              cursor: pointer;
              padding: 8px 0;
            }
            .enhanced-form textarea {
              border: 0.5px solid rgba(0, 0, 0, 0.1);
              border-radius: 4px;
              padding: 8px;
              resize: vertical;
              min-height: 80px;
            }
            .enhanced-form .phone {
              width: 150px;
            }
            .enhanced-form .radio-group, .enhanced-form .checkbox-group {
              margin: 10px 0;
            }
            .enhanced-form .radio-option, .enhanced-form .checkbox-option {
              display: flex;
              align-items: center;
              margin: 8px 0;
              cursor: pointer;
            }
            .enhanced-form .radio-option input[type="radio"], .enhanced-form .checkbox-option input[type="checkbox"] {
              width: auto;
              margin-right: 8px;
              border: none;
              transform: scale(1.1);
            }
            .enhanced-form .radio-option label, .enhanced-form .checkbox-option label {
              margin: 0;
              cursor: pointer;
              font-size: 0.9em;
              color: #333;
            }
            .enhanced-form .invalid {
              border-color: red !important;
            }
            .enhanced-form .enhanced-submit {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1);
              border: none;
              color: white;
              padding: 12px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
              margin-top: 20px;
              font-size: 1em;
            }
            .enhanced-form .enhanced-submit:hover {
              opacity: 0.9;
            }
            .enhanced-form .field-group {
              margin-bottom: 10px;
            }
          </style>
          
          <div class="enhanced-form">
            <div class="field-group">
              <label for="name">Full Name *</label>
              <input type="text" class="name" name="name" required>
            </div>
            
            <div class="field-group">
              <label for="email">Email Address *</label>
              <input type="email" class="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Invalid email address">
            </div>
            
            <div class="field-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" class="phone" name="phone" required pattern="\\d{3}-\\d{3}-\\d{4}" title="Phone number format: xxx-xxx-xxxx" placeholder="123-456-7890">
            </div>
            
            <div class="field-group">
              <label for="country">Country *</label>
              <select class="country" name="country" required>
                <option value="">Select your country...</option>
                <option value="usa">United States</option>
                <option value="canada">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="australia">Australia</option>
                <option value="germany">Germany</option>
                <option value="france">France</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div class="field-group">
              <label>Preferred Contact Method *</label>
              <div class="radio-group">
                <div class="radio-option">
                  <input type="radio" id="contact-email" name="contact-method" value="email" required>
                  <label for="contact-email">Email</label>
                </div>
                <div class="radio-option">
                  <input type="radio" id="contact-phone" name="contact-method" value="phone" required>
                  <label for="contact-phone">Phone</label>
                </div>
                <div class="radio-option">
                  <input type="radio" id="contact-text" name="contact-method" value="text" required>
                  <label for="contact-text">Text Message</label>
                </div>
              </div>
            </div>
            
            <div class="field-group">
              <label>Areas of Interest</label>
              <div class="checkbox-group">
                <div class="checkbox-option">
                  <input type="checkbox" id="interest-tech" name="interests" value="technology">
                  <label for="interest-tech">Technology</label>
                </div>
                <div class="checkbox-option">
                  <input type="checkbox" id="interest-business" name="interests" value="business">
                  <label for="interest-business">Business</label>
                </div>
                <div class="checkbox-option">
                  <input type="checkbox" id="interest-design" name="interests" value="design">
                  <label for="interest-design">Design</label>
                </div>
                <div class="checkbox-option">
                  <input type="checkbox" id="interest-marketing" name="interests" value="marketing">
                  <label for="interest-marketing">Marketing</label>
                </div>
              </div>
            </div>
            
            <div class="field-group">
              <label for="message">Additional Message</label>
              <textarea class="message" name="message" placeholder="Tell us more about your inquiry..."></textarea>
            </div>
            
            <input type="submit" class="enhanced-submit" value="Submit Form">
          </div>
        `
    
    // Add phone number formatting
    const phoneInput = formContainer.querySelector('.phone')
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '') // Remove non-digits
      if (value.length >= 6) {
        value = value.substring(0,3) + '-' + value.substring(3,6) + '-' + value.substring(6,10)
      } else if (value.length >= 3) {
        value = value.substring(0,3) + '-' + value.substring(3,6)
      }
      e.target.value = value
    })
    
    formContainer.addEventListener('submit', function (event) {
      event.preventDefault()
      
      // Get form elements
      const name = formContainer.querySelector('.name')
      const email = formContainer.querySelector('.email')
      const phone = formContainer.querySelector('.phone')
      const country = formContainer.querySelector('.country')
      const contactMethod = formContainer.querySelector('input[name="contact-method"]:checked')
      const interests = formContainer.querySelectorAll('input[name="interests"]:checked')
      const message = formContainer.querySelector('.message')
      
      // Clear previous invalid states
      formContainer.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'))
      
      // Validate required fields
      let isValid = true
      
      if (!name.checkValidity()) {
        name.classList.add('invalid')
        isValid = false
      }
      if (!email.checkValidity()) {
        email.classList.add('invalid')
        isValid = false
      }
      if (!phone.checkValidity()) {
        phone.classList.add('invalid')
        isValid = false
      }
      if (!country.value) {
        country.classList.add('invalid')
        isValid = false
      }
      if (!contactMethod) {
        // Highlight radio group if no selection
        formContainer.querySelector('.radio-group').style.border = '1px solid red'
        formContainer.querySelector('.radio-group').style.borderRadius = '4px'
        formContainer.querySelector('.radio-group').style.padding = '5px'
        isValid = false
      }
      
      if (!isValid) {
        return
      }
      
      // Collect interests
      const selectedInterests = Array.from(interests).map(checkbox => checkbox.value)
      
      // Remove submit button
      formContainer.querySelector('.enhanced-submit').remove()
      
      // Send data to Voiceflow
      window.voiceflow.chat.interact({
        type: 'complete',
        payload: {
          name: name.value,
          email: email.value,
          phone: phone.value,
          country: country.value,
          contactMethod: contactMethod.value,
          interests: selectedInterests,
          message: message.value
        },
      })
    })
    
    element.appendChild(formContainer)
  },
}

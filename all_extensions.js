const SVG_Thumb = `<svg width="24px" height="24px" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29398 20.4966C4.56534 20.4966 4 19.8827 4 19.1539V12.3847C4 11.6559 4.56534 11.042 5.29398 11.042H8.12364L10.8534 4.92738C10.9558 4.69809 11.1677 4.54023 11.4114 4.50434L11.5175 4.49658C12.3273 4.49658 13.0978 4.85402 13.6571 5.48039C14.2015 6.09009 14.5034 6.90649 14.5034 7.7535L14.5027 8.92295L18.1434 8.92346C18.6445 8.92346 19.1173 9.13931 19.4618 9.51188L19.5612 9.62829C19.8955 10.0523 20.0479 10.6054 19.9868 11.1531L19.1398 18.742C19.0297 19.7286 18.2529 20.4966 17.2964 20.4966H8.69422H5.29398ZM11.9545 6.02658L9.41727 11.7111L9.42149 11.7693L9.42091 19.042H17.2964C17.4587 19.042 17.6222 18.8982 17.6784 18.6701L17.6942 18.5807L18.5412 10.9918C18.5604 10.8194 18.5134 10.6486 18.4189 10.5287C18.3398 10.4284 18.2401 10.378 18.1434 10.378H13.7761C13.3745 10.378 13.0488 10.0524 13.0488 9.65073V7.7535C13.0488 7.2587 12.8749 6.78825 12.5721 6.44915C12.4281 6.28794 12.2615 6.16343 12.0824 6.07923L11.9545 6.02658ZM7.96636 12.4966H5.45455V19.042H7.96636V12.4966Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29398 20.4966C4.56534 20.4966 4 19.8827 4 19.1539V12.3847C4 11.6559 4.56534 11.042 5.29398 11.042H8.12364L10.8534 4.92738C10.9558 4.69809 11.1677 4.54023 11.4114 4.50434L11.5175 4.49658C12.3273 4.49658 13.0978 4.85402 13.6571 5.48039C14.2015 6.09009 14.5034 6.90649 14.5034 7.7535L14.5027 8.92295L18.1434 8.92346C18.6445 8.92346 19.1173 9.13931 19.4618 9.51188L19.5612 9.62829C19.8955 10.0523 20.0479 10.6054 19.9868 11.1531L19.1398 18.742C19.0297 19.7286 18.2529 20.4966 17.2964 20.4966H8.69422H5.29398ZM11.9545 6.02658L9.41727 11.7111L9.42149 11.7693L9.42091 19.042H17.2964C17.4587 19.042 17.6222 18.8982 17.6784 18.6701L17.6942 18.5807L18.5412 10.9918C18.5604 10.8194 18.5134 10.6486 18.4189 10.5287C18.3398 10.4284 18.2401 10.378 18.1434 10.378H13.7761C13.3745 10.378 13.0488 10.0524 13.0488 9.65073V7.7535C13.0488 7.2587 12.8749 6.78825 12.5721 6.44915C12.4281 6.28794 12.2615 6.16343 12.0824 6.07923L11.9545 6.02658ZM7.96636 12.4966H5.45455V19.042H7.96636V12.4966Z" fill="currentColor"></path></svg>`

export const DisableInputExtension = {
  name: 'DisableInput',
  type: 'effect',
  match: ({ trace }) =>
    trace.type === 'ext_disableInput' || trace.payload?.name === 'ext_disableInput',
  effect: ({ trace }) => {
    const { isDisabled } = trace.payload

    function disableInput() {
      const chatDiv = document.getElementById('voiceflow-chat')

      if (chatDiv) {
        const shadowRoot = chatDiv.shadowRoot
        if (shadowRoot) {
          const v3InputContainerClass = '.vfrc-input-container';
          const chatInput = shadowRoot.querySelector(v3InputContainerClass) || shadowRoot.querySelector('.vfrc-chat-input');
          const textarea = shadowRoot.querySelector(v3InputContainerClass + ' textarea') || shadowRoot.querySelector(
            'textarea[id^="vf-chat-input--"]'
          );
          const v3Buttons = shadowRoot.querySelectorAll(v3InputContainerClass + ' button');
          const button = shadowRoot.querySelector('.vfrc-chat-input--button')

          if (chatInput && textarea && (v3Buttons.length > 0 || button)) {
            // Add a style tag if it doesn't exist
            let styleTag = shadowRoot.querySelector('#vf-disable-input-style')
            if (!styleTag) {
              styleTag = document.createElement('style')
              styleTag.id = 'vf-disable-input-style'
              styleTag.textContent = `
                .vf-no-border, .vf-no-border * {
                  border: none !important;
                }
                .vf-hide-button {
                  display: none !important;
                }
              `
              shadowRoot.appendChild(styleTag)
            }

            function updateInputState() {
              textarea.disabled = isDisabled
              if (!isDisabled) {
                textarea.placeholder = 'Message...'
                chatInput.classList.remove('vf-no-border')
                if (v3Buttons.length > 0) {
                  v3Buttons.forEach(b => b.classList.remove('vf-hide-button'));
                } else {
                  button.classList.remove('vf-hide-button')
                }
                // Restore original value getter/setter
                Object.defineProperty(
                  textarea,
                  'value',
                  originalValueDescriptor
                )
              } else {
                textarea.placeholder = ''
                chatInput.classList.add('vf-no-border')
                if (v3Buttons.length > 0) {
                  v3Buttons.forEach(b => b.classList.add('vf-hide-button'));
                  textarea.style.backgroundColor = 'transparent';
                } else {
                  button.classList.add('vf-hide-button')
                }
                Object.defineProperty(textarea, 'value', {
                  get: function () {
                    return ''
                  },
                  configurable: true,
                })
              }

              // Trigger events to update component state
              textarea.dispatchEvent(
                new Event('input', { bubbles: true, cancelable: true })
              )
              textarea.dispatchEvent(
                new Event('change', { bubbles: true, cancelable: true })
              )
            }

            // Store original value descriptor
            const originalValueDescriptor = Object.getOwnPropertyDescriptor(
              HTMLTextAreaElement.prototype,
              'value'
            )

            // Initial update
            updateInputState()
          } else {
            console.error('Chat input, textarea, or button not found')
          }
        } else {
          console.error('Shadow root not found')
        }
      } else {
        console.error('Chat div not found')
      }
    }

    disableInput()
  },
}

export const FormExtension = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_form' || trace.payload?.name === 'ext_form',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')

    formContainer.innerHTML = `
          <style>
            label {
              font-size: 0.8em;
              color: #888;
            }
            input[type="text"], input[type="email"], input[type="tel"] {
              width: 100%;
              border: none;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              background: transparent;
              margin: 5px 0;
              outline: none;
            }
            .phone {
              width: 150px;
            }
            .invalid {
              border-color: red;
            }
            .submit {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1 );
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
            }
          </style>

          <label for="name">Name</label>
          <input type="text" class="name" name="name" required><br><br>

          <label for="email">Email</label>
          <input type="email" class="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Invalid email address"><br><br>

          <label for="phone">Phone Number</label>
          <input type="tel" class="phone" name="phone" required pattern="\\d+" title="Invalid phone number, please enter only numbers"><br><br>

          <input type="submit" class="submit" value="Submit">
        `

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault()

      const name = formContainer.querySelector('.name')
      const email = formContainer.querySelector('.email')
      const phone = formContainer.querySelector('.phone')

      if (
        !name.checkValidity() ||
        !email.checkValidity() ||
        !phone.checkValidity()
      ) {
        name.classList.add('invalid')
        email.classList.add('invalid')
        phone.classList.add('invalid')
        return
      }

      formContainer.querySelector('.submit').remove()

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { name: name.value, email: email.value, phone: phone.value },
      })
    })

    element.appendChild(formContainer)
  },
}

export const MapExtension = {
  name: 'Maps',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_map' || trace.payload?.name === 'ext_map',
  render: ({ trace, element }) => {
    const GoogleMap = document.createElement('iframe')
    const { apiKey, origin, destination, zoom, height, width } = trace.payload

    GoogleMap.width = width || '240'
    GoogleMap.height = height || '240'
    GoogleMap.style.border = '0'
    GoogleMap.loading = 'lazy'
    GoogleMap.allowFullscreen = true
    GoogleMap.src = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&zoom=${zoom}`

    element.appendChild(GoogleMap)
  },
}

export const VideoExtension = {
  name: 'Video',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_video' || trace.payload?.name === 'ext_video',
  render: ({ trace, element }) => {
    const videoElement = document.createElement('video')
    const { videoURL, autoplay, controls } = trace.payload

    videoElement.width = 240
    videoElement.src = videoURL

    if (autoplay) {
      videoElement.setAttribute('autoplay', '')
    }
    if (controls) {
      videoElement.setAttribute('controls', '')
    }

    videoElement.addEventListener('ended', function () {
      window.voiceflow.chat.interact({ type: 'complete' })
    })
    element.appendChild(videoElement)
  },
}

export const TimerExtension = {
  name: 'Timer',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_timer' || trace.payload?.name === 'ext_timer',
  render: ({ trace, element }) => {
    const { duration } = trace.payload || 5
    let timeLeft = duration

    const timerContainer = document.createElement('div')
    timerContainer.innerHTML = `<p>Time left: <span id="time">${timeLeft}</span></p>`

    const countdown = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(countdown)
        window.voiceflow.chat.interact({ type: 'complete' })
      } else {
        timeLeft -= 1
        timerContainer.querySelector('#time').textContent = timeLeft
      }
    }, 1000)

    element.appendChild(timerContainer)
  },
}

export const FileUploadExtension = {
  name: 'FileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_fileUpload' || trace.payload?.name === 'ext_fileUpload',
  render: ({ trace, element }) => {
    const fileUploadContainer = document.createElement('div')
    fileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
      </style>
      <div class='my-file-upload'>Drag and drop a file here or click to upload</div>
      <input type='file' style='display: none;'>
    `

    const fileInput = fileUploadContainer.querySelector('input[type=file]')
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload')

    fileUploadBox.addEventListener('click', function () {
      fileInput.click()
    })

    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0]
      console.log('File selected:', file)

      fileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`

      var data = new FormData()
      data.append('file', file)

      fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: data,
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error('Upload failed: ' + response.statusText)
          }
        })
        .then((result) => {
          fileUploadContainer.innerHTML =
            '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">'
          console.log('File uploaded:', result.data.url)
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: {
              file: result.data.url.replace(
                'https://tmpfiles.org/',
                'https://tmpfiles.org/dl/'
              ),
            },
          })
        })
        .catch((error) => {
          console.error(error)
          fileUploadContainer.innerHTML = '<div>Error during upload</div>'
        })
    })

    element.appendChild(fileUploadContainer)
  },
}

export const KBUploadExtension = {
  name: 'KBUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_KBUpload' || trace.payload?.name === 'ext_KBUpload',
  render: ({ trace, element }) => {
    const apiKey = trace.payload.apiKey || null
    const maxChunkSize = trace.payload.maxChunkSize || 1000
    const tags = `tags=${JSON.stringify(trace.payload.tags)}&` || ''
    const overwrite = trace.payload.overwrite || false

    if (apiKey) {
      const kbfileUploadContainer = document.createElement('div')
      kbfileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
      </style>
      <div class='my-file-upload'>Drag and drop a file here or click to upload</div>
      <input type='file' accept='.txt,.text,.pdf,.docx' style='display: none;'>
    `

      const fileInput = kbfileUploadContainer.querySelector('input[type=file]')
      const fileUploadBox =
        kbfileUploadContainer.querySelector('.my-file-upload')

      fileUploadBox.addEventListener('click', function () {
        fileInput.click()
      })

      fileInput.addEventListener('change', function () {
        const file = fileInput.files[0]

        kbfileUploadContainer.innerHTML = `<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif" alt="Upload" width="50" height="50">`

        const formData = new FormData()
        formData.append('file', file)

        fetch(
          `https://api.voiceflow.com/v3alpha/knowledge-base/docs/upload?${tags}overwrite=${overwrite}&maxChunkSize=${maxChunkSize}`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              Authorization: apiKey,
            },
            body: formData,
          }
        )
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              throw new Error('Upload failed: ' + response.statusText)
              window.voiceflow.chat.interact({
                type: 'error',
                payload: {
                  id: 0,
                },
              })
            }
          })
          .then((result) => {
            kbfileUploadContainer.innerHTML =
              '<img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">'
            window.voiceflow.chat.interact({
              type: 'complete',
              payload: {
                id: result.data.documentID || 0,
              },
            })
          })
          .catch((error) => {
            console.error(error)
            kbfileUploadContainer.innerHTML = '<div>Error during upload</div>'
          })
      })
      element.appendChild(kbfileUploadContainer)
    }
  },
}

export const DateExtension = {
  name: 'Date',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_date' || trace.payload?.name === 'ext_date',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')

    // Get current date and time
    let currentDate = new Date()
    let minDate = new Date()
    minDate.setMonth(currentDate.getMonth() - 1)
    let maxDate = new Date()
    maxDate.setMonth(currentDate.getMonth() + 2)

    // Convert to ISO string and remove seconds and milliseconds
    let minDateString = minDate.toISOString().slice(0, 16)
    let maxDateString = maxDate.toISOString().slice(0, 16)

    formContainer.innerHTML = `
          <style>
            label {
              font-size: 0.8em;
              color: #888;
            }
            input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                border: none;
                background: transparent;
                border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
                bottom: 0;
                outline: none;
                color: transparent;
                cursor: pointer;
                height: auto;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
                width: auto;
                padding:6px;
                font: normal 8px sans-serif;
            }
            .meeting input{
              background: transparent;
              border: none;
              padding: 2px;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              font: normal 14px sans-serif;
              outline:none;
              margin: 5px 0;
              &:focus{outline:none;}
            }
            .invalid {
              border-color: red;
            }
            .submit {
              background: linear-gradient(to right, #2e6ee1, #2e7ff1 );
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
              opacity: 0.3;
            }
            .submit:enabled {
              opacity: 1; /* Make the button fully opaque when it's enabled */
            }
          </style>
          <label for="date">Select your date/time</label><br>
          <div class="meeting"><input type="datetime-local" id="meeting" name="meeting" value="" min="${minDateString}" max="${maxDateString}" /></div><br>
          <input type="submit" id="submit" class="submit" value="Submit" disabled="disabled">
          `

    const submitButton = formContainer.querySelector('#submit')
    const datetimeInput = formContainer.querySelector('#meeting')

    datetimeInput.addEventListener('input', function () {
      if (this.value) {
        submitButton.disabled = false
      } else {
        submitButton.disabled = true
      }
    })
    formContainer.addEventListener('submit', function (event) {
      event.preventDefault()

      const datetime = datetimeInput.value
      console.log(datetime)
      let [date, time] = datetime.split('T')

      formContainer.querySelector('.submit').remove()

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { date: date, time: time },
      })
    })
    element.appendChild(formContainer)
  },
}

export const ConfettiExtension = {
  name: 'Confetti',
  type: 'effect',
  match: ({ trace }) =>
    trace.type === 'ext_confetti' || trace.payload?.name === 'ext_confetti',
  effect: ({ trace }) => {
    const canvas = document.querySelector('#confetti-canvas')

    var myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    })
    myConfetti({
      particleCount: 200,
      spread: 160,
    })
  },
}

export const FeedbackExtension = {
  name: 'Feedback',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_feedback' || trace.payload?.name === 'ext_feedback',
  render: ({ trace, element }) => {
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
                margin-left: 0px;
                border: none;
                background: none;
                opacity: 0.2;
            }

            .vfrc-feedback--button:hover {
              opacity: 0.5; /* opacity on hover */
            }

            .vfrc-feedback--button.selected {
              opacity: 0.6;
            }

            .vfrc-feedback--button.disabled {
                pointer-events: none;
            }

            .vfrc-feedback--button:first-child svg {
                fill: none; /* color for thumb up */
                stroke: none;
                border: none;
                margin-left: 6px;
            }

            .vfrc-feedback--button:last-child svg {
                margin-left: 4px;
                fill: none; /* color for thumb down */
                stroke: none;
                border: none;
                transform: rotate(180deg);
            }
          </style>
          <div class="vfrc-feedback">
            <div class="vfrc-feedback--description">Was this helpful?</div>
            <div class="vfrc-feedback--buttons">
              <button class="vfrc-feedback--button" data-feedback="1">${SVG_Thumb}</button>
              <button class="vfrc-feedback--button" data-feedback="0">${SVG_Thumb}</button>
            </div>
          </div>
        `

    feedbackContainer
      .querySelectorAll('.vfrc-feedback--button')
      .forEach((button) => {
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
              if (btn === this) {
                btn.classList.add('selected')
              }
            })
        })
      })

    element.appendChild(feedbackContainer)
  },
}

export const StarFeedbackExtension = {
  name: 'Feedback',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'star_feedback' || trace.payload?.name === 'star_feedback',
  render: ({ trace, element }) => {
    // SVG for star icon
    const SVG_Star = `
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    `
    
    const feedbackContainer = document.createElement('div')
    feedbackContainer.innerHTML = `
          <style>
            .vfrc-feedback {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .vfrc-feedback--description {
                font-size: 0.8em;
                color: #1a1e23;
                pointer-events: none;
                font-family: 'UCity Pro', sans-serif;
            }
            .vfrc-feedback--buttons {
                display: flex;
            }
            .vfrc-feedback--button {
                margin: 0;
                padding: 4px;
                margin-left: 2px;
                border: none;
                background: none;
                opacity: 1;
                cursor: pointer;
            }
            .vfrc-feedback--button:hover {
              opacity: 1;
            }
            .vfrc-feedback--button.hovered {
              opacity: 1;
            }
            .vfrc-feedback--button.selected {
              opacity: 1;
            }
            .vfrc-feedback--button.disabled {
                pointer-events: none;
            }
            .vfrc-feedback--button svg {
                fill: none;
                stroke: #000;
                stroke-width: 1;
            }
            .vfrc-feedback--button.hovered svg {
                fill: #ffd700;
            }
            .vfrc-feedback--button.selected svg {
                fill: #ffd700;
            }
          </style>
          <div class="vfrc-feedback">
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
          const selectedIndex = parseInt(feedback) - 1
          
          window.voiceflow.chat.interact({
            type: 'complete',
            payload: { feedback: feedback },
          })
          
          feedbackContainer
            .querySelectorAll('.vfrc-feedback--button')
            .forEach((btn, index) => {
              btn.classList.add('disabled')
              btn.classList.remove('hovered') // Clear hover state
              if (index <= selectedIndex) {
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
 
export const SliderExtension = {
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

      // Wait for the specified delay
      setTimeout(() => {
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

        console.log('Notification displayed successfully!')
      }, delay)

    } catch (error) {
      console.error('Error in NotificationExtension:', error)
    }
  },
}
  },
}

export const MultiFileUploadExtension = {
  name: 'MultiFileUpload',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_multiFileUpload' || trace.payload?.name === 'ext_multiFileUpload',
  render: ({ trace, element }) => {
    let uploadedFiles = []
    const maxFiles = 5

    const fileUploadContainer = document.createElement('div')
    fileUploadContainer.innerHTML = `
      <style>
        .my-file-upload {
          border: 2px dashed rgba(46, 110, 225, 0.3);
          padding: 20px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .file-list {
          margin-top: 10px;
        }
        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          margin: 5px 0;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        .file-name {
          flex-grow: 1;
          text-align: left;
        }
        .file-status {
          margin-left: 10px;
        }
        .upload-all-btn {
          background-color: #2e6ee1;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          display: none;
        }
        .upload-all-btn:hover {
          background-color: #1e5fd1;
        }
        .upload-all-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .cancel-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          margin-left: 10px;
        }
        .cancel-btn:hover {
          background-color: #c82333;
        }
        .button-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      </style>
      <div class='my-file-upload'>
        <div>Drag and drop files here or click to upload</div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">Maximum ${maxFiles} files</div>
      </div>
      <input type='file' multiple accept="*/*" style='display: none;'>
      <div class='file-list'></div>
      <div class='button-container'>
        <button class='upload-all-btn'>Upload All Files</button>
        <button class='cancel-btn'>Cancel</button>
      </div>
    `

    const fileInput = fileUploadContainer.querySelector('input[type=file]')
    const fileUploadBox = fileUploadContainer.querySelector('.my-file-upload')
    const fileList = fileUploadContainer.querySelector('.file-list')
    const uploadAllBtn = fileUploadContainer.querySelector('.upload-all-btn')
    const cancelBtn = fileUploadContainer.querySelector('.cancel-btn')

    function updateFileList() {
      fileList.innerHTML = ''
      uploadedFiles.forEach((fileObj, index) => {
        const fileItem = document.createElement('div')
        fileItem.className = 'file-item'
        fileItem.innerHTML = `
          <span class="file-name">${fileObj.file.name}</span>
          <span class="file-status">${fileObj.status}</span>
        `
        fileList.appendChild(fileItem)
      })

      const buttonContainer = fileUploadContainer.querySelector('.button-container')
      if (uploadedFiles.length > 0) {
        buttonContainer.style.display = 'flex'
        uploadAllBtn.disabled = uploadedFiles.some(f => f.status === 'uploading')
      } else {
        buttonContainer.style.display = 'none'
      }
    }

    function addFiles(files) {
      const remainingSlots = maxFiles - uploadedFiles.length
      const filesToAdd = Array.from(files).slice(0, remainingSlots)

      filesToAdd.forEach(file => {
        uploadedFiles.push({
          file: file,
          status: 'ready',
          url: null
        })
      })

      if (files.length > remainingSlots) {
        alert(`Only ${remainingSlots} files were added. Maximum ${maxFiles} files allowed.`)
      }

      updateFileList()
      
      if (uploadedFiles.length >= maxFiles) {
        fileUploadBox.style.opacity = '0.5'
        fileUploadBox.style.pointerEvents = 'none'
        fileUploadBox.innerHTML = `
          <div>Maximum ${maxFiles} files reached</div>
          <div style="font-size: 12px; color: #666; margin-top: 5px;">Upload current files or refresh to start over</div>
        `
      }
    }

    async function uploadFile(fileObj, index) {
      fileObj.status = 'uploading'
      updateFileList()

      try {
        const data = new FormData()
        data.append('file', fileObj.file)

        const response = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: data,
        })

        if (response.ok) {
          const result = await response.json()
          fileObj.url = result.data.url.replace(
            'https://tmpfiles.org/',
            'https://tmpfiles.org/dl/'
          )
          fileObj.status = 'completed'
        } else {
          throw new Error('Upload failed: ' + response.statusText)
        }
      } catch (error) {
        console.error('Upload error:', error)
        fileObj.status = 'error'
      }

      updateFileList()
    }

    async function uploadAllFiles() {
      uploadAllBtn.disabled = true
      uploadAllBtn.textContent = 'Uploading...'

      // Upload all files concurrently
      await Promise.all(
        uploadedFiles.map((fileObj, index) => 
          fileObj.status === 'ready' ? uploadFile(fileObj, index) : Promise.resolve()
        )
      )

      // Check if all uploads were successful
      const completedFiles = uploadedFiles.filter(f => f.status === 'completed')
      const failedFiles = uploadedFiles.filter(f => f.status === 'error')

      if (completedFiles.length > 0) {
        // Send the completed files to Voiceflow
        window.voiceflow.chat.interact({
          type: 'complete',
          payload: {
            files: completedFiles.map(f => ({
              name: f.file.name,
              url: f.url,
              size: f.file.size,
              type: f.file.type
            }))
          },
        })

        fileUploadContainer.innerHTML = `
          <div style="text-align: center;">
            <img src="https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif" alt="Done" width="50" height="50">
            <div>${completedFiles.length} file(s) uploaded successfully!</div>
            ${failedFiles.length > 0 ? `<div style="color: red;">${failedFiles.length} file(s) failed to upload</div>` : ''}
          </div>
        `
      } else {
        fileUploadContainer.innerHTML = '<div style="text-align: center; color: red;">All uploads failed. Please try again.</div>'
      }
    }

    // Click handler
    fileUploadBox.addEventListener('click', function () {
      if (uploadedFiles.length < maxFiles) {
        fileInput.click()
      }
    })

    // File input change handler
    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) {
        addFiles(fileInput.files)
        fileInput.value = '' // Reset input
      }
    })

    // Drag and drop handlers
    fileUploadBox.addEventListener('dragover', function (e) {
      e.preventDefault()
      if (uploadedFiles.length < maxFiles) {
        fileUploadBox.style.borderColor = 'rgba(46, 110, 225, 0.8)'
        fileUploadBox.style.backgroundColor = 'rgba(46, 110, 225, 0.1)'
      }
    })

    fileUploadBox.addEventListener('dragleave', function (e) {
      e.preventDefault()
      fileUploadBox.style.borderColor = 'rgba(46, 110, 225, 0.3)'
      fileUploadBox.style.backgroundColor = 'transparent'
    })

    fileUploadBox.addEventListener('drop', function (e) {
      e.preventDefault()
      fileUploadBox.style.borderColor = 'rgba(46, 110, 225, 0.3)'
      fileUploadBox.style.backgroundColor = 'transparent'
      
      if (uploadedFiles.length < maxFiles && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    })

    // Upload all button handler
    uploadAllBtn.addEventListener('click', uploadAllFiles)

    // Cancel button handler
    cancelBtn.addEventListener('click', function() {
      window.voiceflow.chat.interact({
        type: 'cancel'
      })
    })

    element.appendChild(fileUploadContainer)
  },
}

// ... (keep existing code)

function compressOPML(opmlString) {
    return btoa(encodeURIComponent(opmlString.trim()));
}

function generateCompressedOPML() {
    const opmlString = inputArea.value.trim();
    const compressedOPML = compressOPML(opmlString);
    
    const compressedDataArea = document.getElementById('compressed-data');
    compressedDataArea.value = compressedOPML;
    compressedDataArea.style.display = 'block';
    
    document.getElementById('gist-instructions').style.display = 'block';
}

function generateEmbedCode() {
    const gistUrl = document.getElementById('gist-url-input').value.trim();
    if (!gistUrl) {
        alert('Please enter the Gist URL');
        return;
    }
    
    const encodedUrl = encodeURIComponent(gistUrl);
    const embedUrl = `${window.location.origin}/embed.html?gist=${encodedUrl}`;
    embedCode.value = `<iframe src="${embedUrl}" width="100%" height="500" frameborder="0"></iframe>`;
    embedCode.style.display = 'block';
}

// Update event listeners
document.getElementById('compress-btn').addEventListener('click', generateCompressedOPML);
embedBtn.addEventListener('click', generateEmbedCode);

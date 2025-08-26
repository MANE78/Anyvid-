document.getElementById('download-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const url = document.getElementById('video-url').value;
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    const titleEl = document.getElementById('video-title');
    const thumbnailEl = document.getElementById('video-thumbnail');
    const formatsList = document.getElementById('formats-list');

    // Reset state
    loader.style.display = 'block';
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';
    formatsList.innerHTML = '';
    errorDiv.textContent = '';

    try {
        const response = await fetch('/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        const data = await response.json();

        if (response.ok) {
            titleEl.textContent = data.title;
            thumbnailEl.src = data.thumbnail;

            data.formats.forEach(format => {
                const li = document.createElement('li');
                let formatText = `${format.ext} - ${format.resolution || format.format_note || ''}`;
                if (format.filesize) {
                    formatText += ` (${(format.filesize / 1024 / 1024).toFixed(2)} MB)`;
                }
                const a = document.createElement('a');
                a.href = format.url;
                a.textContent = `تحميل بصيغة ${formatText}`;
                a.target = '_blank'; // Open in new tab
                a.download = ''; // Suggest to download
                li.appendChild(a);
                formatsList.appendChild(li);
            });

            resultsDiv.style.display = 'block';
        } else {
            throw new Error(data.error || 'An unknown error occurred.');
        }
    } catch (err) {
        errorDiv.textContent = `حدث خطأ: ${err.message}`;
        errorDiv.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
});

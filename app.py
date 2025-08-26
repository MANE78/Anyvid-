from flask import Flask, render_template, request, jsonify
# import yt_dlp  # Commented out for diagnostics

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    url = request.json.get('url')
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # --- Start of simplified diagnostic code ---
    try:
        # Return a dummy response to test if the basic app deploys.
        dummy_video_info = {
            'title': 'Test Video - If you see this, the deployment is working!',
            'thumbnail': 'https://via.placeholder.com/640x360.png?text=Test+Thumbnail',
            'formats': [
                {
                    'ext': 'mp4',
                    'resolution': '720p',
                    'url': '#',
                    'format_note': 'Test Format 1',
                    'filesize': 12345678
                },
                {
                    'ext': 'webm',
                    'resolution': '1080p',
                    'url': '#',
                    'format_note': 'Test Format 2',
                    'filesize': 23456789
                }
            ],
        }
        return jsonify(dummy_video_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    # --- End of simplified diagnostic code ---

    # --- Original code commented out for diagnostics ---
    # try:
    #     ydl_opts = {
    #         'noplaylist': True,
    #         'quiet': True,
    #         'no_warnings': True,
    #     }
    #     with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    #         info = ydl.extract_info(url, download=False)
    #         formats = []
    #         for f in info.get('formats', []):
    #             if f.get('url'):
    #                 formats.append({
    #                     'format_id': f.get('format_id'),
    #                     'ext': f.get('ext'),
    #                     'resolution': f.get('resolution'),
    #                     'format_note': f.get('format_note'),
    #                     'filesize': f.get('filesize'),
    #                     'url': f.get('url')
    #                 })
    #         video_info = {
    #             'title': info.get('title'),
    #             'thumbnail': info.get('thumbnail'),
    #             'formats': formats,
    #         }
    #         return jsonify(video_info)
    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500
    # --- End of original code ---

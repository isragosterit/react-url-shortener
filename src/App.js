import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  // Function for URL shortening process
  const shortenUrl = async (e) => {
    e.preventDefault();

    // Basic URL validation
    try {
      new URL(url);
    } catch (err) {
      alert('Please enter a valid URL.');
      return;
    }

    const body = {
      url: url,
      domain: 'tiny.one'
    };

    try {
      // Sending a POST request to the TinyURL API
      const response = await fetch('https://api.tinyurl.com/create', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          authorization: 'Bearer SKnslmhvIKbXGclUAZU7rtVefFyRzGBBSDdfURlruXJxhhTPDVXvPR0DJa8T',
          'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} ${errorData.message}`);
      }
      const data = await response.json();
      setShortenedUrl(data.data.tiny_url);
    } catch (e) {
      alert(`Failed to shorten URL: ${e.message}`);
    }
  };
  // Function to paste the URL from clipboard.
  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      } else {
        alert('Clipboard is empty.');
      }
    } catch (err) {
      console.error("Failed to paste from clipboard: ", err);
      alert('Failed to paste from clipboard.');
    }
  };

  return (
    <div className="app">
      <h1>URL shortener</h1>
      <form onSubmit={shortenUrl}>
        <div className='url-section'>
          <input
            placeholder='Enter URL'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className='shorten-button'>Shorten</button>
        </div>
        <button type="button" className='paste-button' onClick={pasteFromClipboard}>Paste</button>
      </form>
      {shortenedUrl && (
        <div className="shortener">
          {shortenedUrl}
          <CopyToClipboard text={shortenedUrl}>
            <button className='copy-button'>Copy</button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
}

export default App;

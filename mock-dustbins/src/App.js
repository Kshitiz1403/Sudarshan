import axios from 'axios';
import { useState } from 'react';
import QRCode from 'react-qr-code'

function App() {
  const [weight, setWeight] = useState(0)
  const [dustbinId, setDustbinId] = useState('63c144b2df1d3f6b0826d25d');
  const [hash, setHash] = useState('HAZDIYZSGI4DMMLFMVSGKOBXGNTDQZDF');
  const [qr, setQR] = useState('')

  const generate = async (e) => {
    e.preventDefault();
    const token = await (await axios.get('http://localhost:4001/', {
      params: {
        weight, hash, dustbinId
      }
    })).data
    console.log(token)
    setQR(JSON.stringify(token))
  }

  return (
    <div className="App" style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <form style={{ display: 'flex', flexDirection: 'column', }} onSubmit={generate}>
          <div style={{ display: 'flex', }}>
            <div>
              Weight (KG)
            </div>
            <input type="text" name='Weight' value={weight} onChange={(e) => setWeight(e.currentTarget.value)} />
          </div>
          <div style={{ display: 'flex', }}>
            <div>
              DustbinId
            </div>
            <input type="text" name='DustbinId' value={dustbinId} disabled={true} />
          </div>
          <div style={{ display: 'flex', }}>
            <div>
              Hash
            </div>
            <input type="text" name='Hash' value={hash} disabled={true} />
          </div>
          <button type='submit' onClick={generate}>Generate</button>
        </form>
      </div>
      <div style={{ marginBottom: 20 }}>
      </div>

      <QRCode value={qr} />
    </div>
  );
}

export default App;

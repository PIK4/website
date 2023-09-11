let user = {
  id: new Uint8Array(16),
  name: "PikaSlime",
  displayName: "PikaSlime",
}
let challenge = new Uint8Array([
  // must be a cryptographically random number sent from a server
  0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17, 0x1a,
  0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15, 0x7e, 0x38,
  0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
]).buffer

const displayResult = obj => {
  document.getElementById('result').innerHTML = `<pre>${JSON.stringify(obj, null, 4)}</pre>`
}

const buf2Str = buf => new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), '')

const authCreate = async (user, challenge) => {
  const cred = await navigator.credentials.create({
    publicKey: {
      user,
      challenge,
      rp: {
        name: "Pikapika Service"
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
      ],
      attestation: "direct",
      timeout: 60000,
    },
  }).catch(e => displayResult({ error: { ...e } }))

  console.log('create credential: ', cred)

  displayResult({
    id: cred.id,
    type: cred.type,
    response: {
      attestationObject: btoa(buf2Str(cred.response.attestationObject)),
      clientDataJSON: buf2Str(cred.response.clientDataJSON),
      authenticatorData: btoa(buf2Str(cred.response.getAuthenticatorData())),
      getPublicKey: btoa(buf2Str(cred.response.getPublicKey())),
      getPublicKeyAlgorithm: cred.response.getPublicKeyAlgorithm(),
      getTransports: cred.response.getTransports()
    }
  })
}

const authGet = async (user, challenge) => {
  const cred = await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
    },
  }).catch(e => displayResult({ error: { ...e } }))

  console.log('get credential: ', cred)

  displayResult({
    id: cred.id,
    type: cred.type,
    response: {
      authenticatorData: btoa(buf2Str(cred.response.authenticatorData)),
      clientDataJSON: JSON.parse(buf2Str(cred.response.clientDataJSON)),
      signature: btoa(buf2Str(cred.response.signature)),
      userHandle: btoa(buf2Str(cred.response.userHandle))
    }
  })
}

document.getElementById('auth-create').addEventListener('click', () => authCreate(user, challenge))
document.getElementById('auth-get').addEventListener('click', () => authGet(user, challenge))


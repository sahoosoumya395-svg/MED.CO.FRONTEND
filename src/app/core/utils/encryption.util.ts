export async function encryptPassword(password: string): Promise<string> {
  if (!password) return password;
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode('HealthBridgeSecretKeyForAuth1234'); // 32 bytes for AES-256
    const iv = encoder.encode('1234567890123456'); // 16 bytes IV

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-CBC' },
      false,
      ['encrypt']
    );

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv },
      cryptoKey,
      encoder.encode(password)
    );

    const byteArray = new Uint8Array(encryptedBuffer);
    let binary = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);
  } catch (err) {
    console.error('Encryption failed:', err);
    return password;
  }
}

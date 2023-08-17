import { useState } from "react";

export default function RSADemo(){
  return (
    <>
      <KeygenForm />
      <EncryptDecryptForm />
      <SignVerifyForm />
    </>
  )
}

export function KeygenForm(){
  const [prime1, updatePrime1] = useState("");
  const [prime2, updatePrime2] = useState("");
  const [publicExp, updatePublicExp] = useState("");
  const [privateExp, updatePrivateExp] = useState("");
  const [modulus, updateModulus] = useState("");
  async function getKeys(digits){
    const url = "https://gfmjhvb3yd.execute-api.us-east-2.amazonaws.com/default/RSAKeygen?digits=" + digits;
    console.log(url)
    const response = await fetch(url, {method: "POST", mode: "cors"});
    const responseData = await response.json();
    updatePrime1(responseData.p);
    updatePrime2(responseData.q);
    updatePublicExp(responseData.public_exp);
    updatePrivateExp(responseData.private_exp);
    updateModulus(responseData.modulus);
  }
  function submitNumDigits(e){
    e.preventDefault();
    const digits = e.target.keygenInput.value;
    getKeys(digits);
  }
  return (
    <form method = "POST" onSubmit = {submitNumDigits}>
      <label>
        Number of digits in each prime<input name = "keygenInput" />
      </label>
      <hr />
      <button type = "submit">Generate keys</button>
      <hr />
      <KeyDisplay p = {prime1} q = {prime2} publicKey = {publicExp} privateKey = {privateExp} mod = {modulus} />
    </form>
  );
  }
function KeyDisplay({p, q, publicKey, privateKey, mod}){
  return (
    <>
      <p>Your first secret prime: {p}</p>
      <p>Your second secret prime: {q}</p>
      <p>Your public exponent: {publicKey}</p>
      <p>Your private exponent: {privateKey}</p>
      <p>Your public modulus: {mod}</p>
    </>
  )
}

export function EncryptDecryptForm(){
  const [returnedMessage, updateReturnedMessage] = useState("");
  async function sendAndReceiveMessage(message, key, modulus){
    const url = "https://x0eii833df.execute-api.us-east-2.amazonaws.com/default/RSADemoEncryptDecrypt?exp=" + key + 
                "&message=" + message + "&modulus=" + modulus;
    console.log(url);
    const response = await fetch(url, {method: "POST", mode: "cors"});
    const responseData = await response.json();
    console.log(responseData.message);
    updateReturnedMessage(responseData.message);
  }
  function submitMessage(e){
    e.preventDefault();
    const message = e.target.messageInput.value;
    const key = e.target.keyInput.value;
    const modulus = e.target.modulusInput.value;
    sendAndReceiveMessage(message, key, modulus);
  }
  return (
    <>
      <form method = "POST" onSubmit={submitMessage}>
        <label>
          Message to encrypt or decrypt: <input name = "messageInput" />
        </label>
        <hr />
        <label>
          Public exponent (if encrypting) or private exponent (if decrypting): <input name = "keyInput" />
        </label>
        <hr />
        <label>
          Public modulus: <input name = "modulusInput" />
        </label>
        <hr />
        <button label = "submit">Encrypt or decrypt message</button>
      </form>
      <p>Your encrypted or decrypted message: {returnedMessage}</p>
    </>
  )
}

export function SignVerifyForm(){
  const [verificationResult, updateVerificationResult] = useState("");

  async function verifyMessage(publicKey, modulus, signedMessage, expectedMessage){
    const url = "https://vivqmgynyj.execute-api.us-east-2.amazonaws.com/default/RSADemoVerify?public_exp=" + publicKey +
                "&modulus=" + modulus + "&signed_message=" + signedMessage + "&expected_message=" + expectedMessage;
    const response = await fetch(url, {method: "POST", mode: "cors"});
    const responseData = await response.json();
    console.log(responseData.verification_result);
    updateVerificationResult(responseData.verification_result);
  }

  function submitMessage(e){
    e.preventDefault();
    const publicKey = e.target.publicKeyInput.value;
    const modulus = e.target.modulusInput.value;
    const signedMessage = e.target.signedMessageInput.value;
    const expectedMessage = e.target.expectedMessageInput.value;
    verifyMessage(publicKey, modulus, signedMessage, expectedMessage);
  }

  return (
    <>
      <form method = "POST" onSubmit = {submitMessage}>
        <label>
          Public exponent: <input name = "publicKeyInput" />
        </label>
        <hr />
        <label>
          Public modulus: <input name = "modulusInput" />
        </label>
        <hr />
        <label>
          Signed message: <input name = "signedMessageInput" />
        </label>
        <hr />
        <label>
          Expected message: <input name = "expectedMessageInput" />
        </label>
        <hr />
        <button label = "submit">Verify signed message using public key</button>
      </form>
      <p>Verification result: {verificationResult}</p>
    </>
  )
}
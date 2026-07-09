function Payment() {

const copyAccount = async () => {
  await navigator.clipboard.writeText("83094373");
  alert("✅ Account Number Copied");
};

  return (
    <section className="payment">

      <h2>Payment Methods</h2>

      <div className="payment-grid">

        <div className="payment-card">

          <img
            src="/payment/bank.png"
            alt="Bank Transfer"
            className="payment-image"
          />

          <h3>Bank Transfer</h3>

          <div className="bank-details">

  <h3>🏦 Bank Transfer Details</h3>

  <p>
    <b>Bank</b><br/>
    Bank of Ceylon
  </p>

  <p>
    <b>Account Name</b><br/>
    K.V.C Lalani
  </p>

  <p>
    <b>Account Number</b><br/>
    83094373
  </p>

  <button onClick={copyAccount}>
    📋 Copy Account Number
</button>

  <p className="payment-note">
    ⚠️ After completing your payment,
    upload the payment slip in the Top Up form.
  </p>

</div>

          <p className="active">🟢 ACTIVE</p>

        </div>

        <div className="payment-card">

          <img
            src="/payment/cards.png"
            alt="Cards"
            className="payment-image"
          />

          <h3>Credit / Debit Cards</h3>

          <p className="coming">🟡 Coming Soon</p>

        </div>

        <div className="payment-card">

          <img
            src="/payment/paypal.png"
            alt="PayPal"
            className="payment-image"
          />

          <h3>PayPal</h3>

          <p className="coming">🟡 Coming Soon</p>

        </div>

        <div className="payment-card">

          <img
            src="/payment/ezcash.png"
            alt="eZ Cash"
            className="payment-image"
          />

          <h3>eZ Cash</h3>

          <p className="coming">🟡 Coming Soon</p>

        </div>

      </div>

    </section>
  );
}

export default Payment;
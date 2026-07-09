import "./WhatsAppButton.css";

function WhatsAppButton() {

  const phone = "0775563728";
  const message = encodeURIComponent(
  "Hi StrikePay LK 👋\n\nI need help with my Blood Strike Top Up."
);

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
    >
      <img
        src="/whatsapp.png"
        alt="WhatsApp"
      />
    </a>
  );
}

export default WhatsAppButton;
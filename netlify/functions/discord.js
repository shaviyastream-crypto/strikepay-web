export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);

    const webhook = process.env.DISCORD_WEBHOOK_URL;

    const message = {
      content:
`🩸 **NEW BLOOD STRIKE ORDER**

🆔 Order ID: ${data.orderId}

👤 Player: ${data.playerName}
🎮 UID: ${data.uid}
💎 Package: ${data.package}
📱 WhatsApp: ${data.whatsapp}

📌 Status: Pending`
    };

    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
}
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
      embeds: [
        {
          title: "🩸 New Blood Strike Order",
          color: 16711680,

          fields: [
            {
              name: "🆔 Order ID",
              value: data.orderId,
              inline: true,
            },
            {
              name: "👤 Player",
              value: data.playerName || "-",
              inline: true,
            },
            {
              name: "🎮 UID",
              value: data.uid,
              inline: true,
            },
            {
              name: "💎 Package",
              value: data.package,
              inline: false,
            },
            {
  name: "📦 Quantity",
  value: String(data.quantity || 1),
  inline: true,
},
{
  name: "💰 Total Price",
  value: `Rs. ${Number(data.price || 0).toLocaleString()}`,
  inline: true,
},
            {
              name: "📱 WhatsApp",
              value: data.whatsapp,
              inline: false,
            },
            {
              name: "📌 Status",
              value: "Pending",
              inline: true,
            },
          ],

          image: {
            url: data.slip,
          },

          footer: {
            text: "StrikePay LK",
          },

          timestamp: new Date().toISOString(),
        },
      ],
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

        price: finalPrice,
discount: couponDiscount,
coupon: couponCode,
      }),
    };
  }
}
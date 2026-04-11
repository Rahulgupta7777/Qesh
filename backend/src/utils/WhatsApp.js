import axios from "axios";

export const sendWhatsappOtp = async (to, otpCode) => {
  // DEVELOPMENT BYPASS: If credentials are not set, log OTP and return success

  const cleanPhone = to.replace(/\D/g, ""); // Remove non-digits
  console.log(cleanPhone)
  const formattedPhone = cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone;

  if (
    !process.env.WHATSAPP_PHONE_ID ||
    process.env.WHATSAPP_PHONE_ID.includes("dashboard")
  ) {
    console.log(`[DEV MODE] Mock WhatsApp OTP to ${formattedPhone}: ${otpCode}`);
    return { success: true, message: "Mock OTP sent" };
  }

  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: "request_update", // Remember THIS MATCHES YOUR TEMPLATE NAME IN DASHBOARD, remember to go to Meta WhatsApp Manager website, create a template, and give it a name same as this string.
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: otpCode }, // Replaces {{1}} in template. 
              ],
            },
          ],
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error("WhatsApp API Error:", error.response?.data || error.message);
    // Don't crash the app, but let the user know validation failed
    throw new Error(
      "WhatsApp service temporarily unavailable. Please try again later.",
    );
  }
};

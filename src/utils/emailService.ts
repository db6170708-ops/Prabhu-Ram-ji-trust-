import { DonationReceipt } from '../types';

export interface EmailSendResult {
  success: boolean;
  message: string;
  simulated?: boolean;
  recipient?: string;
}

/**
 * Client-side utility to trigger instant delivery of the official donation receipt
 * to the donor's registered email address.
 */
export async function sendReceiptEmail(
  receipt: DonationReceipt,
  recipientEmail?: string
): Promise<EmailSendResult> {
  const targetEmail = (recipientEmail || receipt.email || '').trim();

  if (!targetEmail) {
    return {
      success: false,
      message: 'कृपया दान रसीद प्राप्त करने हेतु ईमेल पता दर्ज करें।'
    };
  }

  // Basic email syntax check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
    return {
      success: false,
      message: 'कृपया एक वैध ईमेल पता (जैसे: name@example.com) दर्ज करें।'
    };
  }

  try {
    const response = await fetch('/api/send-receipt-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receipt,
        recipientEmail: targetEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'ईमेल प्रेषण विफल रहा।');
    }

    return {
      success: true,
      message: data.message || `दान रसीद (${receipt.receiptNo}) ${targetEmail} पर सफलतापूर्वक भेज दी गई है।`,
      simulated: data.simulated,
      recipient: targetEmail,
    };
  } catch (error: any) {
    console.error('Error sending receipt email:', error);
    return {
      success: false,
      message: error.message || 'तकनीकी त्रुटि के कारण ईमेल प्रेषित नहीं हो सका। कृपया पुनः प्रयास करें।'
    };
  }
}

/**
 * Creates a prefilled mailto link as an instant client fallback to open in donor's email client
 */
export function getReceiptMailtoLink(receipt: DonationReceipt, recipientEmail: string): string {
  const subject = encodeURIComponent(`दान पावती रसीद - ${receipt.receiptNo} | प्रभु रामजी ट्रस्ट`);
  const body = encodeURIComponent(
`॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥
प्रभु रामजी ट्रस्ट, ग्राम गलगाँव (सनावद, खरगोन)

आधिकारिक दान पावती रसीद:
------------------------------------------
रसीद संख्या: ${receipt.receiptNo}
दिनांक: ${receipt.date}
दानदाता का नाम: ${receipt.donorName}
मोबाइल: ${receipt.mobile}
${receipt.pan ? `पैन नंबर: ${receipt.pan}\n` : ''}सहयोग प्रकल्प: ${receipt.cause}
सहयोग राशि: ₹${receipt.amount.toLocaleString('en-IN')} /-
भुगतान माध्यम: ${receipt.paymentMode}
लेन-देन संदर्भ / UTR: ${receipt.transactionRef}
------------------------------------------
हस्ताक्षरकर्ता: दिनेश बिड़ला / गुलाबचंद (अधिकृत हस्ताक्षरकर्ता)
वेबसाइट सत्यापन: https://prabhuramjitrustram.ai.studio/
हेल्पलाइन: +91 95753 01233
`
  );

  return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
}

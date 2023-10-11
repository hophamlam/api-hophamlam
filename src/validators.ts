// validators.ts
type VCBData = {
  accountNumber: string;
  debitCredit: string;
  amount: string;
  description: string;
  datetime: string;
};

export const extractVCBData = (body: string): VCBData | null => {
  const accountNumberPattern = /\b(0071001027650|1012842851)\b/;
  const debitCreditPattern = /[+-]/;
  const amountPattern = /([+-])([\d,]+) VND/;
  const descriptionPattern = /Ref (.+)/;
  const datetimePattern = /(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})/;

  const accountNumberMatch = accountNumberPattern.exec(body);
  const debitCreditMatch = debitCreditPattern.exec(body);
  const amountMatch = amountPattern.exec(body);
  const descriptionMatch = descriptionPattern.exec(body);
  const datetimeMatch = datetimePattern.exec(body);

  if (
    accountNumberMatch &&
    debitCreditMatch &&
    amountMatch &&
    descriptionMatch &&
    datetimeMatch
  ) {
    console.log("All matches:", {
      accountNumber: accountNumberMatch[0],
      debitCredit: debitCreditMatch[0],
      amount: amountMatch[2],
      description: descriptionMatch[0],
      datetime: datetimeMatch[0],
    });
    return {
      accountNumber: accountNumberMatch[0],
      debitCredit: debitCreditMatch[0],
      amount: amountMatch[2],
      description: descriptionMatch[0],
      datetime: datetimeMatch[0],
    };
  } else {
    console.warn("Missing match in payload:", {
      accountNumber: !!accountNumberMatch,
      debitCredit: !!debitCreditMatch,
      amount: !!amountMatch,
      description: !!descriptionMatch,
      datetime: !!datetimeMatch,
    });
  }

  return null;
};

// validators.ts
type VCBData = {
  accountNumber: string;
  debitCredit: string;
  amount: string;
  description: string;
  datetime: string;
};

export const extractVCBData = (body: string): VCBData | null => {
  const accountNumberPattern = /\b(0071001027650|1012842851)\b/g;
  const debitCreditPattern = /[+-]/;
  const amountPattern = /[+-]([\d,]+) VND/;
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
    console.log(
      accountNumberMatch,
      debitCreditMatch,
      amountMatch,
      descriptionMatch,
      datetimeMatch
    );
    return {
      accountNumber: accountNumberMatch[1],
      debitCredit: debitCreditMatch[1],
      amount: amountMatch[1],
      description: descriptionMatch[1],
      datetime: datetimeMatch[1],
    };
  }

  return null;
};

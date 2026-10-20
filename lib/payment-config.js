export const SERVICE_FEE_RATE = 0.05;

/**
 * These account details are displayed to customers.
 * NEXT_PUBLIC_ variables are exposed to the browser, so use them
 * only for official receiving account details intended to be public.
 */
export const BANK_ACCOUNTS = [
  {
    id: "amhara",
    name: "Amhara Bank",
    accountName: process.env.NEXT_PUBLIC_AMHARA_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_AMHARA_BANK_ACCOUNT_NUMBER || "",
  },
  {
    id: "awash",
    name: "Awash Bank",
    accountName: process.env.NEXT_PUBLIC_AWASH_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_AWASH_BANK_ACCOUNT_NUMBER || "",
  },
  {
    id: "abyssinia",
    name: "Bank of Abyssinia",
    accountName: process.env.NEXT_PUBLIC_ABYSSINIA_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_ABYSSINIA_BANK_ACCOUNT_NUMBER || "",
  },
  {
    id: "cbe",
    name: "Commercial Bank of Ethiopia (CBE)",
    accountName: process.env.NEXT_PUBLIC_CBE_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_CBE_BANK_ACCOUNT_NUMBER || "",
  },
  {
    id: "wegagen",
    name: "Wegagen Bank",
    accountName: process.env.NEXT_PUBLIC_WEGAGEN_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_WEGAGEN_BANK_ACCOUNT_NUMBER || "",
  },
  {
    id: "abay",
    name: "Abay Bank",
    accountName: process.env.NEXT_PUBLIC_ABAY_BANK_ACCOUNT_NAME || "",
    accountNumber: process.env.NEXT_PUBLIC_ABAY_BANK_ACCOUNT_NUMBER || "",
  },
];

/**
 * Format a numeric amount as Ethiopian birr (ETB).
 */
export function formatETB(amount) {
  const value = Number(amount);

  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

/**
 * Normalize supported Ethiopian mobile numbers to +251XXXXXXXXX.
 *
 * Examples:
 * 0912345678
 * 091-234-5678
 * +251912345678
 * 251912345678
 * 912345678
 */
export function normalizeEthiopianPhone(value) {
  if (typeof value !== "string") {
    return null;
  }

  const compact = value.trim().replace(/[\s()-]/g, "");
  let national;

  if (/^0[79]\d{8}$/.test(compact)) {
    national = compact.slice(1);
  } else if (/^(?:\+?251)[79]\d{8}$/.test(compact)) {
    national = compact.replace(/^(?:\+?251)/, "");
  } else if (/^[79]\d{8}$/.test(compact)) {
    national = compact;
  } else {
    return null;
  }

  return `+251${national}`;
}

/**
 * Calculate the subtotal, 5% service fee, and total.
 * Uses integer cents to reduce floating-point rounding errors.
 */
export function calculateServiceFee(amount) {
  if (
    amount === null ||
    amount === undefined ||
    (typeof amount === "string" && amount.trim() === "") ||
    typeof amount === "boolean"
  ) {
    return null;
  }

  const value = Number(amount);

  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const cents = Math.round(value * 100);

  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return null;
  }

  const feeCents = Math.round(cents * SERVICE_FEE_RATE);
  const totalCents = cents + feeCents;

  if (!Number.isSafeInteger(totalCents)) {
    return null;
  }

  return {
    subtotalETB: cents / 100,
    serviceFeeETB: feeCents / 100,
    totalETB: totalCents / 100,
  };
}

/**
 * Return a configured bank account or null if incomplete.
 */
export function getBankAccount(bankId) {
  return (
    BANK_ACCOUNTS.find(
      (bank) =>
        bank.id === bankId &&
        bank.accountName.trim() !== "" &&
        bank.accountNumber.trim() !== "",
    ) || null
  );
}

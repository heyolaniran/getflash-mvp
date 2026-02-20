
export const payUsdInvoiceQuery = `
  mutation LnInvoicePaymentSend($input: LnInvoicePaymentInput!) {
    lnInvoicePaymentSend(input: $input) {
      status
      errors {
        message
        path
        code
      }
    }
  }
`;
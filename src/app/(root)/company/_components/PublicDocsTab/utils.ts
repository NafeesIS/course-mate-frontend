interface FormInfo {
  name: string;
  description: string;
}

export function getFormInfo(formId: string, category: string): FormInfo {
  if (category === 'Other Attachments') {
    return {
      name: `Supplementary Attachments`,
      description: `These are additional documents that may accompany the ${formId} form. They provide supplementary details as required for statutory compliance.`,
    };
  }

  const formInfoMap: Record<string, FormInfo> = {
    'LLP Form 8': {
      name: `Statement of Account & Solvency and Charge filing`,
      description:
        "Form 8 is an annual statutory filing for Indian LLPs, detailing the LLP's financial position. It includes a statement of assets and liabilities, details of partner contributions, and a declaration of solvency, certifying that the LLP can meet its financial obligations.",
    },
    'LLP Form 11': {
      name: `Annual Return of Limited Liability Partnership (LLP)`,
      description:
        "Form 11 is a mandatory annual filing for Indian LLPs, providing comprehensive details about the LLP's structure and operations. It includes information on the number of partners, changes in partner composition, registered office address, and principal business activities, ensuring transparency and statutory compliance.",
    },
    // Add more form IDs and their corresponding information here
  };

  // Default information for unknown forms
  const defaultInfo: FormInfo = {
    name: `${category}`,
    description: `This form is categorized under ${category}. It includes essential information required to meet the statutory filing obligations of Indian LLPs.`,
  };

  return formInfoMap[formId] || defaultInfo;
}

// export function encodeFileUrl(url: string): string {
//   return btoa(encodeURIComponent(url));
// }

// export function transformFileUrl(
//   value: string,
//   action: 'encode' | 'decode'
// ): string {
//   if (action === 'encode') {
//     return btoa(encodeURIComponent(value));
//   }

//   if (action === 'decode') {
//     try {
//       return decodeURIComponent(atob(value));
//     } catch {
//       throw new Error('Invalid or malformed encoded key.');
//     }
//   }

//   throw new Error('Invalid action. Use "encode" or "decode".');
// }

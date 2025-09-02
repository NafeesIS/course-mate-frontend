// export const pricingPlans = {
//   email: {
//     title: 'Email',
//     description: 'For those looking for just email data!',
//     durationOptions: {
//       monthly: {
//         label: '1 Month',
//         basePrice: 2400,
//         discountRate: 0,
//         priceAfterDiscount: 2400,
//       },
//       quarterly: {
//         label: '3 Months',
//         basePrice: 7200,
//         discountRate: 10,
//         priceAfterDiscount: 6480,
//       },
//       annually: {
//         label: '1 Year',
//         basePrice: 28800,
//         discountRate: 35,
//         priceAfterDiscount: 18720,
//       },
//     },
//     states: undefined,
//     inclusions: [
//       'Company name and CIN',
//       'Companies and LLPs both',
//       'Date of Incorporation',
//       'Company Class & Type',
//       'Authorized & Paid Up Capital',
//       'Nature of Business',
//       'Company Address with Pin code',
//       'Director names and DIN',
//       'Email ID of ALL Directors',
//       'Address of ALL Directors',
//     ],
//     exclusions: ['Mobile Number of ALL Directors'],
//   },
//   emailMobile: {
//     title: 'Email + Mobile',
//     description: 'For those that hit the phones!',
//     durationOptions: {
//       monthly: {
//         label: '1 Month',
//         basePrice: 0,
//         discountRate: 0,
//         priceAfterDiscount: 0,
//       },
//       quarterly: {
//         label: '3 Months',
//         basePrice: 0,
//         discountRate: 10,
//         priceAfterDiscount: 0,
//       },
//       annually: {
//         label: '1 Year',
//         basePrice: 0,
//         discountRate: 35,
//         priceAfterDiscount: 0,
//       },
//     },
//     states: [
//       { stateName: 'Maharashtra', approxCompanyCount: 149, statePrice: 14900 },
//       { stateName: 'Gujarat', approxCompanyCount: 84, statePrice: 8400 },
//       { stateName: 'Uttar Pradesh', approxCompanyCount: 62, statePrice: 6200 },
//       { stateName: 'Delhi', approxCompanyCount: 56, statePrice: 5600 },
//       { stateName: 'Karnataka', approxCompanyCount: 47, statePrice: 4700 },
//       { stateName: 'Telangana', approxCompanyCount: 47, statePrice: 4700 },
//       { stateName: 'Kerala', approxCompanyCount: 40, statePrice: 4000 },
//       { stateName: 'Tamil Nadu', approxCompanyCount: 40, statePrice: 4000 },
//       { stateName: 'Rajasthan', approxCompanyCount: 23, statePrice: 2300 },
//       { stateName: 'West Bengal', approxCompanyCount: 22, statePrice: 2200 },
//       { stateName: 'Haryana', approxCompanyCount: 17, statePrice: 1700 },
//       { stateName: 'Bihar', approxCompanyCount: 13, statePrice: 1300 },
//       {
//         stateName: 'restOfTheIndia',
//         approxCompanyCount: 41,
//         statePrice: 4100,
//       },
//     ],
//     inclusions: ['Everything in Email Plan', 'Mobile Number of ALL Directors'],
//     exclusions: [],
//   },
// };

// export interface IPricingPlan {
//   baseMonthly: number;
//   baseQuarterly: number;
//   baseAnnually: number;
// }

// export interface IStatePricing {
//   state: string;
//   multiplier: number;
//   approxCompanies: number;
// }

// export interface ICompanyAlertPlan {
//   _id: string;
//   name: string;
//   description: string;
//   serviceType: 'subscription';
//   pricingPlan: IPricingPlan;
//   statePricing?: IStatePricing[];
//   features: string[];
//   excludes: string[];
// }

// export const COMPANY_ALERT_PLANS: ICompanyAlertPlan[] = [
//   // {
//   //   _id: '66cf2f3cb6c2ffa4a142e7a2',
//   //   name: 'Email + Mobile',
//   //   description:
//   //     'Get alerts for new companies including email and director phone',
//   //   serviceType: 'subscription',
//   //   pricingPlan: {
//   //     baseMonthly: 9,
//   //     baseQuarterly: 7,
//   //     baseAnnually: 5,
//   //   },
//   //   statePricing: [
//   //     {
//   //       state: 'Maharashtra',
//   //       multiplier: 2,
//   //       approxCompanies: 3000,
//   //     },
//   //     {
//   //       state: 'Delhi',
//   //       multiplier: 1.8,
//   //       approxCompanies: 2200,
//   //     },
//   //     {
//   //       state: 'West Bengal',
//   //       multiplier: 1.6,
//   //       approxCompanies: 1600,
//   //     },
//   //   ],
//   //   features: ['Everything in Email Plan', 'Mobile Number of ALL Directors'],
//   //   excludes: [],
//   // },
//   {
//     _id: '66cf3a638403db99b770b5bd',
//     name: 'Email',
//     description:
//       'Get alerts for new companies including email and director phone',
//     serviceType: 'subscription',
//     pricingPlan: {
//       baseMonthly: 2400,
//       baseQuarterly: 4800,
//       baseAnnually: 12000,
//     },
//     features: [
//       'Company name and CIN',
//       'Companies and LLPs both',
//       'Date of Incorporation',
//       'Company Class & Type',
//       'Authorized & Paid Up Capital',
//       'Nature of Business',
//       'Company Address with Pin code',
//       'Director names and DIN',
//       'Email ID of ALL Directors',
//       'Address of ALL Directors',
//     ],
//     excludes: ['Mobile Number of ALL Directors'],
//     statePricing: [],
//   },
//   {
//     name: 'New Company Alert - Email and Phone',
//     description:
//       'Receive daily alerts of newly incorporated companies with essential details delivered via email. Covers all states in India.',
//     serviceType: 'subscription',
//     statePricing: [],
//     zonalPricing: [
//       {
//         zone: 'East',
//         monthly: 15000,
//         quarterly: 42750,
//         annually: 162000,
//         approxCompanies: 2190,
//         stateIncludes: [
//           'West Bengal',
//           'Bihar',
//           'Orissa',
//           'Jharkhand',
//           'Assam',
//           'Chattisgarh',
//           'Manipur',
//           'Tripura',
//           'Arunachal Pradesh',
//           'Nagaland',
//           'Meghalaya',
//           'Andaman and Nicobar Islands',
//           'Mizoram',
//           'Andaman & Nicobar',
//           'Sikkim',
//         ],
//       },
//       {
//         zone: 'North',
//         monthly: 45000,
//         quarterly: 128250,
//         annually: 486000,
//         approxCompanies: 5650,
//         stateIncludes: [
//           'Uttar Pradesh',
//           'Delhi',
//           'Haryana',
//           'Rajasthan',
//           'Punjab',
//           'Uttarakhand',
//           'Jammu & Kashmir',
//           'Himachal Pradesh',
//           'Chandigarh',
//         ],
//       },
//       {
//         zone: 'South',
//         monthly: 35000,
//         quarterly: 99750,
//         annually: 378000,
//         approxCompanies: 4650,
//         stateIncludes: [
//           'Karnataka',
//           'Telangana',
//           'Tamil Nadu',
//           'Kerala',
//           'Andhra Pradesh',
//           'Pondicherry',
//           'Lakshadweep',
//         ],
//       },
//       {
//         zone: 'West',
//         monthly: 45000,
//         quarterly: 128250,
//         annually: 486000,
//         approxCompanies: 5600,
//         stateIncludes: [
//           'Maharashtra',
//           'Gujarat',
//           'Madhya Pradesh',
//           'Goa',
//           'Dadra & Nagar Haveli',
//           'Daman and Diu',
//         ],
//       },
//       {
//         zone: 'All',
//         monthly: 100000,
//         quarterly: 199500,
//         annually: 756000,
//         approxCompanies: 18050,
//         stateIncludes: [
//           'Maharashtra',
//           'Gujarat',
//           'Madhya Pradesh',
//           'Goa',
//           'Dadra & Nagar Haveli',
//           'Daman and Diu',
//           'Karnataka',
//           'Telangana',
//           'Tamil Nadu',
//           'Kerala',
//           'Andhra Pradesh',
//           'Pondicherry',
//           'Lakshadweep',
//           'Uttar Pradesh',
//           'Delhi',
//           'Haryana',
//           'Rajasthan',
//           'Punjab',
//           'Uttarakhand',
//           'Jammu & Kashmir',
//           'Himachal Pradesh',
//           'Chandigarh',
//           'West Bengal',
//           'Bihar',
//           'Orissa',
//           'Jharkhand',
//           'Assam',
//           'Chattisgarh',
//           'Manipur',
//           'Tripura',
//           'Arunachal Pradesh',
//           'Nagaland',
//           'Meghalaya',
//           'Andaman and Nicobar Islands',
//           'Mizoram',
//           'Andaman & Nicobar',
//           'Sikkim',
//         ],
//       },
//     ],
//     features: [
//       'Company name and CIN',
//       'Companies and LLPs both',
//       'Date of Incorporation',
//       'Company Class & Type',
//       'Authorised & Paid Up Capital',
//       'Nature of Business',
//       'Company Address with Pin code',
//       'Director names and DIN',
//       'Email ID of ALL Directors',
//       'Address of ALL Directors',
//       'Mobile Number of ALL Directors',
//     ],
//     excludes: [],
//     __v: 0,
//   },
// ];

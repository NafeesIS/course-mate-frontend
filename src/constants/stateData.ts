const stateNameMap: Record<string, string> = {
  // East Zone
  WB: 'West Bengal',
  BR: 'Bihar',
  OR: 'Odisha',
  // OD: 'Odisha', // Added OD as a valid alias for Odisha
  JH: 'Jharkhand',
  JHR: 'Jharkhand Rural', // Added JHR as Jharkhand Rural area
  AS: 'Assam',
  ASG: 'Assam Guwahati', // Added ASG for Assam Guwahati
  CT: 'Chhattisgarh',
  MN: 'Manipur',
  TR: 'Tripura',
  AR: 'Arunachal Pradesh',
  NL: 'Nagaland',
  ML: 'Meghalaya',
  AN: 'Andaman and Nicobar Islands',
  MZ: 'Mizoram',
  SK: 'Sikkim',

  // North Zone
  UP: 'Uttar Pradesh',
  DL: 'Delhi',
  HR: 'Haryana',
  RJ: 'Rajasthan',
  PB: 'Punjab',
  UK: 'Uttarakhand',
  // UT: 'Uttarakhand', // Added UT as alias for Uttarakhand
  JK: 'Jammu and Kashmir',
  HP: 'Himachal Pradesh',
  CH: 'Chandigarh',

  // South Zone
  KA: 'Karnataka',
  TS: 'Telangana',
  TZ: 'Coimbatore', // Added TZ as alias for Telangana
  TN: 'Tamil Nadu',
  KL: 'Kerala',
  AP: 'Andhra Pradesh',
  PY: 'Puducherry',
  LD: 'Lakshadweep',

  // West Zone
  MH: 'Maharashtra',
  PN: 'Pune', // Pune (city/district) included as in original list
  GJ: 'Gujarat',
  MP: 'Madhya Pradesh',
  GA: 'Goa',
  DN: 'Dadra and Nagar Haveli',
  DD: 'Daman and Diu',
};

export const getStateFullName = (abbreviation: string): string => {
  return stateNameMap[abbreviation] || '';
};

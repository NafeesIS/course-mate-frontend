export const getTotalCompanySitemaps = async () => {
  const response = await fetch(
    `https://production.filesure.in/api/v1/sitemaps/countTotalCompany`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  const count = data.data;
  const sitemapsNeeded = Math.ceil(count / 3000);
  return sitemapsNeeded;
};

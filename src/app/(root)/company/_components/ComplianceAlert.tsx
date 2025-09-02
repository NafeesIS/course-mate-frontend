import Marquee from 'react-fast-marquee';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from 'react-icons/fa';

const ComplianceAlert = ({ oneTimeComplianceData, annualFilingsData }: any) => {
  const generateAlerts = (data: any, type: string) => {
    if (!data || !data.data) return [];

    return data.data.map((filing: any, index: number) => {
      if (filing.filingDate === 'Not filed') {
        if (filing.filingStatus.includes('Open for Filing')) {
          return null;
        }

        // CHECK FOR DAYS LEFT TO FILE
        const daysLeftMatch = filing.filingStatus.match(
          /(\d+) Days Left to File/
        );
        if (daysLeftMatch) {
          const daysLeft = parseInt(daysLeftMatch[1], 10);
          if (daysLeft <= 30) {
            return (
              <div
                key={`${type}-${index}`}
                className='mr-4 inline-flex items-center gap-2 text-xs text-secondary-foreground md:text-sm'
              >
                <span className='inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs font-bold'>
                  <FaExclamationTriangle />
                  Action Required:
                </span>
                {daysLeft} days left to file the{' '}
                <strong>{filing.formCode}</strong> for FY {filing.financialYear}
                .
              </div>
            );
          } else {
            return (
              <div
                key={`${type}-${index}`}
                className='mr-4 inline-flex items-center gap-2 text-xs text-muted-foreground md:text-sm'
              >
                <span className='inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-bold'>
                  <FaCheckCircle />
                  Upcoming Filing:
                </span>
                {daysLeft} days left to file the{' '}
                <strong>{filing.formCode}</strong> for FY {filing.financialYear}
                .
              </div>
            );
          }
        }

        // CHECK FOR FILING OVERDUE: display FILING OVERDUE
        const daysDelayMatch =
          filing.filingStatus.match(/(\d+) Days Delay/) ||
          filing.filingStatus.match(/(\d+) days overdue/);
        if (daysDelayMatch) {
          const daysDelay = parseInt(daysDelayMatch[1], 10);
          return (
            <div
              key={`${type}-${index}`}
              className='mr-4 inline-flex items-center gap-2 text-xs text-danger-light-600 dark:text-danger-dark md:text-sm'
            >
              <span className='inline-flex items-center gap-1 rounded-full bg-danger-light-50 px-2 py-1 text-xs font-bold dark:bg-danger-dark dark:text-danger-dark-200'>
                <FaTimesCircle />
                Filing Overdue:
              </span>
              The form <strong>{filing.formCode}</strong> for FY{' '}
              {filing.financialYear} is {daysDelay} days overdue. Late fee: ₹
              {filing.additionalFee}.
            </div>
          );
        }
      }
      return null;
    });
  };

  const annualAlerts = generateAlerts(annualFilingsData, 'annual');
  const oneTimeAlerts = generateAlerts(oneTimeComplianceData, 'oneTime');

  const alerts = [...annualAlerts, ...oneTimeAlerts].filter(Boolean);

  if (alerts.length === 0) return null;

  return (
    <div className='-mb-8 overflow-hidden whitespace-nowrap py-4'>
      <Marquee pauseOnHover className='py-1 shadow-inner-balanced'>
        {alerts}
      </Marquee>
    </div>
  );
};

export default ComplianceAlert;

import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';

export default {
  // eslint-disable-next-line no-unused-vars
  config(_input) {
    return {
      name: 'filesure-next',
      region: 'ap-south-1',
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, 'site', {
        warm: 20,
        customDomain: {
          domainName: 'www.filesure.in',
          hostedZone: 'filesure.in',
          domainAlias: 'filesure.in',
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              'MyCert',
              'arn:aws:acm:us-east-1:054037117341:certificate/ee9c420b-4c63-424b-a138-a30f3f3c615a'
            ),
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.customDomainUrl || site.url,
      });
    });
  },
} satisfies SSTConfig;

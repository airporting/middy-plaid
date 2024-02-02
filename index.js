import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const allowedPlaidEnvironments = ['production', 'sandbox', 'development'];
const allowedPlaidVersions = [
  '2020-09-14',
  '2019-05-29',
  '2018-05-22',
  '2017-03-08',
];

const plaidMiddleware = ({
  clientId,
  clientSecret,
  environment,
  version: askedVersion,
}) => {
  async function before(request) {
    const { context } = request;

    if (!allowedPlaidEnvironments.includes(environment)) {
      throw new Error(
        `Plaid - Invalid environment provided. Allowed values: ${allowedPlaidEnvironments.join(', ')}`
      );
    }

    const version = allowedPlaidVersions.includes(askedVersion)
      ? askedVersion
      : '2020-09-14';

    const plaidConfig = new Configuration({
      basePath: PlaidEnvironments[environment],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': clientSecret,
          'Plaid-Version': version,
        },
      },
    });

    context.plaid = new PlaidApi(plaidConfig);
  }

  return {
    before,
  };
};

export default plaidMiddleware;

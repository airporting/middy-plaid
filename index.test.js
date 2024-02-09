import plaidMiddleware, { allowedPlaidEnvironments } from './index.js';
import { randGitShortSha, randNumber, randWord } from '@ngneat/falso';
import { format, setYear } from 'date-fns';

describe('plaidMiddleware', () => {
  it('all valid arguments provided, except version, use default', async () => {
    const handler = {
      context: {},
    };

    const middleware = plaidMiddleware({
      clientId: randGitShortSha(),
      clientSecret: randGitShortSha(),
      environment: 'development',
    });
    await middleware.before(handler);

    expect(handler.context.plaid).toBeDefined();
  });

  it.each([['2020-09-14'], ['2019-05-29'], ['2018-05-22'], ['2017-03-08']])(
    'all valid arguments provided, version %s',
    async (version) => {
      const handler = {
        context: {},
      };

      const middleware = plaidMiddleware({
        clientId: randGitShortSha(),
        clientSecret: randGitShortSha(),
        environment: 'development',
        version,
      });
      await middleware.before(handler);

      expect(handler.context.plaid).toBeDefined();
    }
  );

  it('all valid arguments provided, except version not allowed: value', async () => {
    const handler = {
      context: {},
    };

    const middleware = plaidMiddleware({
      clientId: randGitShortSha(),
      clientSecret: randGitShortSha(),
      environment: 'development',
      version: format(
        setYear(new Date(), randNumber({ min: 2000, max: 2016 })),
        'yyyy-MM-dd'
      ),
    });
    await middleware.before(handler);

    expect(handler.context.plaid).toBeDefined();
  });

  it('all valid arguments provided, wrong environment', async () => {
    const handler = {
      context: {},
    };

    const middleware = plaidMiddleware({
      clientId: randGitShortSha(),
      clientSecret: randGitShortSha(),
      environment: randWord(),
      version: '2020-09-14',
    });
    expect(middleware.before(handler)).rejects.toEqual(
      new Error(
        `Plaid - Invalid environment provided. Allowed values: ${allowedPlaidEnvironments.join(', ')}`
      )
    );
  });
});

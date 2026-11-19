import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeNetlifyForm, shouldSubmitToNetlify } from './netlifyForms';

test('encodeNetlifyForm encodes form-name and fields properly', () => {
  const encoded = encodeNetlifyForm('business-consultation', {
    fullName: 'Meera Nair',
    companyName: 'Deccan NBFC',
  });
  const params = new URLSearchParams(encoded);
  assert.equal(params.get('form-name'), 'business-consultation');
  assert.equal(params.get('fullName'), 'Meera Nair');
  assert.equal(params.get('companyName'), 'Deccan NBFC');
});

test('shouldSubmitToNetlify skips local dev and preview hosts and enables production Netlify hosts', () => {
  assert.equal(shouldSubmitToNetlify('localhost'), false);
  assert.equal(shouldSubmitToNetlify('127.0.0.1'), false);
  assert.equal(shouldSubmitToNetlify('ais-dev-example.asia-east1.run.app'), false);
  assert.equal(shouldSubmitToNetlify('trustline-collections.netlify.app'), true);
  assert.equal(shouldSubmitToNetlify('trustlinecollections.in'), true);
});

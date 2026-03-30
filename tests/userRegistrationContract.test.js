const assert = require('node:assert/strict');
const { test } = require('node:test');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const path = require('node:path');
const fs = require('node:fs');

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('user registration request/response schemas are valid', async () => {
  // Disable meta-schema validation to avoid requiring AJV to fetch
  // external Draft meta-schemas during offline test execution.
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);

  const reqSchemaPath = path.join(process.cwd(), 'src/api/contracts/userRegistration.request.schema.json');
  const resSchemaPath = path.join(process.cwd(), 'src/api/contracts/userRegistration.response.schema.json');

  const reqSchema = loadJson(reqSchemaPath);
  const resSchema = loadJson(resSchemaPath);

  // Smoke: ensure schemas can be compiled by AJV
  const validateReq = ajv.compile(reqSchema);
  const validateRes = ajv.compile(resSchema);

  assert.equal(typeof validateReq, 'function');
  assert.equal(typeof validateRes, 'function');
});

test('user registration request accepts valid payload', async () => {
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);

  const reqSchema = loadJson(path.join(process.cwd(), 'src/api/contracts/userRegistration.request.schema.json'));
  const validateReq = ajv.compile(reqSchema);

  const payload = {
    email: 'admin@example.com',
    fullName: 'Ada Lovelace',
    password: 'Str0ngP@ssw0rd!',
    phoneNumber: '+821012345678',
    role: 'ADMIN'
  };

  const ok = validateReq(payload);
  if (!ok) {
    assert.fail(`Expected valid request, got errors: ${JSON.stringify(validateReq.errors, null, 2)}`);
  }
});

test('user registration request rejects unknown role', async () => {
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);

  const reqSchema = loadJson(path.join(process.cwd(), 'src/api/contracts/userRegistration.request.schema.json'));
  const validateReq = ajv.compile(reqSchema);

  const payload = {
    email: 'admin@example.com',
    fullName: 'Ada Lovelace',
    password: 'Str0ngP@ssw0rd!',
    role: 'SUPERADMIN'
  };

  const ok = validateReq(payload);
  if (ok) {
    assert.fail('Expected invalid request (unknown role), but it passed');
  }
});

test('user registration response accepts valid payload', async () => {
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);

  const resSchema = loadJson(path.join(process.cwd(), 'src/api/contracts/userRegistration.response.schema.json'));
  const validateRes = ajv.compile(resSchema);

  const payload = {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    email: 'admin@example.com',
    fullName: 'Ada Lovelace',
    phoneNumber: '+821012345678',
    role: 'ADMIN',
    status: 'ACTIVE',
    registeredBy: null,
    createdAt: '2026-03-30T12:34:56.000Z',
    updatedAt: '2026-03-30T12:34:56.000Z'
  };

  const ok = validateRes(payload);
  if (!ok) {
    assert.fail(`Expected valid response, got errors: ${JSON.stringify(validateRes.errors, null, 2)}`);
  }
});


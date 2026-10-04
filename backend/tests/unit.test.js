const path = require('path');
const { hashPassword, verifyPassword } = require('../src/utils/hash');
const { generateToken, verifyToken } = require('../src/utils/jwt');
const { validateFileHeader } = require('../src/utils/magicBytes');
const { isValidObjectId } = require('../src/utils/objectId');
const { 
  signupSchema, 
  loginSchema, 
  categorySchema, 
  categoryUpdateSchema, 
  documentQuerySchema 
} = require('../src/utils/validators');

describe('DMS Core Unit & Utility Tests', () => {
  describe('Password Hashing Utility (Argon2id)', () => {
    it('should correctly hash password and verify match', async () => {
      const password = 'StrongUserPass123!';
      const hash = await hashPassword(password);
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toContain('$argon2id$');

      const isMatch = await verifyPassword(hash, password);
      expect(isMatch).toBe(true);

      const isWrong = await verifyPassword(hash, 'WrongPassword');
      expect(isWrong).toBe(false);
    });
  });

  describe('JWT Utility', () => {
    it('should generate and verify JWT token payload', () => {
      const payload = { id: '65123456789abcdef0123456', email: 'test@example.com' };
      const token = generateToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded.id).toEqual(payload.id);
      expect(decoded.email).toEqual(payload.email);
    });

    it('should throw error when verifying invalid token', () => {
      expect(() => verifyToken('invalid.jwt.token')).toThrow();
    });
  });

  describe('ObjectId Validator Utility', () => {
    it('should return true for valid 24-char hex ObjectIds', () => {
      expect(isValidObjectId('65123456789abcdef0123456')).toBe(true);
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    });

    it('should return false for invalid ObjectIds', () => {
      expect(isValidObjectId('invalid-id')).toBe(false);
      expect(isValidObjectId('12345')).toBe(false);
      expect(isValidObjectId(null)).toBe(false);
    });
  });

  describe('Filename Security & Path Traversal Protection', () => {
    it('should strip path traversal sequences from filenames', () => {
      const maliciousName = '../../../../etc/passwd.pdf';
      const cleanName = path.basename(maliciousName).replace(/[\r\n\0]/g, '').trim();
      expect(cleanName).toEqual('passwd.pdf');
    });
  });

  describe('Magic Bytes & File Signature Inspector', () => {
    it('should validate PNG magic bytes (89 50 4E 47)', () => {
      const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const res = validateFileHeader(pngHeader, 'photo.png', 'image/png');
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe('image/png');
    });

    it('should validate JPEG magic bytes (FF D8 FF)', () => {
      const jpgHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const res = validateFileHeader(jpgHeader, 'image.jpeg', 'image/jpeg');
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe('image/jpeg');
    });

    it('should validate PDF magic bytes (%PDF)', () => {
      const pdfHeader = Buffer.from('%PDF-1.7 header content');
      const res = validateFileHeader(pdfHeader, 'report.pdf', 'application/pdf');
      expect(res.valid).toBe(true);
      expect(res.mimeType).toBe('application/pdf');
    });

    it('should reject file with disallowed extension', () => {
      const header = Buffer.from('executable script');
      const res = validateFileHeader(header, 'malicious.exe', 'application/x-msdownload');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('is not allowed');
    });

    it('should reject file when signature does not match PNG extension', () => {
      const fakePngHeader = Buffer.from('not a png image content');
      const res = validateFileHeader(fakePngHeader, 'fake.png', 'image/png');
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('does not match PNG signature');
    });
  });

  describe('Zod Validation Schemas', () => {
    it('should validate signup schema correctly', () => {
      const valid = signupSchema.safeParse({
        email: 'admin@company.org',
        password: 'securepassword123',
        name: 'Admin User'
      });
      expect(valid.success).toBe(true);

      const invalidEmail = signupSchema.safeParse({
        email: 'invalid-email',
        password: 'short',
        name: 'A'
      });
      expect(invalidEmail.success).toBe(false);
    });

    it('should validate category schema correctly', () => {
      const valid = categorySchema.safeParse({
        name: 'Legal Documents',
        description: 'Contracts and NDA files'
      });
      expect(valid.success).toBe(true);

      const emptyName = categorySchema.safeParse({ name: '' });
      expect(emptyName.success).toBe(false);
    });

    it('should validate document query schema defaults and caps', () => {
      const parsed = documentQuerySchema.parse({
        page: '2',
        limit: '500',
        search: 'invoice',
        sortOrder: 'asc'
      });
      expect(parsed.page).toBe(2);
      expect(parsed.limit).toBe(100); // capped at 100
      expect(parsed.search).toBe('invoice');
      expect(parsed.sortOrder).toBe('asc');
    });
  });
});

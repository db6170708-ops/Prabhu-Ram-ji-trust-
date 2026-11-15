import Database from 'better-sqlite3';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_ROOT, 'data');
const DB_PATH = path.join(DATA_DIR, 'trust_certificates.db');

fs.mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(DB_PATH);

// Enable WAL mode and foreign key constraints for reliability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function hashPassword(password: string): string {
  const salt = 'prt_galgaon_salt_2026';
  return crypto.scryptSync(password.trim(), salt, 32).toString('hex');
}

export function initializeCertificateDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificate_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_hi TEXT NOT NULL UNIQUE,
      name_en TEXT NOT NULL DEFAULT '',
      is_default INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificate_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      theme_primary TEXT NOT NULL DEFAULT '#0f4d3a',
      theme_gold TEXT NOT NULL DEFAULT '#d97706',
      border_style TEXT NOT NULL DEFAULT 'royal_double',
      header_text_hi TEXT NOT NULL,
      header_text_en TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      title_en TEXT NOT NULL,
      body_template_hi TEXT NOT NULL,
      body_template_en TEXT NOT NULL,
      footer_note_hi TEXT NOT NULL,
      footer_note_en TEXT NOT NULL,
      is_default INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificate_signatories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      seal_text TEXT NOT NULL DEFAULT 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव',
      is_default INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      certificate_number TEXT NOT NULL UNIQUE,
      recipient_name TEXT NOT NULL,
      guardian_name TEXT NOT NULL DEFAULT '',
      mobile TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      reason TEXT NOT NULL,
      amount REAL DEFAULT NULL,
      issue_date TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'hi' CHECK (language IN ('hi', 'en')),
      signatory_name TEXT NOT NULL,
      signatory_designation TEXT NOT NULL,
      photo_url TEXT NOT NULL DEFAULT '',
      template_id INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
      revoked_reason TEXT NOT NULL DEFAULT '',
      revoked_at TEXT NOT NULL DEFAULT '',
      revoked_by TEXT NOT NULL DEFAULT '',
      created_by TEXT NOT NULL DEFAULT 'Trust Admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (template_id) REFERENCES certificate_templates(id) ON UPDATE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
    CREATE INDEX IF NOT EXISTS idx_certificates_recipient ON certificates(recipient_name);
    CREATE INDEX IF NOT EXISTS idx_certificates_issue_date ON certificates(issue_date);
    CREATE INDEX IF NOT EXISTS idx_certificates_category ON certificates(category);
    CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

    CREATE TABLE IF NOT EXISTS certificate_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      certificate_number TEXT NOT NULL DEFAULT '',
      actor TEXT NOT NULL,
      actor_role TEXT NOT NULL DEFAULT 'super_admin',
      details TEXT NOT NULL DEFAULT '',
      ip_address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON certificate_audit_logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_cert_number ON certificate_audit_logs(certificate_number);
  `);

  const now = new Date().toISOString();

  // Seed default admin password if not present
  const defaultPassword = (process.env.ADMIN_PASSWORD || 'Ram@7709').trim();
  const existingAdminPwd = db
    .prepare('SELECT value FROM admin_settings WHERE key = ?')
    .get('admin_password_hash') as { value: string } | undefined;

  if (!existingAdminPwd) {
    db.prepare('INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, ?)').run(
      'admin_password_hash',
      hashPassword(defaultPassword),
      now
    );
  }

  // Seed all 13 predefined categories cleanly
  const defaultCategories: Array<[string, string]> = [
    ['दानदाता', 'Donor'],
    ['गौसेवा', 'Cow Welfare (Gauseva)'],
    ['अन्नदान एवं भंडारा सेवा', 'Food Donation & Bhandara Seva'],
    ['समाजसेवा', 'Social Service'],
    ['गरीब एवं जरूरतमंद सेवा', 'Service to Poor & Needy'],
    ['नर्मदा परिक्रमा यात्री सेवा', 'Narmada Parikrama Pilgrim Seva'],
    ['वृक्षारोपण एवं पर्यावरण संरक्षण', 'Tree Plantation & Environment Conservation'],
    ['स्वयंसेवक', 'Volunteer'],
    ['विशेष सहयोग', 'Special Support'],
    ['आजीवन सेवा', 'Lifetime Seva'],
    ['धार्मिक एवं सांस्कृतिक सेवा', 'Religious & Cultural Seva'],
    ['विशेष अतिथि', 'Special Guest'],
    ['अन्य विशेष सम्मान प्रमाण पत्र', 'Other Special Honour Certificate'],
  ];

  const insertCat = db.prepare(
    'INSERT OR IGNORE INTO certificate_categories (name_hi, name_en, is_default, created_at) VALUES (?, ?, 1, ?)'
  );
  const seedCats = db.transaction(() => {
    for (const [hi, en] of defaultCategories) {
      insertCat.run(hi, en, now);
    }
  });
  seedCats();

  // Seed default templates
  const templateCount = (
    db.prepare('SELECT COUNT(*) as cnt FROM certificate_templates').get() as { cnt: number }
  ).cnt;

  if (templateCount === 0) {
    const insertTpl = db.prepare(`
      INSERT INTO certificate_templates (
        name, theme_primary, theme_gold, border_style,
        header_text_hi, header_text_en, title_hi, title_en,
        body_template_hi, body_template_en, footer_note_hi, footer_note_en,
        is_default, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertTpl.run(
      'शाही स्वर्ण-हरित सम्मान टेम्पलेट (Royal Heritage)',
      '#0f4d3a',
      '#d97706',
      'royal_double',
      '॥ श्री गणेशाय नमः ॥ श्री जानकीनाथ सहाय ॥',
      'With Divine Blessings of Prabhu Shri Ramji',
      'सेवा सम्मान प्रमाण पत्र',
      'CERTIFICATE OF HONOUR & SEVA',
      'यह पावन प्रमाण-पत्र {category} श्रेणी के अंतर्गत {reason} में आपके समर्पित, निष्काम एवं अमूल्य योगदान के लिए आदरपूर्वक प्रदान किया जाता है। ईश्वर से प्रार्थना है कि आपका जीवन सदैव मंगलमय एवं धर्ममय रहे।',
      'This prestigious certificate is proudly conferred in recognition of dedicated and selfless contribution under the {category} category for {reason}. We pray for continued blessings, prosperity, and service to humanity.',
      'प्रभु रामजी ट्रस्ट, ग्राम गलगाँव, तहसील सनावद, जिला खरगोन (म.प्र.) - 451111',
      'Prabhu Ramji Trust, Village Galgaon, Tehsil Sanawad, Dist. Khargone (M.P.) - 451111',
      1,
      now
    );

    insertTpl.run(
      'पावन सांस्कृतिक उत्सव टेम्पलेट (Sacred Temple Arch)',
      '#0b3b2c',
      '#b45309',
      'cultural_arch',
      '॥ जय सियाराम ॥ सेवा ही परम धर्मः ॥',
      'Service to Humanity is Service to God',
      'प्रशस्ति एवं आभार पत्र',
      'CERTIFICATE OF APPRECIATION',
      'ग्राम गलगाँव स्थित प्रभु रामजी ट्रस्ट की ओर से {category} प्रकल्प में {reason} हेतु आपके पावन सहयोग के लिए यह सम्मान पत्र सादर समर्पित है। समाज एवं धर्म सेवा में आपका योगदान सदैव स्मरणीय रहेगा।',
      'Prabhu Ramji Trust, Galgaon expresses heartfelt gratitude and presents this certificate of appreciation for noble support towards {reason} under {category}. Your generosity strengthens our sacred service mission.',
      'आधिकारिक डिजिटल प्रमाण-पत्र · QR कोड द्वारा ऑनलाइन सत्यापित',
      'Official Digital Certificate · Online Verifiable via QR Code',
      0,
      now
    );
  }

  // Seed default signatories
  const signatoryCount = (
    db.prepare('SELECT COUNT(*) as cnt FROM certificate_signatories').get() as { cnt: number }
  ).cnt;

  if (signatoryCount === 0) {
    const insertSig = db.prepare(`
      INSERT INTO certificate_signatories (name, designation, seal_text, is_default, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertSig.run('श्री गुलाबचंद जी', 'अध्यक्ष (President)', 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव', 1, now);
    insertSig.run('श्री दिनेश जी', 'सचिव (Secretary)', 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव', 0, now);
    insertSig.run('श्रीमती चम्पा बाई', 'कोषाध्यक्ष (Treasurer)', 'प्रभु रामजी ट्रस्ट · ग्राम गलगाँव', 0, now);
  }

  // Initialize Lucky Draw Database Tables (Default State = OFF)
  initializeLuckyDrawDatabase();
}

export function initializeLuckyDrawDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lucky_draw_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      master_enabled INTEGER NOT NULL DEFAULT 0,
      homepage_visibility INTEGER NOT NULL DEFAULT 0,
      booking_enabled INTEGER NOT NULL DEFAULT 0,
      auto_coupon_generation INTEGER NOT NULL DEFAULT 0,
      ticket_price INTEGER NOT NULL DEFAULT 200,
      campaign_title TEXT NOT NULL DEFAULT 'प्रभु रामजी ट्रस्ट · पावन सेवा लकी ड्रॉ कूपन 2026',
      campaign_subtitle TEXT NOT NULL DEFAULT 'आश्रम एवं गौसेवा निर्माण सहायतार्थ लकी ड्रॉ कूपन (₹200 प्रति कूपन)',
      payment_gateway_mode TEXT NOT NULL DEFAULT 'test' CHECK (payment_gateway_mode IN ('test', 'live')),
      payment_provider TEXT NOT NULL DEFAULT 'razorpay',
      kyc_verified INTEGER NOT NULL DEFAULT 0,
      legal_permission_verified INTEGER NOT NULL DEFAULT 0,
      webhook_verified INTEGER NOT NULL DEFAULT 0,
      webhook_secret TEXT NOT NULL DEFAULT '',
      bank_verified INTEGER NOT NULL DEFAULT 0,
      active_sample_id INTEGER DEFAULT NULL,
      activated_at TEXT NOT NULL DEFAULT '',
      activated_by TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lucky_draw_samples (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      sample_file_type TEXT NOT NULL DEFAULT 'image' CHECK (sample_file_type IN ('image', 'pdf')),
      sample_data_url TEXT NOT NULL,
      width_px INTEGER NOT NULL DEFAULT 1000,
      height_px INTEGER NOT NULL DEFAULT 420,
      number_prefix TEXT NOT NULL DEFAULT 'PRRT-LD-2026-',
      pad_length INTEGER NOT NULL DEFAULT 4,
      start_number INTEGER NOT NULL DEFAULT 1,
      serial_x_pct REAL NOT NULL DEFAULT 72,
      serial_y_pct REAL NOT NULL DEFAULT 24,
      serial_font_size INTEGER NOT NULL DEFAULT 24,
      serial_color TEXT NOT NULL DEFAULT '#0f4d3a',
      name_x_pct REAL NOT NULL DEFAULT 28,
      name_y_pct REAL NOT NULL DEFAULT 58,
      name_font_size INTEGER NOT NULL DEFAULT 22,
      name_color TEXT NOT NULL DEFAULT '#1c1917',
      show_qr INTEGER NOT NULL DEFAULT 1,
      qr_x_pct REAL NOT NULL DEFAULT 84,
      qr_y_pct REAL NOT NULL DEFAULT 66,
      qr_size_px INTEGER NOT NULL DEFAULT 72,
      is_active INTEGER NOT NULL DEFAULT 0,
      created_by TEXT NOT NULL DEFAULT 'Super Admin',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lucky_draw_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      payment_ref TEXT NOT NULL DEFAULT '',
      buyer_name TEXT NOT NULL,
      buyer_mobile TEXT NOT NULL,
      buyer_email TEXT NOT NULL DEFAULT '',
      quantity INTEGER NOT NULL DEFAULT 1,
      amount INTEGER NOT NULL,
      gateway_mode TEXT NOT NULL DEFAULT 'test',
      payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed')),
      webhook_verified INTEGER NOT NULL DEFAULT 0,
      webhook_signature TEXT NOT NULL DEFAULT '',
      coupon_generated INTEGER NOT NULL DEFAULT 0,
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      verified_at TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS lucky_draw_coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_number TEXT NOT NULL UNIQUE,
      serial_seq INTEGER NOT NULL,
      sample_id INTEGER NOT NULL,
      number_prefix TEXT NOT NULL,
      payment_id INTEGER NOT NULL,
      order_id TEXT NOT NULL,
      buyer_name TEXT NOT NULL,
      buyer_mobile TEXT NOT NULL,
      buyer_email TEXT NOT NULL DEFAULT '',
      amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'cancelled')),
      issued_at TEXT NOT NULL,
      FOREIGN KEY (sample_id) REFERENCES lucky_draw_samples(id),
      FOREIGN KEY (payment_id) REFERENCES lucky_draw_payments(id),
      UNIQUE (number_prefix, serial_seq)
    );

    CREATE INDEX IF NOT EXISTS idx_ld_coupons_number ON lucky_draw_coupons(coupon_number);
    CREATE INDEX IF NOT EXISTS idx_ld_coupons_mobile ON lucky_draw_coupons(buyer_mobile);
    CREATE INDEX IF NOT EXISTS idx_ld_coupons_order ON lucky_draw_coupons(order_id);
    CREATE INDEX IF NOT EXISTS idx_ld_coupons_status ON lucky_draw_coupons(status);
    CREATE INDEX IF NOT EXISTS idx_ld_coupons_issued ON lucky_draw_coupons(issued_at DESC);

    CREATE TABLE IF NOT EXISTS lucky_draw_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      actor_role TEXT NOT NULL DEFAULT 'super_admin',
      previous_state TEXT NOT NULL DEFAULT '',
      new_state TEXT NOT NULL DEFAULT '',
      details TEXT NOT NULL DEFAULT '',
      ip_address TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ld_audit_created_at ON lucky_draw_audit_logs(created_at DESC);
  `);

  const now = new Date().toISOString();
  // Ensure default OFF row (id = 1) exists
  db.prepare(
    `INSERT OR IGNORE INTO lucky_draw_settings (
      id, master_enabled, homepage_visibility, booking_enabled, auto_coupon_generation,
      ticket_price, payment_gateway_mode, kyc_verified, legal_permission_verified,
      webhook_verified, bank_verified, updated_at
    ) VALUES (1, 0, 0, 0, 0, 200, 'test', 0, 0, 0, 0, ?)`
  ).run(now);
}

export function generateNextCertificateNumber(yearOverride?: number): string {
  const year = yearOverride || new Date().getFullYear();
  const prefix = `PRRT-${year}-`;
  const rows = db
    .prepare('SELECT certificate_number FROM certificates WHERE certificate_number LIKE ?')
    .all(`${prefix}%`) as Array<{ certificate_number: string }>;

  let maxNum = 0;
  for (const row of rows) {
    const suffix = row.certificate_number.slice(prefix.length);
    const parsed = parseInt(suffix, 10);
    if (!Number.isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  }

  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

export function generateNextCouponSerial(
  prefix: string,
  padLength: number,
  startNumber: number
): { serialSeq: number; couponNumber: string } {
  const cleanPrefix = prefix.trim() || 'PRRT-LD-2026-';
  const row = db
    .prepare('SELECT MAX(serial_seq) as max_seq FROM lucky_draw_coupons WHERE number_prefix = ?')
    .get(cleanPrefix) as { max_seq: number | null } | undefined;

  const currentMax = row?.max_seq ?? null;
  const nextSeq = currentMax !== null ? currentMax + 1 : Math.max(1, startNumber || 1);
  const pad = Math.min(Math.max(Number(padLength) || 4, 2), 10);
  return {
    serialSeq: nextSeq,
    couponNumber: `${cleanPrefix}${String(nextSeq).padStart(pad, '0')}`,
  };
}


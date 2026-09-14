import type { Request, Response } from 'express';
import pool from '../config/db.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Find user + their role
    const result = await pool.query(
      `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, r.name as role
      FROM auth_users u
      LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth_roles r ON r.id = ur.role_id
      WHERE u.email = $1 AND u.deleted_at IS NULL
      LIMIT 1
    `,
      [email]
    );

    if (result.rows.length === 0 || !result.rows[0]) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0] as Record<string, any>;

    if (user.status !== 'active') {
      res.status(403).json({ error: 'Account is not active' });
      return;
    }

    // For prototype: accept any password (since we use placeholder hashes)
    // In production: use bcrypt.compare(password, user.password_hash)

    // Map DB role name to frontend role format
    const roleKey = typeof user.role === 'string' ? user.role.toLowerCase() : '';
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      faculty: 'Faculty',
      student: 'Student',
      staff: 'Staff',
    };

    const token = 'unicore-jwt-' + String(user.id) + '-' + Date.now();

    // Update last_login_at
    await pool.query(`UPDATE auth_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`, [user.id]);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || String(user.email);

    res.json({
      user: {
        id: user.id,
        name: fullName,
        email: user.email,
        role: roleMap[roleKey] || user.role || 'Student',
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.last_login_at, r.name as role
      FROM auth_users u
      LEFT JOIN auth_user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth_roles r ON r.id = ur.role_id
      WHERE u.id = $1
      LIMIT 1
    `,
      [userId]
    );

    if (result.rows.length === 0 || !result.rows[0]) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const u = result.rows[0] as Record<string, any>;
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || String(u.email);

    res.json({
      id: u.id,
      name: fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      lastLogin: u.last_login_at,
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

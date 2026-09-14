import { Request, Response } from 'express';
import pool from '../config/db';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user + their role
    const result = await pool.query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, r.name as role
      FROM auth.users u
      LEFT JOIN auth.user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth.roles r ON r.id = ur.role_id
      WHERE u.email = $1 AND u.deleted_at IS NULL
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // For prototype: accept any password (since we use placeholder hashes)
    // In production: use bcrypt.compare(password, user.password_hash)

    // Map DB role name to frontend role format
    const roleMap: Record<string, string> = {
      admin: 'Admin',
      faculty: 'Faculty',
      student: 'Student',
      staff: 'Staff',
    };

    const token = 'unicore-jwt-' + user.id + '-' + Date.now();

    // Update last_login_at
    await pool.query(`UPDATE auth.users SET last_login_at = now() WHERE id = $1`, [user.id]);

    res.json({
      user: {
        id: user.id,
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        role: roleMap[user.role] || 'Student',
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.last_login_at, r.name as role
      FROM auth.users u
      LEFT JOIN auth.user_roles ur ON ur.user_id = u.id
      LEFT JOIN auth.roles r ON r.id = ur.role_id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const u = result.rows[0];
    res.json({
      id: u.id,
      name: u.first_name + ' ' + u.last_name,
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

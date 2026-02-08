-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert test user (password: "test123")
-- The password hash below is for "test123" using the hashPassword function
INSERT INTO users (email, password_hash, name) 
VALUES (
  'admin@iam-platform.com',
  -- You'll need to generate this hash properly or just sign up through the UI
  'placeholder_hash',
  'Admin User'
) ON CONFLICT (email) DO NOTHING;

-- Insert some dummy audit logs for demonstration
INSERT INTO audit_logs (user_id, action, details)
SELECT 
  u.id,
  action,
  details
FROM users u,
(
  VALUES
    ('login', 'User logged in'),
    ('create_user', 'New user account created'),
    ('modify_policy', 'IAM policy updated'),
    ('access_denied', 'Unauthorized access attempt blocked'),
    ('role_assigned', 'Admin role assigned to user')
) AS logs(action, details)
WHERE u.email = 'admin@iam-platform.com'
LIMIT 5;

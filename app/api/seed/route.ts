import { NextResponse } from 'next/server';
import { createUser, logAuditEvent } from '@/lib/auth';

export async function GET() {
  try {
    // Create demo users
    const demoUsers = [
      { email: 'admin@example.com', password: 'Admin@123', name: 'Admin User' },
      { email: 'john@example.com', password: 'John@123', name: 'John Doe' },
      { email: 'jane@example.com', password: 'Jane@123', name: 'Jane Smith' },
      { email: 'bob@example.com', password: 'Bob@123', name: 'Bob Johnson' },
    ];

    const createdUsers = [];

    for (const user of demoUsers) {
      try {
        const createdUser = await createUser(
          user.email,
          user.password,
          user.name
        );
        createdUsers.push(createdUser);
        
        // Log the creation event
        if (createdUser.id) {
          await logAuditEvent(
            createdUser.id,
            'CREATE_USER',
            `User ${user.email} created via seed`
          );
        }
      } catch (error) {
        // User might already exist, continue
        console.log(`User ${user.email} already exists or error creating`);
      }
    }

    return NextResponse.json({
      message: 'Seed data created',
      users: createdUsers,
      credentials: {
        email: 'admin@example.com',
        password: 'Admin@123',
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}

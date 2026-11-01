import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db.js';

export async function GET() {
  try {
    const isDB = await connectDB();
    if (isDB && isDB.connection.readyState === 1) {
      return NextResponse.json({
        connected: true,
        type: 'MongoDB Atlas',
        database: isDB.connection.name || 'tracker',
      });
    }
    return NextResponse.json({
      connected: false,
      type: 'Local Storage',
      message: 'Running in offline/local fallback mode',
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      type: 'Local Storage',
      error: error.message,
    });
  }
}

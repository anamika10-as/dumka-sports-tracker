import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db.js';

export async function GET() {
  try {
    const isDB = await connectDB();
    if (isDB && isDB.connection.readyState === 1) {
      const db = isDB.connection.db;
      const databaseName = db.databaseName;
      
      // Verify matches collection accessibility
      let matchesAccessible = false;
      let matchesCount = 0;
      try {
        const collections = await db.listCollections().toArray();
        const hasMatches = collections.some((c) => c.name === 'matches');
        if (hasMatches) {
          matchesAccessible = true;
          matchesCount = await db.collection('matches').countDocuments();
        } else {
          // If not yet created, create collection and verify accessibility
          await db.createCollection('matches');
          matchesAccessible = true;
          matchesCount = await db.collection('matches').countDocuments();
        }
      } catch (collErr) {
        matchesAccessible = false;
      }

      return NextResponse.json({
        connected: true,
        type: 'MongoDB Atlas',
        database: databaseName,
        matchesAccessible,
        matchesCount,
        statusText: `Connected to ${databaseName} • matches (${matchesCount})`,
      });
    }

    return NextResponse.json({
      connected: false,
      type: 'Local Storage',
      database: 'Local File Store',
      matchesAccessible: false,
      matchesCount: 0,
      statusText: 'Local Fallback Storage Active',
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      type: 'Disconnected',
      database: 'None',
      matchesAccessible: false,
      matchesCount: 0,
      statusText: 'Connection Failed',
    });
  }
}

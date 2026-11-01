import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const DATA_FILE = path.join(process.cwd(), 'data', 'store.json');
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
    }
    return NextResponse.json({ success: true, message: 'Data reset to Dumka Sports Academy starter records' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


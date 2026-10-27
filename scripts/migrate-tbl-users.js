const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
let env = '';
try { env = fs.readFileSync('.env.local', 'utf8'); } catch(e) {}
let url = '', key = '';
env.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=').slice(1).join('=').trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=').slice(1).join('=').trim();
});
const supabase = createClient(url, key);

async function run() {
  console.log('Checking current tbl_users columns...');
  const { data: rows, error: selErr } = await supabase.from('tbl_users').select('*').limit(1);
  if (selErr) { console.log('Select error:', selErr.message); return; }
  const cols = rows && rows.length > 0 ? Object.keys(rows[0]) : [];
  console.log('Current columns:', cols);

  const userId = rows && rows.length > 0 ? rows[0].id : 2;
  console.log('User ID:', userId);

  // Try to update with new columns - if they exist it will work, if not Supabase returns error
  const newCols = {
    title: 'Data Analyst & Front-End Developer',
    bio: 'A passionate professional bridging the gap between data insights and beautiful user interfaces.',
    about_desc: 'Hello, I am Vannisa Maulvi. I specialize in Data Analysis and Front-End Development, bringing analytical rigor to creative web solutions.',
    phone: '+62 896-7742-1706',
    location: 'Bogor, Jawa Barat',
    freelance: 'Available',
    roles: 'Data Analyst,Front-End Developer',
    avatar_url: '/image/me.png',
    cv_url: '',
    socials: JSON.stringify({
      linkedin: 'https://www.linkedin.com/in/vannisa-maulvi/',
      github: 'https://github.com/vannisamaulvi',
      instagram: 'https://www.instagram.com/vannisamaulvi/',
      tiktok: 'https://www.tiktok.com/@vannisamaulvi'
    })
  };

  const { error: updateErr } = await supabase.from('tbl_users').update(newCols).eq('id', userId);
  if (updateErr) {
    console.log('Update failed (columns may not exist yet):', updateErr.message);
    console.log('\nPlease run this SQL in Supabase dashboard SQL editor:');
    console.log(`
ALTER TABLE tbl_users
  ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Data Analyst & Front-End Developer',
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS about_desc TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+62 896-7742-1706',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Bogor, Jawa Barat',
  ADD COLUMN IF NOT EXISTS freelance TEXT DEFAULT 'Available',
  ADD COLUMN IF NOT EXISTS roles TEXT DEFAULT 'Data Analyst,Front-End Developer',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '/image/me.png',
  ADD COLUMN IF NOT EXISTS cv_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS socials JSONB DEFAULT '{}';
    `);
  } else {
    console.log('Update successful! New columns added.');
    const { data: updated } = await supabase.from('tbl_users').select('*').limit(1);
    console.log('Updated columns:', updated && updated.length > 0 ? Object.keys(updated[0]) : 'none');
  }
}

run().catch(console.error);

const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

// dotenv yahan bhi load karo
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL aur Service Key .env mein set karo!');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('   SUPABASE_SERVICE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws }
});

const connectDB = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') throw error;
    console.log('✅ Supabase Connected Successfully!');
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = { supabase, connectDB };
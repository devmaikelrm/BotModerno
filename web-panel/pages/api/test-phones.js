import { getAdminClient } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    console.log('🔍 Test phones endpoint called');
    
    const db = getAdminClient();
    
    // Verificar conexión a Supabase
    const { data, error } = await db
      .from('phones')
      .select('id, commercial_name, model, works')
      .limit(3);
    
    if (error) {
      console.error('❌ Error accessing phones table:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        details: 'Error accessing phones table'
      });
    }
    
    console.log('✅ Phones data retrieved:', data?.length || 0, 'records');
    
    return res.status(200).json({
      success: true,
      message: 'Phones table accessible',
      count: data?.length || 0,
      sample: data || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test phones error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: 'General error in test endpoint'
    });
  }
}

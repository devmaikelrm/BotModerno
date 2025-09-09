const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dlnqkmcacfwhbwdjxczw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbnFrbWNhY2Z3aGJ3ZGp4Y3p3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI1NTAxNiwiZXhwIjoyMDcxODMxMDE2fQ.gVRO0hc49Iaqh7Wh5toR4kifVkGIiaRd2BbHhP_vl28';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhonesTable() {
  console.log('🔍 Verificando tabla phones...\n');
  
  try {
    // Verificar si la tabla phones existe
    const { data: phones, error: phonesError } = await supabase
      .from('phones')
      .select('*')
      .limit(5);
    
    if (phonesError) {
      console.error('❌ Error al acceder a la tabla phones:', phonesError);
      console.log('\n📝 La tabla phones no existe o no tienes permisos.');
      console.log('🔧 Necesitas crear la tabla phones en Supabase.');
      return;
    }
    
    console.log('✅ Tabla phones encontrada');
    console.log('📊 Registros encontrados:', phones?.length || 0);
    
    if (phones && phones.length > 0) {
      console.log('📋 Primeros registros:');
      console.log(JSON.stringify(phones, null, 2));
    } else {
      console.log('📝 La tabla está vacía. Puedes agregar registros desde el panel.');
    }
    
    // Verificar estructura de la tabla
    console.log('\n🔍 Verificando estructura de la tabla...');
    const { data: sample, error: sampleError } = await supabase
      .from('phones')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.error('❌ Error al verificar estructura:', sampleError);
    } else {
      console.log('✅ Estructura de la tabla verificada');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkPhonesTable();

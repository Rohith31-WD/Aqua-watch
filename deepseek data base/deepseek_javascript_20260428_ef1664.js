// Run this ONCE in the browser console to migrate data
async function migrateLocalStorageToSupabase() {
    const oldReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    for (const report of oldReports) {
        await supabase.from('reports').insert([{
            category: report.category,
            description: report.description,
            status: report.status || 'Open',
            latitude: report.latitude,
            longitude: report.longitude,
            location_name: report.location_name || '',
            reporter_name: report.reporter_name || 'Anonymous',
            points: report.points || 10
        }]);
    }
    
    console.log(`Migrated ${oldReports.length} reports to Supabase!`);
}

// migrateLocalStorageToSupabase(); // Uncomment to run
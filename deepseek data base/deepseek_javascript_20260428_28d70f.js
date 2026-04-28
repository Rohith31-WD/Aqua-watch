// ============================================
// OLD: localStorage.getItem('reports')
// NEW: Fetch from Supabase
// ============================================

// FETCH ALL REPORTS
async function fetchReports() {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Error fetching reports:', error);
        return [];
    }
    return data;
}

// SUBMIT A NEW REPORT (with photo upload)
async function submitReport(reportData, photoFile) {
    let photo_url = '';
    
    // If there's a photo, upload to Supabase Storage first
    if (photoFile) {
        const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('report-photos')
            .upload(fileName, photoFile, {
                contentType: 'image/jpeg',
                cacheControl: '3600'
            });
        
        if (uploadError) {
            console.error('Photo upload failed:', uploadError);
        } else {
            // Get the public URL
            const { data: urlData } = supabase
                .storage
                .from('report-photos')
                .getPublicUrl(fileName);
            
            photo_url = urlData.publicUrl;
        }
    }
    
    // Insert the report
    const { data, error } = await supabase
        .from('reports')
        .insert([{
            category: reportData.category,
            description: reportData.description,
            status: 'Open',
            latitude: reportData.latitude,
            longitude: reportData.longitude,
            location_name: reportData.location_name || '',
            photo_url: photo_url,
            reporter_name: reportData.reporter_name || 'Anonymous',
            points: 10
        }])
        .select()
        .single();
    
    if (error) {
        console.error('Error submitting report:', error);
        return null;
    }
    return data;
}

// UPDATE REPORT STATUS (Admin action)
async function updateReportStatus(reportId, newStatus) {
    const { data, error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId)
        .select()
        .single();
    
    if (error) {
        console.error('Error updating status:', error);
        return null;
    }
    return data;
}

// GET DASHBOARD STATS
async function fetchStats() {
    const { data, error } = await supabase
        .from('report_stats')
        .select('*')
        .single();
    
    if (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
    return data;
}

// GET LEADERBOARD
async function fetchLeaderboard() {
    const { data, error } = await supabase
        .from('leaderboard')
        .select('*');
    
    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
    return data;
}

// GET NEARBY REPORTS (for map clustering)
async function fetchNearbyReports(lat, lng, radiusKm = 10) {
    const { data, error } = await supabase
        .rpc('get_nearby_reports', {
            center_lat: lat,
            center_lng: lng,
            radius_km: radiusKm
        });
    
    if (error) {
        console.error('Error fetching nearby reports:', error);
        return [];
    }
    return data;
}
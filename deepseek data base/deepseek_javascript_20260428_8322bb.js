// REAL-TIME SUBSCRIPTION
function subscribeToReports() {
    const channel = supabase
        .channel('reports-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'reports' },
            (payload) => {
                console.log('Real-time update:', payload);
                
                // Refresh map markers
                loadMapMarkers();
                
                // Refresh stats
                loadStats();
                
                // Show notification for new reports
                if (payload.eventType === 'INSERT') {
                    showToast('🚨 New report submitted near you!');
                }
            }
        )
        .subscribe();
    
    return channel;
}

// Call this when the page loads
subscribeToReports();
-- Allow anyone to view photos
CREATE POLICY "Allow public view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-photos');

-- Allow anyone to upload photos
CREATE POLICY "Allow public upload photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'report-photos');

-- Allow anyone to delete their uploads
CREATE POLICY "Allow public delete photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'report-photos');
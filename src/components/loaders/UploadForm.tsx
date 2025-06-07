'use client';

import { useState } from 'react';

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        }as RequestInit);

        const data = await res.json();
        setImageUrl(data.publicUrl);
        setLoading(false);
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Загрузка...' : 'Загрузить'}
            </button>

            {imageUrl && (
                <div>
                    <p>Изображение загружено:</p>
                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: 300 }} />
                </div>
            )}
        </div>
    );
}

import { useEffect, useState, useCallback } from 'react';
import { generateThumbnailDataUrl } from '../../utils/generateThumbnail';
import Button from '../common/Button';

const ThumbnailGenerator = ({ title, categoryName, value, onChange }) => {
  const [seed, setSeed] = useState(0);
  const [generating, setGenerating] = useState(false);

  const regenerate = useCallback(async () => {
    setGenerating(true);
    const dataUrl = await generateThumbnailDataUrl({ title, category: categoryName, seed });
    onChange(dataUrl);
    setGenerating(false);
  }, [title, categoryName, seed, onChange]);

  // Auto-generate once there's a title and no thumbnail yet
  useEffect(() => {
    if (title && !value) regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const handleRegenerate = () => setSeed((s) => s + 1);
  useEffect(() => {
    if (seed > 0) regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  return (
    <div>
      <label className="text-sm font-medium block mb-2">Thumbnail</label>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-2 bg-gray-50 aspect-video flex items-center justify-center">
        {value ? (
          <img src={value} alt="Course thumbnail" className="w-full h-full object-cover" />
        ) : (
          <p className="text-xs text-gray-400">Enter a title to generate a thumbnail</p>
        )}
      </div>
      <Button type="button" variant="outline" onClick={handleRegenerate} disabled={!title || generating}>
        {generating ? 'Generating…' : '🎨 Regenerate thumbnail'}
      </Button>
      <p className="text-xs text-gray-400 mt-1">Auto-generated from your title — click regenerate for a different look.</p>
    </div>
  );
};

export default ThumbnailGenerator;